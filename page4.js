/* =========================================================
   PAGE 4 — เค้กวันเกิด
   ขั้นตอน: ปิดไฟ -> จุดเทียน -> ร้องเพลง -> อธิษฐาน -> เป่าเทียน -> เปิดไฟ + ฉลอง
   ========================================================= */


/* =========================================================
   ✏️ ตั้งค่า (แก้ตรงนี้ได้เลย)
   ========================================================= */

const CANDLE_COUNT  = 5;                       /* จำนวนเทียน */
const CANDLE_COLORS = ["#ff8fb8", "#b78ff2", "#ffd166", "#7fd6c2", "#ff8fb8"];
const NEXT_PAGE     = "page5.html";

/* เป่าไมค์: ถ้าเป่าแล้วเทียนไม่ดับ ลดค่า MIC_FLOOR / ถ้าพูดธรรมดาแล้วเทียนดับ เพิ่มค่า */
const MIC_FLOOR = 0.08;
const MIC_RANGE = 0.22;

/* ต้องเป่านานเท่าไรต่อเทียน 1 เล่ม (วินาที ที่แรงเต็ม) */
const BLOW_NEED = 0.5;

/* เนื้อร้อง 4 ท่อน (ทำนอง Happy Birthday สังเคราะห์ในโค้ด ไม่ต้องมีไฟล์เสียง) */
const LYRICS = [
    "Happy Birthday to you",
    "Happy Birthday to you",
    "Happy Birthday Happy Birthday",
    "Happy Birthday to kib💗"
];


/* =========================================================
   ELEMENTS / HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

const copyEl    = $("copy");
const controls  = $("controls");
const cake      = $("cake");
const candleBox = $("candles");
const flashEl   = $("flash");

const candles = [];

function fit() {
    const k = Math.min(1, (window.innerWidth - 32) / 340);
    document.documentElement.style.setProperty("--k", k.toFixed(3));
}
fit();
window.addEventListener("resize", fit);


function setCopy(html) {
    copyEl.innerHTML = html;
    copyEl.querySelectorAll("h1, p, .banner").forEach((e, i) => {
        e.classList.add("in");
        e.style.animationDelay = (i * 0.12) + "s";
    });
}

function setControls(...nodes) {
    controls.innerHTML = "";
    nodes.forEach((n) => controls.appendChild(n));
    controls.classList.remove("in");
    void controls.offsetWidth;
    controls.classList.add("in");
}

function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
}

function button(text, cls, onClick) {
    const b = el("button", "fx-btn " + (cls || ""), text);
    b.type = "button";
    if (onClick) b.addEventListener("click", onClick);
    return b;
}


/* =========================================================
   สร้างเทียน
   ========================================================= */

for (let i = 0; i < CANDLE_COUNT; i++) {

    const x = 160 + (i - (CANDLE_COUNT - 1) / 2) * 30;

    const c = el("div", "candle", '<div class="flame-wrap"><div class="flame"></div></div>');
    c.style.left = x + "px";
    c.style.setProperty("--c", CANDLE_COLORS[i % CANDLE_COLORS.length]);

    candleBox.appendChild(c);
    candles.push(c);
}


/* =========================================================
   STEP 1: INTRO
   ========================================================= */

function intro() {

    setCopy(`
        <h1>ถึงเวลาเป่าเค้กก 🎂</h1>
        <p>เค้กวันเกิดอยู่นี่... ลองปิดไฟดูก่อนสิ</p>
    `);

    candles.forEach((c, i) => setTimeout(() => c.classList.add("placed"), 500 + i * 140));

    setTimeout(() => {
        setControls(button("ปิดไฟ 🌙", "", lightsOff));
    }, 900);
}


/* =========================================================
   STEP 2: ปิดไฟ + จุดเทียน
   ========================================================= */

async function lightsOff() {

    controls.innerHTML = "";
    FX.sound.whoosh();

    /* ตำแหน่งสปอตไลต์ให้ตรงกับเทียน */
    const r = candleBox.getBoundingClientRect();
    const cy = (r.top + r.height * 0.12) / window.innerHeight * 100;
    document.documentElement.style.setProperty("--cy", cy.toFixed(1) + "%");

    setCopy("<h1>ปิดไฟแล้วนะ... 🌙</h1><p>เดี๋ยวจุดเทียนให้</p>");
    document.body.classList.add("dark");

    await FX.wait(1700);

    for (let i = 0; i < candles.length; i++) {
        candles[i].classList.add("lit");
        cake.style.setProperty("--glow", ((i + 1) / candles.length).toFixed(2));
        FX.sound.sparkle();
        await FX.wait(480);
    }

    await FX.wait(500);
    sing();
}


/* =========================================================
   STEP 3: ร้องเพลงวันเกิด
   ========================================================= */

/* โน้ต: [ความถี่, จำนวนจังหวะ] — ทำนอง Happy Birthday */
const SONG = [
    [392, 0.75], [392, 0.25], [440, 1], [392, 1], [523, 1], [494, 2],
    [392, 0.75], [392, 0.25], [440, 1], [392, 1], [587, 1], [523, 2],
    [392, 0.75], [392, 0.25], [784, 1], [659, 1], [523, 1], [494, 1], [440, 1],
    [698, 0.75], [698, 0.25], [659, 1], [523, 1], [587, 1], [523, 2]
];
const BEAT = 0.46;
const PHRASE_BEATS = 6;

let songTimers = [];

function playSong() {

    let t = 0;

    SONG.forEach(([f, b]) => {
        const id = setTimeout(() => {
            FX.tone(f, 0, b * BEAT * 1.5, "triangle", 0.11);
            FX.tone(f * 2, 0, b * BEAT, "sine", 0.04);
        }, t * 1000);
        songTimers.push(id);
        t += b * BEAT;
    });

    return t * 1000;
}

function stopSong() {
    songTimers.forEach(clearTimeout);
    songTimers = [];
}

function sing() {

    setCopy("<h1>เพลงวันเกิดสำหรับกุ๊บกิ้บบ 🎶</h1>");

    const eq    = el("div", "eq", "<i></i><i></i><i></i><i></i><i></i>");
    const lyric = el("div", "lyric", "");
    const skip  = el("button", "link-skip", "ข้ามไปอธิษฐาน");
    skip.type = "button";

    setControls(eq, lyric, skip);

    let finished = false;
    const timers = [];

    const end = () => {
        if (finished) return;
        finished = true;
        timers.forEach(clearTimeout);
        stopSong();
        FX.duck(false);
        wishStep();
    };

    skip.addEventListener("click", end);

    FX.duck(true);

    const total = FX.isMuted() ? 6000 : playSong() + 500;

    LYRICS.forEach((line, i) => {
        timers.push(setTimeout(() => {
            lyric.textContent = "";
            lyric.animate([{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], { duration: 400 });
            lyric.textContent = line;
        }, i * PHRASE_BEATS * BEAT * 1000));
    });

    timers.push(setTimeout(end, total));
}


/* =========================================================
   STEP 4: อธิษฐาน
   ========================================================= */

let wishText = "";

function wishStep() {

    setCopy("<h1>อธิษฐานก่อนนะ 🙏</h1><p>ตั้งใจอธิษฐานก่อนเป่าเทียนนน ✨</p>");

    const input = el("input", "wish-input");
    input.type = "text";
    input.maxLength = 60;
    input.placeholder = "พิมพ์คำอธิษฐาน (ไม่บอกพี่ก็ได้น้า)";
    input.autocomplete = "off";

    const go = () => {
        wishText = input.value.trim();
        FX.sound.chime();
        blowStep();
    };

    input.addEventListener("keydown", (e) => { if (e.key === "Enter") go(); });

    setControls(input, button("อธิษฐานเสร็จแล้ว ✨", "", go));
}


/* =========================================================
   STEP 5: เป่าเทียน (ไมค์ หรือ กดค้าง)
   ========================================================= */

let blowing    = false;
let holdActive = false;
let strength   = 0;
let energy     = 0;
let outCount   = 0;
let analyser   = null;
let micBuf     = null;
let micStream  = null;
let noteEl     = null;
let ringEl     = null;
let meterEl    = null;

function blowStep() {

    setCopy("<h1>เป่าเทียนเลย! 💨</h1><p>เป่าเข้าไมค์ หรือกดค้างปุ่มด้านล่างก็ได้</p>");

    ringEl  = el("div", "blow-ring", "💨");
    meterEl = el("div", "meter", "<i></i>");
    noteEl  = el("div", "mic-note", "");

    const row = el("div", "blow-row");

    const micBtn = button("🎤 เป่าเข้าไมค์", "ghost", () => startMic(micBtn));

    const hold = button("💨 กดค้างเพื่อเป่า", "blow-btn", null);

    const down = (e) => { e.preventDefault(); holdActive = true;  hold.classList.add("holding"); };
    const up   = ()  => { holdActive = false; hold.classList.remove("holding"); };

    hold.addEventListener("pointerdown", down);
    ["pointerup", "pointercancel", "pointerleave"].forEach((ev) => hold.addEventListener(ev, up));

    row.append(micBtn, hold);

    setControls(ringEl, meterEl, row, noteEl);

    blowing = true;
    requestAnimationFrame(blowLoop);
}

/* กดค้างปุ่ม Space ก็เป่าได้ */
document.addEventListener("keydown", (e) => {
    if (blowing && e.code === "Space" && !e.repeat) { e.preventDefault(); holdActive = true; }
});
document.addEventListener("keyup", (e) => {
    if (e.code === "Space") holdActive = false;
});


async function startMic(btn) {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        noteEl.textContent = "เบราว์เซอร์นี้ใช้ไมค์ไม่ได้ ลองกดค้างปุ่มแทนนะ 💨";
        return;
    }

    try {
        micStream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
        });

        const a   = FX.ctx();
        const src = a.createMediaStreamSource(micStream);

        analyser = a.createAnalyser();
        analyser.fftSize = 1024;
        micBuf = new Uint8Array(analyser.fftSize);
        src.connect(analyser);

        btn.disabled = true;
        btn.style.opacity = "0.6";
        noteEl.textContent = "เปิดไมค์แล้ว! เป่าเลย 💨";

    } catch (err) {
        noteEl.textContent = "ไม่ได้เปิดไมค์ ไม่เป็นไรนะ กดค้างปุ่มแทนได้เลย 💨";
    }
}


let lastT = 0;

function blowLoop(ts) {

    if (!blowing) return;

    const dt = Math.min(0.05, (ts - (lastT || ts)) / 1000);
    lastT = ts;

    let target = holdActive ? 1 : 0;

    if (analyser) {
        analyser.getByteTimeDomainData(micBuf);

        let sum = 0;
        for (let i = 0; i < micBuf.length; i++) {
            const v = (micBuf[i] - 128) / 128;
            sum += v * v;
        }

        const rms = Math.sqrt(sum / micBuf.length);
        target = Math.max(target, FX.clamp((rms - MIC_FLOOR) / MIC_RANGE, 0, 1));
    }

    strength += (target - strength) * Math.min(1, dt * 12);

    /* เปลวไฟเอนตามแรงลม */
    cake.style.setProperty("--lean", (strength * 20 + Math.sin(ts / 40) * strength * 4).toFixed(1));
    if (ringEl) ringEl.style.setProperty("--lvl", strength.toFixed(2));

    if (strength > 0.35) energy += strength * dt;
    else energy = Math.max(0, energy - dt * 0.25);

    const should = Math.min(candles.length, Math.floor(energy / BLOW_NEED));

    while (outCount < should) extinguish(outCount++);

    if (meterEl) meterEl.style.setProperty("--prog", FX.clamp(energy / (candles.length * BLOW_NEED), 0, 1).toFixed(3));

    if (outCount >= candles.length) {
        blowing = false;
        cake.style.setProperty("--lean", 0);
        stopMic();
        finale();
        return;
    }

    requestAnimationFrame(blowLoop);
}


function extinguish(i) {

    const c = candles[i];

    c.classList.remove("lit");
    c.classList.add("out");

    cake.style.setProperty("--glow", ((candles.length - outCount - 1) / candles.length).toFixed(2));

    FX.tone(180 + i * 25, 0, 0.16, "sine", 0.08);
    FX.vibrate(30);

    /* ควัน */
    const box = cake.getBoundingClientRect();
    const r   = c.getBoundingClientRect();
    const scale = box.width / 320;

    for (let k = 0; k < 4; k++) {
        const s = el("div", "smoke");
        s.style.left   = ((r.left - box.left) / scale + 5) + "px";
        s.style.bottom = (((box.bottom - r.top) / scale) - 4) + "px";
        cake.appendChild(s);

        s.animate(
            [
                { transform: "translate(0,0) scale(0.6)", opacity: 0.8 },
                { transform: `translate(${FX.rand(-14, 14)}px, ${-FX.rand(50, 90)}px) scale(${FX.rand(2, 3.4)})`, opacity: 0 }
            ],
            { duration: FX.rand(1500, 2400), delay: k * 140, easing: "ease-out", fill: "backwards" }
        ).onfinish = () => s.remove();
    }
}


function stopMic() {
    if (micStream) micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
    analyser = null;
}


/* =========================================================
   STEP 6: เปิดไฟ + ฉลอง
   ========================================================= */

async function finale() {

    controls.innerHTML = "";
    setCopy("<h1>...</h1>");

    /* คำอธิษฐานลอยขึ้นฟ้าในความมืด */
    const w = el("div", "wish-float", "");
    w.textContent = wishText ? "✨ " + wishText + " ✨" : "✨";
    document.body.appendChild(w);
    setTimeout(() => w.remove(), 5400);

    await FX.wait(2200);

    /* ไฟวาบ */
    flashEl.classList.add("go");
    document.body.classList.remove("dark");
    cake.style.setProperty("--glow", 0);

    FX.sound.fanfare();
    FX.sound.boom();

    const W = window.innerWidth, H = window.innerHeight;
    FX.confetti({ x: W * 0.15, y: H * 0.85, angle: -1.15, spread: 0.8, count: 90, power: 17 });
    FX.confetti({ x: W * 0.85, y: H * 0.85, angle: -2.0,  spread: 0.8, count: 90, power: 17 });
    setTimeout(() => FX.confetti({ x: W / 2, y: H * 0.4, count: 120, power: 12 }), 350);
    FX.rain(3500);

    launchBalloons();

    /* แบนเนอร์ */
    const letters = (word, start) =>
        [...word].map((ch, i) => `<span style="--d:${(start + i * 0.07).toFixed(2)}s">${ch}</span>`).join("");

    setCopy(`
        <div class="banner">
            <div class="word">${letters("HAPPY", 0.15)}</div>
            <div class="word">${letters("BIRTHDAY!", 0.6)}</div>
        </div>
        <p>ขอให้คำอธิษฐานของหนูเป็นจริงนะครับ ✨</p>
    `);

    await FX.wait(2200);

    setControls(button("พี่ยังมีของขวัญให้อีกนิดนุง 🎁", "", () => FX.go(NEXT_PAGE)));
}


function launchBalloons() {

    const colors = ["#ff7eb3", "#b78ff2", "#ffd166", "#7fd6c2", "#ff9ec5", "#ff5f7e"];

    for (let i = 0; i < 14; i++) {

        const b = el("div", "balloon");

        b.style.setProperty("--x",     FX.rand(3, 90).toFixed(1) + "%");
        b.style.setProperty("--b",     FX.pick(colors));
        b.style.setProperty("--sx",    FX.rand(14, 40).toFixed(0) + "px");
        b.style.setProperty("--dur",   FX.rand(8, 12).toFixed(1) + "s");
        b.style.setProperty("--delay", (i * 0.28).toFixed(2) + "s");

        document.body.appendChild(b);
        setTimeout(() => b.remove(), 15000);
    }
}


/* =========================================================
   START
   ========================================================= */

FX.ambient({ glyphs: ["♥", "🎂", "✨", "🎈", "♥"], count: 14, size: [14, 26] });

intro();