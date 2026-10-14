/* =========================================================
   PAGE 3 — แกลเลอรี + ซองจดหมายล็อค 2 ชั้น
   ========================================================= */


/* =========================================================
   ✏️ ตั้งค่า (แก้ตรงนี้ได้เลย)
   ========================================================= */

/* แกลเลอรี — 1 การ์ด = 1 อัลบั้ม ใส่รูปได้กี่รูปก็ได้ใน photos
   รูปแรกในลิสต์จะเป็นรูปปกของการ์ด (หรือจะกำหนด cover: "assets/xxx.jpg" แยกก็ได้)
   ไฟล์รูปวางไว้ที่ assets/  ถ้ายังไม่มีไฟล์จะโชว์รูปสำรองบอกชื่อไฟล์ให้ */
const MEMORIES = [
    {
        title: "ไปดูหนังด้วยกันนน",
        date: "",
        photos: [
            "assets/S__1417226_0.jpg",
            "assets/S__1359876_0.jpg",
            "assets/S__1433604_0.jpg",
            "assets/S__1433605_0.jpg",
            "assets/S__1433606_0.jpg"
        ]
    },
    {
        title: "มื้ออ้วน ๆ ของพี่กลมกับน้องกิ้บบ",
        date: "",
        photos: [
            "assets/S__1433608_0.jpg",
            "assets/S__1433609_0.jpg",
            "assets/S__1433610_0.jpg",
            "assets/S__1433611_0.jpg"
        ]
    },
    {
        title: "โปโป้บู้ทททท",
        date: "",
        photos: [
            "assets/S__1433617.jpg",
            "assets/S__1417227_0.jpg",
            "assets/S__1417228_0.jpg",
            "assets/S__1417229_0.jpg",
            "assets/S__1417230_0.jpg",
            "assets/S__1417231_0.jpg"
        ]
    }
];

/* ล็อคชั้นที่ 1: วันแรกที่คบกัน (วันเดือนปี 8 หลัก — รับทั้ง พ.ศ. และ ค.ศ.) */
const ANNIVERSARY_DATES = ["10062569", "10062026"];
const HINT_AFTER = 3;
const HINT_TEXT  = "ใบ้: เรียงเป็น วัน/เดือน/ปี ที่เราเริ่มคบกันนะ 💗";

/* ล็อคชั้นที่ 2: คำถาม (ลำดับตัวเลือกจะสุ่มทุกครั้ง) */
const QUIZ = {
    question: "หนังเรื่องแรกที่เราดูด้วยกันคือเรื่องอะไรคะ? 🎬",
    options: ["Haunted 4", "The Odyssey", "Thee yod 3", "Obsession"],
    answer: "Haunted 4"
};

/* จดหมาย — พิมพ์แก้ข้อความได้เลย (1 บรรทัดใน [] = 1 ย่อหน้า) */
const LETTER = {
    to: "ถึงคนเก่งและคนที่น่ารักที่สุดในโล้กของเค้า ✨",
    paragraphs: [
        "สุขสันต์วันเกิดนะสุดที่รักของเค้า 🎂",
        "ขอบคุณที่พี่ได้มาเจอหนูนะ มันเปลี่ยนพี่ไปเยอะเลยล่ะ ขอบคุณที่หนูเป็นหนูแบบนี้ และขอบคุณที่ให้พี่ได้เป็นส่วนหนึ่งของวันเวลาของหนูน้า",
        "ทุกวันที่ได้คุยกัน พี่มีความสุขมากเลย ชอบเวลาได้คุยกับหนู ชอบเวลาได้เจอหนู และชอบหนูมากกว่าใคร",
        "พี่คงไม่ใช่คนที่จะพูดคำหวานเก่งนัก และก็คงไม่ใช่คนที่โรแมนติกอะไร แต่สิ่งที่พี่ทำให้หนูทั้งของขวัญชิ้นนี้ หรือสิ่งต่าง ๆ ที่ผ่านมา พี่ทำมาจากความตั้งใจของพี่จริง ๆ นะค้าบ",
        "ขอให้หนูมีชีวิตที่มีความสุขตลอดจากนี้ ได้ในสิ่งที่หวังทุกอย่าง ขอให้หนูประสบความสำเร็จในทุก ๆ เรื่อง หนูเป็นคนเก่งและเป็นคนที่มีความพยายามมากสำหรับพี่ ขอให้เราได้อยู่ด้วยกันนาน ๆ นะพี่รักหนูมากจริง ๆ จากใจของพี่",
        "พี่จะอยู่ตรงนี้ คอยช่วยเหลือหนูเสมอไม่ว่าจะเกิดอะไรก็ตาม ขอให้หนูนึกไว้ว่ามีพี่เสมอ พี่พร้อมจะรับฟังหนูทุกเรื่อง ใช้ชีวิตให้เต็มที่ พี่จะซัพพอร์ตหนูและเดินไปกับหนู จะอยู่เคียงข้างไม่ทิ้งหนูไปไหนแน่นอน",
        "เราจะรักกัน มากขึ้นกว่าเดิมในทุก ๆ วัน เราจะไม่ปล่อยมือกันไม่ว่าจะเจอปัญหาอะไร เราจะรักกันเสมอไม่ว่าอะไรจะเกิดขึ้น และขอให้เรารักกันตลอดไป"
    ],
    sign: "ตาต้า รักกุ๊บกิ้บที่สุดในสามโลก 💜❤️",
    from: "— ตาต้า"
};

/* หน้าถัดไป */
const NEXT_PAGE = "page4.html";


/* =========================================================
   HELPERS
   ========================================================= */

const $ = (s) => document.querySelector(s);

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) {
            en.target.classList.add("visible");
            revealObserver.unobserve(en.target);
        }
    });
}, { threshold: 0.15 });


/* =========================================================
   1. GALLERY
   ========================================================= */

const grid = $("#photo-grid");

MEMORIES.forEach((m, i) => {

    const photos = m.photos || [];
    const cover  = m.cover || photos[0];

    const card = document.createElement("button");
    card.type = "button";
    card.className = "photo-card reveal";
    card.style.setProperty("--d", (i * 0.12) + "s");

    card.innerHTML = `
        <div class="photo-tilt">
            <div class="photo-box">
                <img alt="">
                <span class="photo-count"></span>
                <div class="photo-overlay"><span>กดเพื่อดูอัลบั้ม ✨</span></div>
            </div>
            <div class="photo-caption"><h3></h3><p></p></div>
        </div>`;

    card.querySelector("h3").textContent = m.title;
    card.querySelector("p").textContent  = m.date;
    card.querySelector("img").alt        = m.title;
    card.querySelector(".photo-count").textContent = "📷 " + photos.length;
    FX.setImage(card.querySelector("img"), cover);

    /* เอียงตามเมาส์ + แสงสะท้อน */
    const tilt = card.querySelector(".photo-tilt");
    let tiltBusy = false;

    tilt.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse" || tiltBusy) return;
        tiltBusy = true;
        requestAnimationFrame(() => { tiltBusy = false; });

        const r  = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;

        tilt.style.setProperty("--ry", ((px - 0.5) * 14) + "deg");
        tilt.style.setProperty("--rx", (-(py - 0.5) * 14) + "deg");
        tilt.style.setProperty("--gx", (px * 100) + "%");
        tilt.style.setProperty("--gy", (py * 100) + "%");
        tilt.style.setProperty("--glare", "1");
    });

    tilt.addEventListener("pointerleave", () => {
        ["--rx", "--ry"].forEach((p) => tilt.style.setProperty(p, "0deg"));
        tilt.style.setProperty("--glare", "0");
    });

    card.addEventListener("click", () => openAlbum(i));

    grid.appendChild(card);
});

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));


/* =========================================================
   2. ALBUM (ไลท์บ็อกซ์หลายรูป)
   ========================================================= */

const modal    = $("#imageModal");
const mImg     = $("#modalImg");
const mTitle   = $("#modalTitle");
const mCount   = $("#modalCount");
const mPhoto   = $("#modalPhoto");
const thumbsEl = $("#thumbs");
const btnPrev  = $("#lb-prev");
const btnNext  = $("#lb-next");

let albumIdx = 0;
let photoIdx = 0;
let sliding  = false;

function curPhotos() { return MEMORIES[albumIdx].photos || []; }

function buildThumbs() {

    thumbsEl.innerHTML = "";

    curPhotos().forEach((src, k) => {
        const t  = document.createElement("button");
        const im = document.createElement("img");

        t.type = "button";
        t.className = "thumb";
        t.setAttribute("aria-label", "รูปที่ " + (k + 1));

        im.alt = "";
        im.decoding = "async";
        FX.setImage(im, src);

        t.appendChild(im);
        t.addEventListener("click", () => goTo(k));
        thumbsEl.appendChild(t);
    });

    const many = curPhotos().length > 1;
    thumbsEl.hidden = !many;
    btnPrev.hidden  = !many;
    btnNext.hidden  = !many;
}

function markThumb() {
    [...thumbsEl.children].forEach((t, k) => t.classList.toggle("on", k === photoIdx));
    const on = thumbsEl.children[photoIdx];
    if (on) on.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
}

async function showPhoto(idx, dir) {

    if (sliding) return;
    sliding = true;

    const photos = curPhotos();
    photoIdx = idx;

    let out = null;

    if (dir !== 0) {
        out = mImg.animate(
            [{ transform: "translateX(0)", opacity: 1 },
             { transform: `translateX(${-dir * 60}px)`, opacity: 0 }],
            { duration: 180, easing: "ease-in", fill: "forwards" }
        );
        await out.finished;
    }

    await FX.setImage(mImg, photos[idx]);

    if (dir !== 0) {
        const inn = mImg.animate(
            [{ transform: `translateX(${dir * 60}px)`, opacity: 0 },
             { transform: "translateX(0)", opacity: 1 }],
            { duration: 280, easing: "cubic-bezier(.2,.8,.3,1)" }
        );
        out.cancel();
        await inn.finished;
    }

    mCount.textContent = `${idx + 1} / ${photos.length}`;
    markThumb();

    /* โหลดรูปข้างเคียงรอไว้ล่วงหน้า */
    [idx - 1, idx + 1].forEach((n) => {
        if (photos[n]) { const pre = new Image(); pre.src = photos[n]; }
    });

    sliding = false;
}

function step(d) {
    const n = curPhotos().length;
    if (n < 2 || sliding) return;
    FX.sound.tap();
    showPhoto((photoIdx + d + n) % n, d);
}

function goTo(k) {
    if (k === photoIdx || sliding) return;
    FX.sound.tap();
    showPhoto(k, k > photoIdx ? 1 : -1);
}

function openAlbum(i) {
    albumIdx = i;
    mTitle.textContent = MEMORIES[i].title;
    buildThumbs();
    showPhoto(0, 0);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    FX.sound.pop();
}

function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

$("#modal-close").addEventListener("click", closeModal);
btnPrev.addEventListener("click", () => step(-1));
btnNext.addEventListener("click", () => step(1));

modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

/* ปัดซ้าย/ขวาเพื่อเปลี่ยนรูป */
let swipeX = null;
mPhoto.addEventListener("pointerdown", (e) => { swipeX = e.clientX; });
mPhoto.addEventListener("pointerup", (e) => {
    if (swipeX === null) return;
    const dx = e.clientX - swipeX;
    swipeX = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
});

document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("open")) return;
    if (e.key === "Escape")     closeModal();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft")  step(-1);
});


/* =========================================================
   3. ล็อคซองจดหมาย 2 ชั้น
   ========================================================= */

const wrap     = $("#envelope-wrap");
const envelope = $("#envelope");
const paper    = $("#env-paper");
const lock1    = $("#lock-1");
const lock2    = $("#lock-2");
const padlock  = $("#padlock");
const pinBox   = $("#anniversary-pin-container");
const lockMsg  = $("#lock1-msg");
const hint     = $("#letter-hint");

let pinLocked  = false;
let wrongCount = 0;


/* ----- ช่องกรอกวันที่ 2-2-4 ----- */

const boxes = [];

[2, 2, 4].forEach((n, gi) => {

    if (gi > 0) {
        const sep = document.createElement("span");
        sep.className = "pin-sep";
        sep.textContent = "/";
        pinBox.appendChild(sep);
    }

    const g = document.createElement("div");
    g.className = "pin-group";

    for (let k = 0; k < n; k++) {
        const b = document.createElement("input");
        b.type = "text";
        b.className = "pin-box-2";
        b.maxLength = 1;
        b.inputMode = "numeric";
        b.autocomplete = "off";
        b.setAttribute("aria-label", "หลักที่ " + (boxes.length + 1));
        g.appendChild(b);
        boxes.push(b);
    }

    pinBox.appendChild(g);
});

boxes.forEach((b, i) => {

    b.addEventListener("input", () => {
        b.value = b.value.replace(/\D/g, "").slice(-1);
        b.classList.toggle("filled", !!b.value);
        if (b.value) FX.sound.tap();
        if (b.value && i < boxes.length - 1) boxes[i + 1].focus();
        checkPin();
    });

    b.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && !b.value && i > 0) {
            boxes[i - 1].value = "";
            boxes[i - 1].classList.remove("filled");
            boxes[i - 1].focus();
        }
        if (e.key === "ArrowLeft"  && i > 0)                  boxes[i - 1].focus();
        if (e.key === "ArrowRight" && i < boxes.length - 1)   boxes[i + 1].focus();
    });

    b.addEventListener("paste", (e) => {

        e.preventDefault();

        const t = ((e.clipboardData || window.clipboardData).getData("text") || "")
            .replace(/\D/g, "").slice(0, 8);

        [...t].forEach((ch, k) => {
            boxes[k].value = ch;
            boxes[k].classList.add("filled");
        });

        boxes[Math.min(t.length, boxes.length - 1)].focus();
        checkPin();
    });

    b.addEventListener("focus", () => b.select());
});

/* แตะตรงไหนในแถวก็โฟกัสช่องที่ว่างช่องแรก */
pinBox.addEventListener("click", (e) => {
    if (e.target.classList.contains("pin-box-2")) return;
    (boxes.find((b) => !b.value) || boxes[0]).focus();
});


function checkPin() {

    if (pinLocked) return;

    const v = boxes.map((b) => b.value).join("");
    if (v.length < boxes.length) return;

    pinLocked = true;

    if (ANNIVERSARY_DATES.includes(v)) {

        lockMsg.style.color = "#2e7d32";
        lockMsg.textContent = "ถูกต้องแล้วค่ะ! ปลดล็อคความทรงจำ 💕";

        boxes.forEach((b, i) => b.style.setProperty("--i", i));
        pinBox.classList.add("ok");
        document.activeElement && document.activeElement.blur();

        unlockStep1();

    } else {

        wrongCount++;

        lockMsg.style.color = "#e53935";
        lockMsg.textContent = wrongCount >= HINT_AFTER
            ? HINT_TEXT
            : "งือออ จำวันคบกันไม่ได้หรอคะ 🥺";

        FX.shake(pinBox);
        FX.sound.error();
        FX.vibrate([60, 40, 60]);

        setTimeout(() => {
            boxes.forEach((b) => { b.value = ""; b.classList.remove("filled"); });
            boxes[0].focus();
            pinLocked = false;
        }, 520);
    }
}


async function unlockStep1() {

    padlock.classList.add("opening");
    FX.sound.tick();

    await FX.wait(750);

    FX.sound.chime();
    FX.confettiFrom(padlock, { count: 50, power: 8 });

    lock1.classList.add("gone");
    await FX.wait(450);

    hint.textContent = "ล็อคที่สอง... ลองตอบคำถามนี้ดูนะ 🗝️";
    lock2.classList.add("show");
}


/* ----- ล็อคชั้นที่ 2: ควิซ ----- */

const quizOpts = $("#quiz-options");
const quizMsg  = $("#quiz-msg");

$("#quiz-question").textContent = QUIZ.question;

[...QUIZ.options]
    .sort(() => Math.random() - 0.5)
    .forEach((opt) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "quiz-opt";
        b.textContent = opt;
        b.addEventListener("click", () => answer(b, opt));
        quizOpts.appendChild(b);
    });

let quizDone = false;

async function answer(btn, opt) {

    if (quizDone) return;

    if (opt === QUIZ.answer) {

        quizDone = true;

        btn.classList.add("right");
        [...quizOpts.children].forEach((b) => { if (b !== btn) b.style.opacity = "0.4"; b.disabled = true; });

        quizMsg.style.color = "#2e7d32";
        quizMsg.textContent = "ถูกต้องแล้วค่าา! เก่งที่สุดเลย 🥰";

        FX.sound.chime();
        FX.confettiFrom(btn, { count: 70, power: 9 });

        await FX.wait(1100);

        lock2.classList.add("gone");
        await FX.wait(500);

        openEnvelope();

    } else {

        btn.classList.add("wrong");

        quizMsg.style.color = "#e53935";
        quizMsg.textContent = "ไม่ใช่เรื่องนี้น้าา ลองนึกดูดีๆ สิมาริโอ้ 🥺";

        FX.shake(quizOpts);
        FX.sound.error();
        FX.vibrate([60, 40, 60]);
    }
}


/* ----- เปิดซอง: ฝาพลิก -> กระดาษโผล่ -> ซองหุบหาย -> แผ่นจดหมายขึ้นมา ----- */

function collapse(el) {

    return new Promise((resolve) => {

        el.style.height = el.offsetHeight + "px";
        el.style.overflow = "hidden";
        void el.offsetHeight;

        el.style.transition =
            "height 0.9s cubic-bezier(.7,0,.3,1), opacity 0.7s ease, padding-top 0.9s ease, margin 0.9s ease";

        el.style.height = "0px";
        el.style.paddingTop = "0px";
        el.style.opacity = "0";
        el.style.marginTop = "0px";
        el.style.marginBottom = "0px";

        setTimeout(resolve, 950);
    });
}

async function openEnvelope() {

    wrap.classList.add("opening");
    await FX.wait(300);

    envelope.classList.add("open");
    FX.sound.whoosh();
    await FX.wait(950);

    envelope.classList.add("rise");
    FX.sound.sparkle();
    await FX.wait(1600);

    FX.confettiFrom(paper, { count: 90, power: 11 });
    FX.sound.fanfare();
    await FX.wait(900);

    hint.style.transition = "opacity 0.5s ease";
    hint.style.opacity = "0";

    await collapse(wrap);

    wrap.hidden = true;
    hint.hidden = true;

    startLetter();
}


/* ----- แผ่นจดหมาย + พิมพ์ทีละตัว ----- */

const sheet     = $("#letter-sheet");
const sheetTo   = $("#sheet-to");
const sheetBody = $("#sheet-body");
const sheetSign = $("#sheet-sign");
const skipBtn   = $("#skip-type");

let skipping = false;
let activeTyper = null;

skipBtn.addEventListener("click", () => {
    skipping = true;
    if (activeTyper) activeTyper.skip();
    skipBtn.hidden = true;
});

async function startLetter() {

    sheet.hidden = false;
    void sheet.offsetWidth;
    sheet.classList.add("show");

    sheet.scrollIntoView({ behavior: "smooth", block: "start" });
    await FX.wait(900);

    const caret = document.createElement("span");
    caret.className = "caret";

    async function typeInto(el, text) {

        let n = 0;

        activeTyper = FX.typewriter(el, text, {
            speed: [26, 52],
            onChar: () => {
                if (++n % 18 === 0) keepInView(el);
            }
        });

        el.appendChild(caret);

        if (skipping) activeTyper.skip();

        await activeTyper.promise;
    }

    function keepInView(el) {
        const r = el.getBoundingClientRect();
        if (r.bottom > window.innerHeight - 90) {
            window.scrollBy({ top: r.bottom - window.innerHeight + 140, behavior: "smooth" });
        }
    }

    await typeInto(sheetTo, LETTER.to);

    for (const text of LETTER.paragraphs) {
        const p = document.createElement("p");
        sheetBody.appendChild(p);
        keepInView(p);
        await typeInto(p, text);
        if (!skipping) await FX.wait(420);
    }

    caret.remove();
    skipBtn.hidden = true;

    sheetSign.innerHTML = "";
    sheetSign.append(LETTER.sign);
    const small = document.createElement("small");
    small.textContent = LETTER.from;
    sheetSign.appendChild(small);

    void sheetSign.offsetWidth;
    sheetSign.classList.add("show");

    FX.sound.chime();
    FX.confettiFrom(sheetSign, { count: 80, power: 10 });

    await FX.wait(1200);

    const next = $("#next-btn");
    next.hidden = false;
    next.scrollIntoView({ behavior: "smooth", block: "center" });
}


/* =========================================================
   4. ปุ่มนำทาง
   ========================================================= */

$("#next-btn").addEventListener("click", () => FX.go(NEXT_PAGE));
$("#back-btn").addEventListener("click", () => FX.go("index.html"));


/* =========================================================
   5. ฉากหลัง
   ========================================================= */

FX.ambient({
    glyphs: ["♥", "💜", "💖", "✨", "🌸", "♥"],
    count: 16,
    size: [14, 26]
});