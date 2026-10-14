/* =========================================================
   PAGE 2 — แผนที่การเดินทาง
   ========================================================= */


/* =========================================================
   ✏️ ข้อมูลความทรงจำแต่ละ Checkpoint (แก้ตรงนี้ได้เลย)
   src      = ไฟล์รูปในโฟลเดอร์ assets/
   caption  = ข้อความใต้รูป
   ถ้ายังไม่มีไฟล์รูป ระบบจะโชว์รูปสำรองบอกชื่อไฟล์ที่ต้องใส่ให้
   ========================================================= */

const journeyData = [
    {
        stationName: "เดทแรกของเรา",
        photos: [
            { src: "assets/S__1359876_0.jpg", caption: "เดทแรกไปดูหนังด้วยกัน รู้สึกตื่นเต้นแปลกๆ เพราะหนูรึเปล่าน้า 😃" },
            { src: "assets/S__1359877_0.jpg", caption: "วันนั้นพี่มีความสุขม้าก เพราะพี่ได้มีแฟนคนแรก และได้ถ่ายโฟโต้บูทครั้งแรกด้วยย ❤️" }
        ]
    },
    {
        stationName: "ของขวัญจากคนน่ารัก",
        photos: [
            { src: "assets/41531.jpg", caption: "ของงานคัสต้อมที่ทำให้พรี่ ปิ้กที่ใช้ดีที่สุด แต่พี่ทำหายยย 😭" },
            { src: "assets/S__1417232_0.jpg", caption: "ครบรอบ 1 เดือน หนูก็ยังทำแผ่นพับมาให้ ใครจะน่ารักได้ขนาดนี้ ✨" }
        ]
    },
    {
        stationName: "ครั้งแรกของเราสอง",
        photos: [
            { src: "assets/S__1359878_0.jpg", caption: "คนแรกที่ทำให้หูพี่มีรู แต่ไอเลิฟยูน้า 🥰" },
            { src: "assets/S__1359879_0.jpg", caption: "ไปอ่านหนังสือด้วยกันครั้งแรกกก แต่ได้อ่านมั้ยน้าาา 🙈" }
        ]
    },
    {
        stationName: "ทริปล่าสุดของเรา",
        photos: [
            { src: "assets/S__1359882_0.jpg", caption: "โฟโต้บูทแบบFullHD กับคนน่ารักแบบUltra 💕" },
            { src: "assets/S__1359883_0.jpg", caption: "ใครกินใครอ้วนใครกลม ทำไมมีแต่พี่กินน 😂"}
        ]
    }
];

/* จุดควบคุมเส้นโค้งระหว่างแต่ละ Checkpoint (หน่วย % ของแผนที่)
   ถ้าย้าย Checkpoint ใน page2.html แล้วอยากให้เส้นโค้งเปลี่ยน แก้ตรงนี้ */
const CURVES = [
    [[75, 15], [75, 38]],   /* จุด 1 -> 2 */
    [[25, 42], [20, 68]],   /* จุด 2 -> 3 */
    [[50, 72], [70, 82]]    /* จุด 3 -> 4 */
];

/* ปรับความไว: ขูดกี่ % ถึงจะถือว่าสำเร็จ */
const SCRATCH_GOAL = 45;

/* หน้าถัดไปเมื่อดูครบทุกด่าน */
const NEXT_PAGE = "page3.html";


/* =========================================================
   STATE
   ========================================================= */

const $ = (s) => document.querySelector(s);

const NS        = "http://www.w3.org/2000/svg";
const mapEl     = $("#map");
const svg       = $("#route-svg");
const routeBase = $("#route-base");
const routeDone = $("#route-done");
const avatar    = $("#avatar");
const cps       = [...document.querySelectorAll(".checkpoint")];
const N         = journeyData.length;

const STORE_KEY = "lj_station";

let currentStation = 0;       /* ด่านที่กำลังเล่นอยู่ */
let viewStation    = 0;       /* ด่านที่กำลังเปิดดู (scratch/album) */
let busy           = false;   /* กันกดซ้อนระหว่างอวาตาร์เดิน */

let stops    = [];            /* ความยาวเส้นทาง ณ แต่ละ Checkpoint */
let total    = 0;
let curLen   = 0;


/* =========================================================
   โหลดรูปล่วงหน้า (กันรูปโผล่ช้า/ขึ้นว่างตอนเลื่อนไปรูปถัดไป)
   ========================================================= */

const imgCache = new Map();

function preload(src) {

    if (imgCache.has(src)) return imgCache.get(src);

    const p = new Promise((resolve) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
            const done = () => resolve(src);
            if (im.decode) im.decode().then(done, done);
            else done();
        };
        im.onerror = () => resolve(null);
        im.src = src;
    });

    imgCache.set(src, p);
    return p;
}

/* รอรูปแต่ไม่เกิน ms (กันค้างถ้าเน็ตช้ามาก) */
function preloadWithin(src, ms) {
    return Promise.race([preload(src), FX.wait(ms)]);
}

function preloadStation(i) {
    return Promise.all(journeyData[i].photos.map((p) => preload(p.src)));
}

/* เริ่มจากด่านที่เล่นอยู่ ไล่ไปจนครบ ทีละด่านเพื่อไม่แย่งเน็ตกัน */
async function preloadAll(from) {
    for (let k = 0; k < N; k++) {
        await preloadStation((from + k) % N);
    }
}


/* =========================================================
   ROUTE  — สร้างเส้นเป็นพิกเซลจริง เพื่อไม่ให้เส้นเพี้ยนตอนย่อขยาย
   ========================================================= */

function buildRoute() {

    const W = mapEl.clientWidth;
    const H = mapEl.clientHeight;

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const P = cps.map((c) => [
        parseFloat(c.style.left) / 100 * W,
        parseFloat(c.style.top)  / 100 * H
    ]);

    const C = CURVES.map((seg) => seg.map(([x, y]) => [x / 100 * W, y / 100 * H]));

    let d = `M ${P[0][0]},${P[0][1]}`;
    stops = [0];

    const tmp = document.createElementNS(NS, "path");
    svg.appendChild(tmp);

    C.forEach((c, i) => {
        d += ` C ${c[0][0]},${c[0][1]} ${c[1][0]},${c[1][1]} ${P[i + 1][0]},${P[i + 1][1]}`;
        tmp.setAttribute("d", d);
        stops.push(tmp.getTotalLength());
    });

    tmp.remove();

    routeBase.setAttribute("d", d);
    routeDone.setAttribute("d", d);

    total = stops[stops.length - 1];
    routeDone.style.strokeDasharray = `${total} ${total}`;

    setProgress(stops[currentStation] || 0);
}


/* ย้ายอวาตาร์ + ระบายเส้นสีตามระยะ */
function setProgress(len) {

    curLen = len;

    const p = routeDone.getPointAtLength(len);

    avatar.style.left = p.x + "px";
    avatar.style.top  = p.y + "px";

    routeDone.style.strokeDashoffset = total - len;
    routeDone.style.opacity = len > 2 ? 1 : 0;
}


function travel(from, to, ms) {

    return new Promise((resolve) => {

        const t0 = performance.now();
        let lastSpark = 0;

        avatar.classList.add("moving");

        (function frame(now) {

            const k = Math.min(1, (now - t0) / ms);
            const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;

            setProgress(from + (to - from) * e);

            if (now - lastSpark > 75) {
                lastSpark = now;
                trailSpark();
            }

            if (k < 1) {
                requestAnimationFrame(frame);
            } else {
                avatar.classList.remove("moving");
                resolve();
            }
        })(t0);
    });
}


function trailSpark() {

    const s = document.createElement("span");
    s.className = "trail-spark";
    s.textContent = FX.pick(["✦", "♥", "✧"]);
    s.style.left = (parseFloat(avatar.style.left) + FX.rand(-8, 8)) + "px";
    s.style.top  = (parseFloat(avatar.style.top) - 6 + FX.rand(-6, 6)) + "px";
    mapEl.appendChild(s);

    s.animate(
        [
            { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
            { transform: `translate(${FX.rand(-18, 18)}px, ${FX.rand(8, 30)}px) scale(0.2)`, opacity: 0 }
        ],
        { duration: 800, easing: "ease-out" }
    ).onfinish = () => s.remove();
}


/* =========================================================
   CHECKPOINT STATES
   ========================================================= */

function applyStates(popIndex = -1) {

    cps.forEach((cp, i) => {

        cp.classList.toggle("completed", i < currentStation);
        cp.classList.toggle("active",    i === currentStation);
        cp.classList.toggle("locked",    i > currentStation);

        const dot = cp.querySelector(".cp-dot");

        if (i === N - 1)           dot.textContent = "🎁";
        else if (i < currentStation) dot.textContent = "✓";
        else                         dot.textContent = i + 1;
    });

    /* หัวใจนับความคืบหน้า */
    const box = $("#trail-hearts");
    const had = box.children.length ? [...box.children].filter((x) => x.classList.contains("on")).length : 0;

    if (!box.children.length) {
        for (let i = 0; i < N; i++) {
            const h = document.createElement("i");
            h.textContent = "💗";
            box.appendChild(h);
        }
    }

    [...box.children].forEach((h, i) => {
        const on = i < currentStation;
        if (on && !h.classList.contains("on")) {
            h.classList.add("on");
        } else if (!on) {
            h.classList.remove("on");
        }
    });

    $("#trail-text").textContent = `${Math.min(currentStation, N)} / ${N} ความทรงจำ`;

    if (popIndex >= 0) {
        const el = cps[popIndex];
        el.classList.add("pop");
        setTimeout(() => el.classList.remove("pop"), 900);
    }
}


cps.forEach((cp) => {
    cp.addEventListener("click", () => openCheckpoint(parseInt(cp.dataset.i, 10)));
});


function openCheckpoint(i) {

    if (busy || i > currentStation) return;

    FX.sound.pop();

    if (i < currentStation) {
        openAlbum(i, true);          /* ผ่านแล้ว: ดูซ้ำได้เลย ไม่ต้องขูด */
    } else {
        startScratch(i);
    }
}


/* =========================================================
   SCRATCH CARD
   ========================================================= */

const scratchModal  = $("#scratch-modal");
const scratchArea   = $("#scratch-area");
const scratchCanvas = $("#scratch-canvas");
const scratchImg    = $("#scratch-reveal-img");
const scratchFill   = $("#scratch-progress-fill");
const btnScratchDone = $("#btn-scratch-done");
const sctx          = scratchCanvas.getContext("2d", { willReadFrequently: true });

let scratching  = false;
let scratchDone = false;
let lastPt      = null;
let lastCheck   = 0;
let lastBit     = 0;


let opening = false;
let drawnW  = 0;
let drawnH  = 0;
let touched = false;

/* ถ้าขนาดกรอบเปลี่ยน (โมดัลเปิดเสร็จ / หมุนจอไอแพด) และยังไม่ได้ขูด ให้วาดแผ่นใหม่ให้พอดี */
function refitScratch() {
    if (!scratchModal.classList.contains("open") || scratchDone || touched) return;
    if (scratchArea.clientWidth !== drawnW || scratchArea.clientHeight !== drawnH) drawCover();
}

window.addEventListener("resize", refitScratch);
window.addEventListener("orientationchange", () => setTimeout(refitScratch, 300));

async function startScratch(i) {

    if (opening) return;
    opening = true;

    viewStation = i;
    scratchDone = false;
    scratching  = false;

    scratchFill.style.width = "0%";
    btnScratchDone.style.display = "none";

    /* ถ้ารูปยังโหลดไม่เสร็จ บอกให้รู้ว่ากำลังรอ */
    const src = journeyData[i].photos[0].src;
    const slow = setTimeout(() => FX.toast("กำลังโหลดรูป... 💗", 3000), 350);

    await preloadWithin(src, 6000);
    await FX.setImage(scratchImg, src);

    clearTimeout(slow);

    /* วาดแผ่นปิดทับให้เสร็จก่อน แล้วค่อยเปิดโมดัล (ไม่มีเฟรมที่เห็นรูปข้างใต้) */
    drawCover();
    scratchModal.classList.add("open");

    /* เช็คอีกรอบหลังแอนิเมชันเปิดโมดัลจบ */
    setTimeout(refitScratch, 650);

    opening = false;
}


function drawCover() {

    /* ปิด transition ชั่วคราว ไม่งั้นแผ่นจะค่อยๆ fade กลับมาจากรอบที่แล้ว */
    scratchCanvas.style.transition = "none";
    scratchCanvas.style.opacity = "1";
    scratchCanvas.style.pointerEvents = "auto";

    /* วัดจากกรอบแม่ (นิ่งกว่า canvas บน Safari/iPad) แล้วล็อกขนาด canvas เป็นพิกเซลตรง ๆ */
    const dpr = 1;
    const w = scratchArea.clientWidth;
    const h = scratchArea.clientHeight;

    drawnW = w;
    drawnH = h;
    touched = false;

    scratchCanvas.style.width  = w + "px";
    scratchCanvas.style.height = h + "px";

    scratchCanvas.width  = w * dpr;
    scratchCanvas.height = h * dpr;
    sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sctx.globalCompositeOperation = "source-over";

    /* แผ่นปิดทับ: ไล่สีชมพู-ม่วง */
    const g = sctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0,    "#f3c9ec");
    g.addColorStop(0.5,  "#c9a0ef");
    g.addColorStop(1,    "#f8bbd9");
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, w, h);

    /* ลายเกร็ดประกาย */
    for (let i = 0; i < 160; i++) {
        sctx.globalAlpha = FX.rand(0.15, 0.7);
        sctx.fillStyle = "#ffffff";
        sctx.beginPath();
        sctx.arc(FX.rand(0, w), FX.rand(0, h), FX.rand(0.6, 2.2), 0, 6.283);
        sctx.fill();
    }

    /* หัวใจจาง ๆ เป็นลายพื้น */
    sctx.globalAlpha = 0.14;
    sctx.font = "26px serif";
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    for (let y = 24; y < h; y += 52) {
        for (let x = ((y / 52) % 2 ? 24 : 50); x < w; x += 52) {
            sctx.fillText("♥", x, y);
        }
    }

    sctx.globalAlpha = 1;
    sctx.fillStyle = "#6a1b9a";
    sctx.font = "bold 19px Kanit, sans-serif";
    sctx.fillText("✨ ใช้นิ้วถูตรงนี้เลย ✨", w / 2, h / 2);

    void scratchCanvas.offsetWidth;
    scratchCanvas.style.transition = "";
}


function canvasPoint(e) {
    const r = scratchCanvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
}


scratchCanvas.addEventListener("pointerdown", (e) => {

    if (scratchDone) return;

    scratching = true;
    touched = true;
    scratchCanvas.setPointerCapture(e.pointerId);
    lastPt = canvasPoint(e);
    scratchTo(lastPt, true);
});

scratchCanvas.addEventListener("pointermove", (e) => {
    if (scratching) scratchTo(canvasPoint(e), false);
});

["pointerup", "pointercancel", "pointerleave"].forEach((ev) => {
    scratchCanvas.addEventListener(ev, () => { scratching = false; lastPt = null; });
});


function scratchTo(p, first) {

    sctx.globalCompositeOperation = "destination-out";
    sctx.lineWidth = 46;
    sctx.lineCap   = "round";
    sctx.lineJoin  = "round";

    sctx.beginPath();
    sctx.moveTo(lastPt.x, lastPt.y);
    sctx.lineTo(p.x + (first ? 0.01 : 0), p.y);
    sctx.stroke();

    lastPt = p;

    const now = performance.now();

    /* ประกายตามนิ้ว */
    if (now - lastBit > 90) {
        lastBit = now;

        const b = document.createElement("span");
        b.className = "scratch-bit";
        b.textContent = FX.pick(["✦", "✧", "✨"]);
        b.style.left = (p.x + FX.rand(-14, 14)) + "px";
        b.style.top  = (p.y + FX.rand(-14, 14)) + "px";
        scratchArea.appendChild(b);

        b.animate(
            [
                { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
                { transform: `translate(-50%, ${FX.rand(14, 36)}px) scale(0.2)`, opacity: 0 }
            ],
            { duration: 650, easing: "ease-out" }
        ).onfinish = () => b.remove();

        FX.sound.tick();
    }

    if (now - lastCheck > 220) {
        lastCheck = now;
        checkScratchProgress();
    }
}


function checkScratchProgress() {

    if (scratchDone) return;

    const w = scratchCanvas.width;
    const h = scratchCanvas.height;
    const px = sctx.getImageData(0, 0, w, h).data;

    let clear = 0, seen = 0;

    /* สุ่มเช็คแบบข้ามพิกเซลเพื่อประหยัดแรง */
    for (let i = 3; i < px.length; i += 4 * 19) {
        seen++;
        if (px[i] === 0) clear++;
    }

    const percent = Math.round(clear / seen * 100);

    scratchFill.style.width = Math.min(100, percent * (100 / SCRATCH_GOAL)) + "%";

    if (percent >= SCRATCH_GOAL) completeScratch();
}


function completeScratch() {

    scratchDone = true;
    scratching  = false;

    scratchFill.style.width = "100%";
    scratchCanvas.style.opacity = "0";
    scratchCanvas.style.pointerEvents = "none";

    FX.sound.chime();
    FX.vibrate(60);
    FX.confettiFrom(scratchArea, { count: 90, power: 10 });

    btnScratchDone.style.display = "block";
}


btnScratchDone.addEventListener("click", () => {
    scratchModal.classList.remove("open");
    setTimeout(() => openAlbum(viewStation, false), 280);
});

$("#btn-scratch-close").addEventListener("click", () => scratchModal.classList.remove("open"));


/* =========================================================
   ALBUM
   ========================================================= */

const albumModal   = $("#album-modal");
const albumImg     = $("#album-img");
const albumCaption = $("#album-caption");
const albumCounter = $("#photo-counter");
const btnPrev      = $("#btn-prev");
const btnNext      = $("#btn-next");
const btnContinue  = $("#btn-continue");
const polaroid     = $("#polaroid");

let photoIndex  = 0;
let reviewMode  = false;
let sliding     = false;


function openAlbum(i, review) {

    viewStation = i;
    reviewMode  = review;
    photoIndex  = 0;

    showPhoto(0, 0, true);
    albumModal.classList.add("open");
}


const photoFrame = document.querySelector(".photo-frame");

async function showPhoto(idx, dir, instant) {

    const photos = journeyData[viewStation].photos;

    if (sliding) return;
    sliding = true;

    photoIndex = idx;

    const src = photos[idx].src;

    /* เริ่มโหลดรูปใหม่ทันที ระหว่างที่รูปเก่าเลื่อนออก */
    const ready = preloadWithin(src, 8000);

    let out = null;
    if (!instant && dir !== 0) {
        out = albumImg.animate(
            [{ transform: "translateX(0)", opacity: 1 },
             { transform: `translateX(${-dir * 50}px)`, opacity: 0 }],
            { duration: 200, easing: "ease-in", fill: "forwards" }
        );
        await out.finished;
    }

    /* ถ้ายังไม่พร้อมให้โชว์หัวใจเต้นรอ แทนที่จะเป็นช่องว่าง */
    const slow = setTimeout(() => photoFrame.classList.add("loading"), 120);
    await ready;
    await FX.setImage(albumImg, src);
    clearTimeout(slow);
    photoFrame.classList.remove("loading");

    /* ภาพใหม่เลื่อนเข้า */
    if (!instant && dir !== 0) {
        const inn = albumImg.animate(
            [{ transform: `translateX(${dir * 50}px)`, opacity: 0 },
             { transform: "translateX(0)", opacity: 1 }],
            { duration: 280, easing: "cubic-bezier(.2,.8,.3,1)" }
        );
        if (out) out.cancel();
        await inn.finished;
    }

    /* โหลดรูปข้างเคียงรอไว้ */
    [idx - 1, idx + 1].forEach((n) => { if (photos[n]) preload(photos[n].src); });

    /* โพลารอยด์เอียงสลับข้าง */
    polaroid.classList.toggle("alt", idx % 2 === 1);

    /* ข้อความใต้รูป: พิมพ์ทีละตัว */
    albumCaption.textContent = "";
    FX.typewriter(albumCaption, photos[idx].caption, { speed: [14, 26] });

    albumCounter.textContent = `${idx + 1} / ${photos.length}`;

    btnPrev.style.visibility = idx === 0 ? "hidden" : "visible";

    const last = idx === photos.length - 1;

    btnNext.style.display = last ? "none" : "inline-block";

    if (last) {
        btnContinue.textContent =
            reviewMode ? "กลับไปที่แผนที่ 🗺️"
            : (viewStation === N - 1 ? "ไปที่ของขวัญกันเถอะ 🎁" : "ออกเดินทางต่อ 🚀");
        btnContinue.style.display = "block";
    } else {
        btnContinue.style.display = "none";
    }

    sliding = false;
}


function changePhoto(step) {

    const photos = journeyData[viewStation].photos;
    const next = photoIndex + step;

    if (next < 0 || next >= photos.length || sliding) return;

    FX.sound.tap();
    showPhoto(next, step, false);
}


btnPrev.addEventListener("click", () => changePhoto(-1));
btnNext.addEventListener("click", () => changePhoto(1));

function closeAlbum() { albumModal.classList.remove("open"); }

$("#btn-album-close").addEventListener("click", closeAlbum);

/* เลื่อนนิ้วเพื่อเปลี่ยนรูป */
let swipeX = null;

polaroid.addEventListener("pointerdown", (e) => { swipeX = e.clientX; });

polaroid.addEventListener("pointerup", (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 45) changePhoto(dx < 0 ? 1 : -1);
});

document.addEventListener("keydown", (e) => {

    if (albumModal.classList.contains("open")) {
        if (e.key === "ArrowRight") changePhoto(1);
        if (e.key === "ArrowLeft")  changePhoto(-1);
        if (e.key === "Escape")     closeAlbum();
    }

    if (e.key === "Escape") scratchModal.classList.remove("open");
});

/* คลิกพื้นหลังเพื่อปิด */
[albumModal, scratchModal].forEach((m) => {
    m.addEventListener("pointerdown", (e) => {
        if (e.target === m) m.classList.remove("open");
    });
});


btnContinue.addEventListener("click", () => {

    if (reviewMode) {
        closeAlbum();
        return;
    }
    continueJourney();
});


/* =========================================================
   CONTINUE JOURNEY
   ========================================================= */

async function continueJourney() {

    if (busy) return;
    busy = true;

    const i = currentStation;

    closeAlbum();
    await FX.wait(450);

    /* ฉลองที่จุดนี้ */
    FX.confettiFrom(cps[i], { count: 80, power: 10 });
    FX.sound.chime();

    currentStation++;
    sessionStorage.setItem(STORE_KEY, String(currentStation));

    cps[i].classList.remove("active");
    cps[i].classList.add("completed");
    cps[i].querySelector(".cp-dot").textContent = i === N - 1 ? "🎁" : "✓";

    applyStates();

    avatar.classList.add("hop");
    await FX.wait(500);
    avatar.classList.remove("hop");

    if (currentStation < N) {

        FX.sound.whoosh();
        await travel(stops[i], stops[i + 1], 2000);

        applyStates(currentStation);
        FX.sound.pop();
        avatar.classList.add("hop");
        setTimeout(() => avatar.classList.remove("hop"), 800);

        busy = false;

    } else {

        /* ดูครบทุกจุดแล้ว */
        sessionStorage.removeItem(STORE_KEY);
        FX.rain(1800);
        FX.sound.fanfare();

        await FX.wait(1500);
        FX.go(NEXT_PAGE);
    }
}


/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    FX.ambient({ count: 16, size: [10, 24] });

    const saved = parseInt(sessionStorage.getItem(STORE_KEY) || "0", 10);
    currentStation = Number.isFinite(saved) ? Math.max(0, Math.min(N - 1, saved)) : 0;

    buildRoute();
    applyStates();

    /* โหลดรูปทุกด่านเงียบๆ เบื้องหลัง เริ่มจากด่านปัจจุบัน */
    preloadAll(currentStation);
});

window.addEventListener("resize", () => {
    if (!busy) buildRoute();
});
