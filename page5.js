/* =========================================================
   PAGE 5 — กล่องของขวัญ -> บัตรพิเศษ -> พลุ + ตัวนับวันที่คบกัน
   ========================================================= */


/* =========================================================
   ✏️ ตั้งค่า (แก้ตรงนี้ได้เลย)
   ========================================================= */

/* บัตรพิเศษ — เพิ่ม/ลด/แก้ข้อความได้เลย (ใส่กี่ใบก็ได้) */
const COUPONS = [
    { emoji: "🤗", title: "บัตรกอดแน่นๆ 1 ครั้ง",        sub: "จะกอดให้แน่นฉุดๆ เพราะพี่ก็อยากกอดหนูววว 😍" },
    { emoji: "😁", title: "บัตรให้ทำอะไรก็ได้ 1 อย่าง",   sub: "ให้พี่ทำอะไรก็ด้ายว่ามาเล่ย อย่าแกล้งพี่เยอะล่ะ 😅" },
    { emoji: "🎵", title: "บัตรร้องเพลง 1 เพลง",       sub: "เพลงไรก็ด้าย ถ้าแก้วหูหนูทนไหว 🔊" },
    { emoji: "🥺", title: "บัตรให้เค้าง้อ 1 ครั้ง",        sub: "ใช้ตอนงอนได้เลย พี่จะง้อให้เต็มที่ที่สุด 😎" },
    { emoji: "💌", title: "บัตรขออะไรก็ได้ 1 ข้อ",              sub: "จะขออะไรก็ได้เลย (ล่ะมั้งนะ 😆)" }
];

/* วันแรกที่คบกัน (ปี ค.ศ., เดือน 1-12, วัน) — ใช้คำนวณตัวนับตอนจบ */
const START_YEAR  = 2026;
const START_MONTH = 6;
const START_DAY   = 10;

const LETTER_PAGE = "page3.html";
const REPLAY_PAGE = "index.html";


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

function showScene(id) {
    document.querySelectorAll(".scene").forEach((s) => s.classList.remove("active"));
    $(id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

FX.ambient({ glyphs: ["♥", "🎁", "✨", "♥"], count: 14, size: [14, 26] });


/* =========================================================
   SCENE 1 — กล่องของขวัญ (แตะ 3 ครั้ง)
   ========================================================= */

const gift    = $("gift");
const giftSub = $("gift-sub");
const dots    = [...$("tap-dots").children];

const TAP_TEXT = [
    "แรงๆ เลย... อีกนิดนึง!",
    "ใกล้แล้วว!! 😳",
    "..."
];

let taps = 0;
let opened = false;

function tapGift() {

    if (opened) return;

    taps++;
    dots.forEach((d, i) => d.classList.toggle("on", i < taps));

    const a = 4 + taps * 5;

    gift.animate(
        [
            { rotate: "0deg", scale: "1" },
            { rotate: `${-a}deg`, scale: "1.05" },
            { rotate: `${a}deg`, scale: "1.05" },
            { rotate: `${-a * 0.6}deg` },
            { rotate: `${a * 0.6}deg` },
            { rotate: "0deg", scale: "1" }
        ],
        { duration: 480, easing: "ease-in-out" }
    );

    FX.tone(300 + taps * 120, 0, 0.18, "triangle", 0.1);
    FX.vibrate(40 * taps);

    const r = gift.getBoundingClientRect();
    FX.heartBurst(r.left + r.width / 2, r.top + r.height * 0.4, 5 + taps * 2);

    giftSub.textContent = TAP_TEXT[taps - 1];

    if (taps >= 3) openGift();
}

gift.addEventListener("click", tapGift);
gift.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); tapGift(); }
});


async function openGift() {

    opened = true;

    await FX.wait(450);

    gift.classList.add("open");
    giftSub.textContent = "🎉";

    FX.sound.boom();
    FX.sound.fanfare();
    FX.confettiFrom(gift, { count: 160, power: 15 });
    FX.rain(2600);

    await FX.wait(2300);

    buildCoupons();
    showScene("scene-coupons");
}


/* =========================================================
   SCENE 2 — บัตรพิเศษ
   ========================================================= */

let flippedCount = 0;

function buildCoupons() {

    const list = $("coupon-list");

    COUPONS.forEach((c, i) => {

        const b = document.createElement("button");
        b.type = "button";
        b.className = "coupon";

        b.innerHTML = `
            <div class="coupon-inner">
                <div class="face front">
                    <span class="emoji">🎟️</span>
                    <div>
                        <div class="t1">บัตรพิเศษใบที่ ${i + 1}</div>
                        <div class="t2">แตะเพื่อเปิดดู ✨</div>
                    </div>
                </div>
                <div class="face back">
                    <span class="emoji"></span>
                    <div>
                        <div class="t1"></div>
                        <div class="t2"></div>
                    </div>
                    <span class="stamp">ใช้ได้เลย ✓</span>
                </div>
            </div>`;

        b.querySelector(".back .emoji").textContent = c.emoji;
        b.querySelector(".back .t1").textContent    = c.title;
        b.querySelector(".back .t2").textContent    = c.sub;

        b.addEventListener("click", () => flipCoupon(b));

        list.appendChild(b);

        /* บัตรร่วงลงมาจากกล่อง */
        b.animate(
            [
                { translate: "0 -300px", scale: "0.3", rotate: "-14deg", opacity: 0 },
                { translate: "0 0",      scale: "1",   rotate: "0deg",   opacity: 1 }
            ],
            { duration: 850, delay: 300 + i * 170, easing: "cubic-bezier(.3,1.4,.5,1)", fill: "backwards" }
        );

        setTimeout(() => FX.sound.pop(), 300 + i * 170);
    });
}


function flipCoupon(b) {

    if (b.classList.contains("flipped")) return;

    b.classList.add("flipped");
    flippedCount++;

    FX.sound.chime();
    FX.vibrate(30);
    FX.confettiFrom(b, { count: 40, power: 8 });

    $("coupon-sub").textContent = `เปิดแล้ว ${flippedCount} / ${COUPONS.length}`;

    if (flippedCount === COUPONS.length) {

        $("coupon-sub").textContent = "เปิดครบแล้ว! 🥰";

        setTimeout(() => {
            const act = $("coupon-actions");
            act.innerHTML = "";

            const next = document.createElement("button");
            next.type = "button";
            next.className = "fx-btn";
            next.textContent = "ไปตอนสุดท้ายของ Season นี้กันเถอะ 🕐";
            next.addEventListener("click", finale);

            act.appendChild(next);
            act.animate(
                [{ opacity: 0, transform: "scale(.5) translateY(30px)" }, { opacity: 1, transform: "none" }],
                { duration: 700, easing: "cubic-bezier(.3,1.6,.5,1)" }
            );
            next.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 900);
    }
}


/* =========================================================
   SCENE 3 — จบเรื่อง: พลุ + ตัวนับ
   ========================================================= */

const cv = $("fw-canvas");
const g  = cv.getContext("2d");

let W = 0, H = 0;
let rockets = [];
let sparks  = [];
let fwOn    = false;

function sizeFw() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    cv.width  = W * dpr;
    cv.height = H * dpr;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeFw();
window.addEventListener("resize", sizeFw);

const PAL = ["#ff7eb3", "#ffd166", "#c58bf2", "#ffffff", "#7fd6ff", "#ff9ec5", "#ffb36b"];


function launch(tx, ty, kind) {

    const sx = FX.rand(W * 0.25, W * 0.75);

    rockets.push({
        sx, sy: H + 10, tx, ty,
        x: sx, y: H + 10,
        t: 0,
        dur: FX.rand(42, 60),
        kind: kind || FX.pick(["round", "round", "ring", "heart"]),
        col: FX.pick(PAL)
    });
}


function burst(x, y, kind, col) {

    const add = (vx, vy, life, c) => sparks.push({
        x, y, vx, vy,
        life, max: life,
        col: c || col,
        size: FX.rand(1.6, 2.8)
    });

    if (kind === "heart") {

        const n = 76;
        for (let k = 0; k < n; k++) {
            const t = (k / n) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            add(hx * 0.21, -hy * 0.21, FX.rand(95, 125), "#ff7eb3");
        }

    } else if (kind === "ring") {

        const n = 60;
        for (let k = 0; k < n; k++) {
            const a = (k / n) * Math.PI * 2;
            add(Math.cos(a) * 4.2, Math.sin(a) * 4.2, FX.rand(70, 95));
        }
        for (let k = 0; k < 24; k++) {
            const a = FX.rand(0, 6.28), s = FX.rand(1, 2.4);
            add(Math.cos(a) * s, Math.sin(a) * s, FX.rand(60, 85), "#ffffff");
        }

    } else {

        for (let k = 0; k < 90; k++) {
            const a = FX.rand(0, 6.28), s = FX.rand(1, 5.6);
            add(Math.cos(a) * s, Math.sin(a) * s, FX.rand(65, 105), FX.rand(0, 1) < 0.25 ? FX.pick(PAL) : col);
        }
    }
}


function fwLoop() {

    if (!fwOn) return;

    /* จางหางแสงทีละนิด */
    g.globalCompositeOperation = "destination-out";
    g.fillStyle = "rgba(0,0,0,0.22)";
    g.fillRect(0, 0, W, H);

    g.globalCompositeOperation = "lighter";

    /* จรวด */
    rockets = rockets.filter((r) => {

        r.t += 1 / r.dur;
        const e = 1 - Math.pow(1 - Math.min(r.t, 1), 2);

        r.x = r.sx + (r.tx - r.sx) * e;
        r.y = r.sy + (r.ty - r.sy) * e;

        g.fillStyle = "#fff4d6";
        g.beginPath();
        g.arc(r.x, r.y, 2.2, 0, 6.283);
        g.fill();

        sparks.push({ x: r.x, y: r.y, vx: FX.rand(-0.3, 0.3), vy: FX.rand(0.2, 1), life: 18, max: 18, col: "#ffd9a0", size: 1.4 });

        if (r.t >= 1) {
            burst(r.tx, r.ty, r.kind, r.col);
            FX.tone(FX.rand(110, 190), 0, 0.28, "sine", 0.05);
            return false;
        }
        return true;
    });

    /* ประกายไฟ */
    sparks = sparks.filter((p) => {

        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        g.globalAlpha = Math.max(0, p.life / p.max);
        g.fillStyle = p.col;
        g.beginPath();
        g.arc(p.x, p.y, p.size, 0, 6.283);
        g.fill();

        return p.life > 0;
    });

    g.globalAlpha = 1;

    requestAnimationFrame(fwLoop);
}


function startFireworks() {

    if (fwOn) return;
    fwOn = true;
    requestAnimationFrame(fwLoop);

    /* เปิดฉากด้วยหัวใจกลางจอ */
    setTimeout(() => launch(W / 2, H * 0.3, "heart"), 500);
    setTimeout(() => launch(W * 0.25, H * 0.35, "round"), 1200);
    setTimeout(() => launch(W * 0.75, H * 0.35, "ring"), 1700);

    setInterval(() => {
        if (document.hidden) return;
        launch(FX.rand(W * 0.12, W * 0.88), FX.rand(H * 0.12, H * 0.45));
    }, 1500);
}

/* แตะท้องฟ้า = จุดพลุ */
document.addEventListener("pointerdown", (e) => {

    if (!document.body.classList.contains("finale")) return;
    if (e.target.closest("button")) return;

    launch(e.clientX, e.clientY, FX.pick(["round", "heart", "ring", "round"]));
    FX.sound.whoosh();
});


/* ดาวบนท้องฟ้า */
function makeStars() {

    const night = $("night");

    for (let i = 0; i < 70; i++) {
        const s = document.createElement("i");
        s.className = "star";
        s.style.left = FX.rand(0, 100) + "%";
        s.style.top  = FX.rand(0, 85) + "%";
        s.style.setProperty("--t", FX.rand(1.8, 4.5).toFixed(1) + "s");
        s.style.animationDelay = (-FX.rand(0, 4)).toFixed(1) + "s";
        const sz = FX.rand(1.5, 3.4);
        s.style.width = s.style.height = sz + "px";
        night.appendChild(s);
    }
}


/* ตัวนับวันที่คบกัน */
const START = new Date(START_YEAR, START_MONTH - 1, START_DAY, 0, 0, 0);

function tickCounter() {

    const ms = Math.max(0, Date.now() - START.getTime());
    const s  = Math.floor(ms / 1000);

    $("c-d").textContent = Math.floor(s / 86400);
    $("c-h").textContent = Math.floor(s / 3600) % 24;
    $("c-m").textContent = Math.floor(s / 60) % 60;
    $("c-s").textContent = s % 60;
}


function finale() {

    document.body.classList.add("finale");

    makeStars();
    showScene("scene-finale");

    FX.sound.fanfare();
    startFireworks();

    tickCounter();
    setInterval(tickCounter, 1000);

    /* ข้อความค่อยๆ โผล่ทีละบรรทัด */
    ["f1", "f2", "f3", "f4", "f5", "f6", "f7"].forEach((id, i) => {
        setTimeout(() => {
            $(id).classList.add("show");
            if (id === "f3") FX.sound.sparkle();
        }, 900 + i * 1200);
    });
}


$("btn-letter").addEventListener("click", () => FX.go(LETTER_PAGE));
$("btn-replay").addEventListener("click", () => FX.go(REPLAY_PAGE));