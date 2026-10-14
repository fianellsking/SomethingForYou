/* =========================================================
   fx.js  —  เอฟเฟกต์กลางที่ทุกหน้าเรียกใช้ผ่านตัวแปร FX

   ใส่ <script src="fx.js"></script> ใน <head> ของทุกหน้า
   (ก่อนสคริปต์ของหน้านั้น ๆ)

   เสียงเอฟเฟกต์สร้างจากโค้ดทั้งหมด ไม่ต้องมีไฟล์เสียง
   ถ้าอยากได้เพลงพื้นหลัง: วางไฟล์ไว้ที่  assets/music.mp3
   ========================================================= */

(function () {
    "use strict";

    const root = document.documentElement;
    const reduce = window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- storage ที่ไม่พังถ้าถูกบล็อก ---------- */
    const store = {
        get(k, d) {
            try {
                const v = sessionStorage.getItem(k);
                return v === null ? d : v;
            } catch (e) { return d; }
        },
        set(k, v) {
            try { sessionStorage.setItem(k, v); } catch (e) {}
        }
    };

    /* ---------- helpers ---------- */
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

    const COLORS = ["#ff6fa5", "#ff9ec5", "#c58bf2", "#8e5bd6", "#ffd166", "#ffffff", "#ff4f7b"];

    /* เปิดหน้าด้วยวงกลมหด */
    if (!reduce) {
        root.classList.add("fx-entering");
        setTimeout(() => root.classList.remove("fx-entering"), 1500);
    }


    /* =====================================================
       เสียง (WebAudio สังเคราะห์เอง)
       ===================================================== */

    let actx = null;
    let muted = store.get("fx_muted", "0") === "1";

    function ctx() {
        if (!actx) {
            const C = window.AudioContext || window.webkitAudioContext;
            if (!C) return null;
            actx = new C();
        }
        if (actx.state === "suspended") actx.resume();
        return actx;
    }

    function tone(freq, delay = 0, dur = 0.3, type = "sine", vol = 0.1) {
        if (muted) return;
        const a = ctx();
        if (!a) return;

        const t = a.currentTime + delay;
        const o = a.createOscillator();
        const g = a.createGain();

        o.type = type;
        o.frequency.setValueAtTime(freq, t);

        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(vol, t + 0.015);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        o.connect(g);
        g.connect(a.destination);
        o.start(t);
        o.stop(t + dur + 0.05);
    }

    function noise(dur, f0, f1, vol) {
        if (muted) return;
        const a = ctx();
        if (!a) return;

        const len = Math.floor(a.sampleRate * dur);
        const buf = a.createBuffer(1, len, a.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

        const src = a.createBufferSource();
        src.buffer = buf;

        const f = a.createBiquadFilter();
        f.type = "bandpass";
        f.Q.value = 0.9;

        const t = a.currentTime;
        f.frequency.setValueAtTime(f0, t);
        f.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.8);

        const g = a.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(vol, t + dur * 0.35);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(f);
        f.connect(g);
        g.connect(a.destination);
        src.start(t);
    }

    const sound = {
        tap()     { tone(660, 0, 0.12, "triangle", 0.07); },
        pop()     { tone(520, 0, 0.09, "sine", 0.11); tone(780, 0.05, 0.13, "sine", 0.09); },
        tick()    { tone(1200, 0, 0.04, "square", 0.025); },
        sparkle() { tone(rand(1500, 2300), 0, 0.28, "sine", 0.05); },
        chime()   { [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 0.55, "sine", 0.1)); },
        error()   { tone(220, 0, 0.18, "sawtooth", 0.05); tone(165, 0.12, 0.26, "sawtooth", 0.05); },
        whoosh()  { noise(0.55, 260, 2600, 0.14); },
        fanfare() {
            [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) =>
                tone(f, i * 0.12, 0.5, "triangle", 0.1));
        },
        boom()    { tone(110, 0, 0.35, "sine", 0.18); noise(0.45, 900, 180, 0.12); }
    };


    /* =====================================================
       เพลงพื้นหลัง + ปุ่มเปิด/ปิดเสียง
       ===================================================== */

    const music = { el: null, on: !muted, started: false, baseVol: 0.55 };

    function initMusic() {
        const btn = document.createElement("button");
        btn.className = "fx-music";
        btn.type = "button";
        btn.setAttribute("aria-label", "เปิด/ปิดเสียง");
        btn.dataset.nofx = "1";
        document.body.appendChild(btn);

        const paint = () => {
            btn.classList.toggle("on", !muted);
            btn.innerHTML = muted ? "<span>🔇</span>" : "<span>🎵</span>";
        };
        paint();

        const el = new Audio("assets/music.mp3");
        el.loop = true;
        el.preload = "auto";
        el.volume = music.baseVol;
        music.el = el;

        const t0 = parseFloat(store.get("fx_music_t", "0")) || 0;
        el.addEventListener("loadedmetadata", () => {
            if (t0 > 0 && el.duration && t0 < el.duration) el.currentTime = t0;
        });
        el.addEventListener("error", () => { music.el = null; });

        const start = () => {
            if (music.started || muted || !music.el) return;
            music.el.play().then(() => { music.started = true; }).catch(() => {});
        };

        start();
        ["pointerdown", "keydown", "touchstart"].forEach((ev) =>
            window.addEventListener(ev, start, { passive: true }));

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            muted = !muted;
            store.set("fx_muted", muted ? "1" : "0");
            paint();

            if (music.el) {
                if (muted) music.el.pause();
                else { music.started = false; start(); }
            }
            if (!muted) sound.pop();
        });

        const save = () => {
            if (music.el && !music.el.paused) store.set("fx_music_t", String(music.el.currentTime));
        };
        setInterval(save, 1000);
        window.addEventListener("pagehide", save);
    }

    /* หรี่เสียงเพลงลงชั่วคราว (เช่นตอนร้องเพลงวันเกิด) */
    function duck(on) {
        const el = music.el;
        if (!el) return;
        const target = on ? 0.08 : music.baseVol;
        const from = el.volume;
        const t0 = performance.now();
        (function step(now) {
            const k = clamp((now - t0) / 700, 0, 1);
            el.volume = clamp(from + (target - from) * k, 0, 1);
            if (k < 1) requestAnimationFrame(step);
        })(t0);
    }


    /* =====================================================
       คอนเฟตตี
       ===================================================== */

    let cv = null, cx = null, parts = [], raf = 0, W = 0, H = 0;

    function sizeCanvas() {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        W = window.innerWidth;
        H = window.innerHeight;
        cv.width = W * dpr;
        cv.height = H * dpr;
        cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function ensureConfetti() {
        if (cv) return;
        cv = document.createElement("canvas");
        cv.className = "fx-confetti";
        document.body.appendChild(cv);
        cx = cv.getContext("2d");
        sizeCanvas();
        window.addEventListener("resize", sizeCanvas);
    }

    function heartPath(g, s) {
        g.beginPath();
        g.moveTo(0, s * 0.3);
        g.bezierCurveTo(-s * 1.5, -s * 0.6, -s * 0.9, -s * 1.5, 0, -s * 0.65);
        g.bezierCurveTo(s * 0.9, -s * 1.5, s * 1.5, -s * 0.6, 0, s * 0.3);
        g.fill();
    }

    function confetti(o = {}) {
        ensureConfetti();
        const count = reduce ? Math.min(o.count || 90, 24) : (o.count || 90);
        const x = o.x == null ? W / 2 : o.x;
        const y = o.y == null ? H / 2 : o.y;
        const spread = o.spread == null ? Math.PI * 2 : o.spread;
        const angle = o.angle == null ? -Math.PI / 2 : o.angle;
        const power = o.power || 11;

        for (let i = 0; i < count; i++) {
            const a = angle + (Math.random() - 0.5) * spread;
            const v = rand(power * 0.35, power);
            parts.push({
                x, y,
                vx: Math.cos(a) * v,
                vy: Math.sin(a) * v,
                g: o.gravity || 0.27,
                size: rand(6, 12),
                rot: rand(0, 6.28),
                vr: rand(-0.25, 0.25),
                tilt: rand(0, 6.28),
                color: pick(COLORS),
                shape: Math.random() < 0.28 ? 2 : (Math.random() < 0.5 ? 1 : 0),
                life: rand(110, 190)
            });
        }
        if (!raf) raf = requestAnimationFrame(confettiLoop);
    }

    function confettiLoop() {
        cx.clearRect(0, 0, W, H);
        parts = parts.filter((p) => p.life > 0 && p.y < H + 40);

        for (const p of parts) {
            p.vx *= 0.985;
            p.vy = p.vy * 0.985 + p.g;
            p.x += p.vx;
            p.y += p.vy;
            p.rot += p.vr;
            p.tilt += 0.13;
            p.life--;

            cx.save();
            cx.translate(p.x, p.y);
            cx.rotate(p.rot);
            cx.globalAlpha = clamp(p.life / 40, 0, 1);
            cx.fillStyle = p.color;

            if (p.shape === 2) {
                heartPath(cx, p.size * 0.55);
            } else if (p.shape === 1) {
                cx.beginPath();
                cx.arc(0, 0, p.size * 0.4, 0, 6.283);
                cx.fill();
            } else {
                cx.scale(1, Math.cos(p.tilt));
                cx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            }
            cx.restore();
        }

        raf = parts.length ? requestAnimationFrame(confettiLoop) : 0;
        if (!parts.length) cx.clearRect(0, 0, W, H);
    }

    /* ฝนคอนเฟตตีจากด้านบน */
    function rain(ms = 2500) {
        ensureConfetti();
        const end = performance.now() + ms;
        const id = setInterval(() => {
            if (performance.now() > end) { clearInterval(id); return; }
            confetti({
                x: rand(0, W), y: -10, count: 6,
                angle: Math.PI / 2, spread: 0.9, power: 4, gravity: 0.12
            });
        }, 120);
    }

    /* จุดระเบิดจากองค์ประกอบหนึ่ง */
    function confettiFrom(el, o = {}) {
        if (!el) return confetti(o);
        const r = el.getBoundingClientRect();
        confetti(Object.assign({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, o));
    }


    /* =====================================================
       ประกาย (เคอร์เซอร์ + แตะ)
       ===================================================== */

    function spark(x, y, ch, o = {}) {
        const s = document.createElement("span");
        s.className = "fx-spark";
        s.textContent = ch || pick(["✦", "✧", "♥", "✨"]);
        s.style.left = x + "px";
        s.style.top = y + "px";
        s.style.fontSize = (o.size || rand(10, 20)) + "px";
        s.style.color = o.color || pick(COLORS.slice(0, 5));
        document.body.appendChild(s);

        const dx = o.dx != null ? o.dx : rand(-34, 34);
        const dy = o.dy != null ? o.dy : rand(18, 48);

        const anim = s.animate(
            [
                { transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2) rotate(140deg)`, opacity: 0 }
            ],
            { duration: o.duration || rand(650, 1100), easing: "cubic-bezier(.2,.7,.3,1)" }
        );
        anim.onfinish = () => s.remove();
    }

    function heartBurst(x, y, n = 6) {
        for (let i = 0; i < n; i++) {
            const a = (Math.PI * 2 * i) / n + rand(-0.3, 0.3);
            const d = rand(26, 54);
            spark(x, y, "♥", {
                size: rand(11, 19),
                color: pick(["#ff6fa5", "#ff9ec5", "#c58bf2"]),
                dx: Math.cos(a) * d,
                dy: Math.sin(a) * d - 14,
                duration: rand(600, 950)
            });
        }
    }

    function initPointerFx() {
        if (reduce) return;
        let last = 0;

        window.addEventListener("pointermove", (e) => {
            if (e.pointerType !== "mouse") return;
            const now = performance.now();
            if (now - last < 55) return;
            last = now;
            spark(e.clientX, e.clientY);
        }, { passive: true });

        window.addEventListener("pointerdown", (e) => {
            if (e.target.closest && e.target.closest("[data-nofx]")) return;
            heartBurst(e.clientX, e.clientY, 6);
        }, { passive: true });
    }


    /* =====================================================
       ฉากหลังหัวใจ/อีโมจิลอยขึ้น (ใช้หน้า 2-5)
       ===================================================== */

    function ambient(o = {}) {
        const glyphs = o.glyphs || ["♥"];
        const count = o.count || 18;
        const colors = o.colors || ["#ee6b9f", "#c58bf2", "#ff9ec5"];
        const size = o.size || [10, 22];

        const c = document.createElement("canvas");
        c.className = "fx-ambient";
        c.style.zIndex = o.z == null ? 0 : o.z;
        document.body.prepend(c);

        const g = c.getContext("2d");
        let w = 0, h = 0;

        function resize() {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            w = window.innerWidth;
            h = window.innerHeight;
            c.width = w * dpr;
            c.height = h * dpr;
            g.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resize();
        window.addEventListener("resize", resize);

        const make = (init) => ({
            x: Math.random() * w,
            y: init ? Math.random() * h : h + 30,
            s: rand(size[0], size[1]),
            v: rand(0.25, 0.8),
            ph: rand(0, 6.28),
            a: rand(0.18, 0.46),
            r: rand(0, 6.28),
            vr: rand(-0.012, 0.012),
            ch: pick(glyphs),
            col: pick(colors)
        });

        const items = [];
        for (let i = 0; i < count; i++) items.push(make(true));

        (function loop(t) {
            g.clearRect(0, 0, w, h);

            items.forEach((p, i) => {
                p.y -= p.v;
                p.r += p.vr;
                if (p.y < -40) { items[i] = make(false); return; }

                g.save();
                g.translate(p.x + Math.sin(t / 1400 + p.ph) * 14, p.y);
                g.rotate(p.r);
                g.globalAlpha = p.a;

                if (p.ch === "♥") {
                    g.fillStyle = p.col;
                    heartPath(g, p.s * 0.55);
                } else {
                    g.font = p.s + 'px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
                    g.textAlign = "center";
                    g.textBaseline = "middle";
                    g.fillText(p.ch, 0, 0);
                }
                g.restore();
            });

            requestAnimationFrame(loop);
        })(0);

        return c;
    }


    /* =====================================================
       ไปหน้าอื่นพร้อมทรานซิชัน
       ===================================================== */

    function go(url) {
        if (go.busy) return;
        go.busy = true;

        if (music.el && !music.el.paused) {
            store.set("fx_music_t", String(music.el.currentTime));
        }
        sound.whoosh();

        const c = document.createElement("div");
        c.className = "fx-curtain";
        c.innerHTML = "<span>💗</span>";
        document.body.appendChild(c);

        requestAnimationFrame(() => c.classList.add("in"));
        setTimeout(() => { window.location.href = url; }, reduce ? 0 : 950);
    }

    /* กด Back กลับมาแล้วม่านยังค้าง */
    window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
            document.querySelectorAll(".fx-curtain").forEach((n) => n.remove());
            go.busy = false;
        }
    });


    /* =====================================================
       พิมพ์ข้อความทีละตัว (ตัดตามกลุ่มอักษร ไม่ทำสระไทยหลุด)
       ===================================================== */

    function graphemes(text) {
        if (window.Intl && Intl.Segmenter) {
            return Array.from(new Intl.Segmenter("th", { granularity: "grapheme" }).segment(text),
                (s) => s.segment);
        }
        return Array.from(text);
    }

    function typewriter(el, text, o = {}) {
        const segs = graphemes(text);
        const sp = o.speed || [30, 60];
        const node = document.createTextNode("");
        el.appendChild(node);

        let i = 0, timer = 0, resolve;
        const promise = new Promise((r) => (resolve = r));

        function step() {
            if (i >= segs.length) { resolve(); return; }
            const ch = segs[i++];
            node.data += ch;
            if (o.onChar) o.onChar(ch);

            let d = rand(sp[0], sp[1]);
            if (/[,.!?…]/.test(ch)) d += 130;
            timer = setTimeout(step, d);
        }
        step();

        return {
            promise,
            skip() {
                clearTimeout(timer);
                node.data = segs.join("");
                i = segs.length;
                resolve();
            }
        };
    }


    /* =====================================================
       อื่น ๆ
       ===================================================== */

    let toastTimer = 0;
    function toast(msg, ms = 2600) {
        let t = document.querySelector(".fx-toast");
        if (!t) {
            t = document.createElement("div");
            t.className = "fx-toast";
            document.body.appendChild(t);
        }
        t.textContent = msg;
        void t.offsetWidth;
        t.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => t.classList.remove("show"), ms);
    }

    function shake(el) {
        if (!el) return;
        el.classList.remove("fx-shake");
        void el.offsetWidth;
        el.classList.add("fx-shake");
        setTimeout(() => el.classList.remove("fx-shake"), 500);
    }

    function vibrate(p) {
        try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {}
    }

    /* รูปสำรองเวลาไฟล์ภาพยังไม่ถูกใส่ */
    function placeholder(src) {
        const name = String(src || "").split("/").pop();
        const svg =
            "<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'>" +
            "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
            "<stop offset='0' stop-color='#ffd6e8'/><stop offset='1' stop-color='#dcc6f7'/>" +
            "</linearGradient></defs>" +
            "<rect width='600' height='600' fill='url(#g)'/>" +
            "<text x='300' y='300' font-size='120' text-anchor='middle'>💗</text>" +
            "<text x='300' y='372' font-size='26' text-anchor='middle' fill='#8a4a7a' font-family='sans-serif'>" +
            "ใส่รูปที่ assets/" + name + "</text></svg>";
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }

    /* โหลดรูป พร้อมใช้รูปสำรองถ้าไม่เจอไฟล์ — resolve เมื่อพร้อมแสดง */
    function setImage(img, src) {
        return new Promise((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => {
                img.onerror = null;
                img.onload = () => resolve();
                img.src = placeholder(src);
            };
            img.src = src;
        });
    }


    /* =====================================================
       export
       ===================================================== */

    window.FX = {
        reduce, rand, pick, wait, clamp,
        sound, tone, ctx,
        isMuted: () => muted,
        duck,
        confetti, confettiFrom, rain,
        spark, heartBurst,
        ambient,
        go,
        typewriter, graphemes,
        toast, shake, vibrate,
        placeholder, setImage
    };

    document.addEventListener("DOMContentLoaded", () => {
        initMusic();
        initPointerFx();
    });
})();