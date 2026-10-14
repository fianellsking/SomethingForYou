/* =========================================================
   PAGE 1 - BIRTHDAY ADVENTURE
   ========================================================= */


/* =========================================================
   ✏️ ตั้งค่า (แก้ตรงนี้ได้เลย)
   ========================================================= */

/* ข้อความในส่วนเปิดเรื่อง */
const storyMessages = [
    "...?",
    "ฮัลโหลวคุณแฟนคับ",
    "วันนี้เป็นวันอะไรน้าาาา......",
    "วันนี้มันวันเกิดที่รักนี่ 😃",
    "สุขสันต์วันเกิดนะคับแฟนคนแรกของตาต้า ❤️",
    "สิ่งนี้สร้างมาเพื่อเป็นของขวัญชิ้นนึงให้กับหนู หวังว่าจะถูกใจน้า ❤️"
];

/* รหัสที่ยอมรับ (วัน-เดือน-ปีเกิด แบบ พ.ศ. และ ค.ศ.) */
const acceptedPins = [
    "16052551",
    "16052008"
];

/* ใส่ผิดกี่ครั้งถึงจะมีคำใบ้ขึ้น */
const HINT_AFTER = 3;
const HINT_TEXT  = "ใบ้: เรียงเป็น วัน-เดือน-ปีเกิด นะ 🌸";

/* ข้อความตอนใส่รหัสผิด (สุ่มวนไป) */
const WRONG_MESSAGES = [
    "จำของพี่ไม่ได้จริงๆหรออ 🥺",
    "อื้อออ ยังไม่ใช่น้าา ลองใหม่น้า 💦",
    "ใกล้แล้วมั้งงง... ตั้งสติหน่อยยย 🫣",
    "งือออ พี่เสียใจแล้วนะ 🥹"
];


/* =========================================================
   GET ELEMENTS
   ========================================================= */

const $ = (id) => document.getElementById(id);

const storyScreen          = $("story-screen");
const storyText            = $("story-text");
const typingCursor         = $("typing-cursor");
const tapHint              = $("tap-hint");
const storyDotsBox         = $("story-dots");

const adventureOverlay     = $("adventure-overlay");
const startAdventureButton = $("start-adventure");

const loadingScreen        = $("loading-screen");
const loadingPercent       = $("loading-percent");
const loadingSubtext       = $("loading-subtext");
const loaderRing           = document.querySelector(".loader-ring");
const loaderCenter         = document.querySelector(".loader-center");

const birthdayOverlay      = $("birthday-overlay");
const birthdayCard         = $("birthday-card");
const birthdayIcon         = $("birthday-icon");
const pinDotsBox           = $("pin-dots");
const pinDots              = document.querySelectorAll("#pin-dots span");
const pinKeys              = document.querySelectorAll(".pin-key");
const pinError             = $("pin-error");
const pinHint              = $("pin-hint");

const successScreen        = $("success-screen");

const canvas               = $("heart-canvas");
const ctx                  = canvas.getContext("2d");

const storyContent         = document.querySelector(".story-content");


/* =========================================================
   STORY STATE
   ========================================================= */

let currentStoryIndex = 0;
let isTyping          = false;
let canContinue       = false;
let typer             = null;
let storyLocked       = false;


/* จุดความคืบหน้า */
storyMessages.forEach(() => storyDotsBox.appendChild(document.createElement("i")));

function updateDots() {
    [...storyDotsBox.children].forEach((d, i) => {
        d.className = i < currentStoryIndex ? "done" : (i === currentStoryIndex ? "on" : "");
    });
}


/* =========================================================
   START
   ========================================================= */

window.addEventListener("load", () => {
    resizeCanvas();
    startHeartAnimation();
    setTimeout(showStoryMessage, 1300);
});


/* =========================================================
   SHOW STORY MESSAGE  (พิมพ์ทีละตัว + เบลอเข้า)
   ========================================================= */

function showStoryMessage() {

    isTyping    = true;
    canContinue = false;

    tapHint.classList.remove("show");
    typingCursor.style.display = "inline";
    storyText.textContent = "";
    updateDots();

    storyText.animate(
        [
            { opacity: 0, transform: "translateY(14px)", filter: "blur(8px)" },
            { opacity: 1, transform: "translateY(0)",    filter: "blur(0)" }
        ],
        { duration: 600, easing: "cubic-bezier(.2,.8,.3,1)" }
    );

    typer = FX.typewriter(storyText, storyMessages[currentStoryIndex], { speed: [38, 78] });

    typer.promise.then(finishTyping);
}


function finishTyping() {
    isTyping    = false;
    canContinue = true;
    typer       = null;

    tapHint.classList.add("show");
    storyContent.classList.add("ready");
}


/* =========================================================
   TAP / KEY  — แตะระหว่างพิมพ์ = ข้ามไปจบประโยคเลย
   ========================================================= */

function onStoryTap() {

    if (!storyScreen.classList.contains("active") || storyLocked) return;

    if (isTyping && typer) {
        typer.skip();
        return;
    }

    if (canContinue) goToNextStory();
}

storyScreen.addEventListener("click", onStoryTap);

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        if (storyScreen.classList.contains("active")) {
            e.preventDefault();
            onStoryTap();
        }
    }
});


/* =========================================================
   NEXT STORY
   ========================================================= */

async function goToNextStory() {

    storyLocked = true;
    canContinue = false;

    FX.sound.tap();
    tapHint.classList.remove("show");
    storyContent.classList.remove("ready");

    /* ข้อความเก่าจางหาย */
    await storyText.animate(
        [
            { opacity: 1, transform: "translateY(0)",     filter: "blur(0)" },
            { opacity: 0, transform: "translateY(-12px)", filter: "blur(6px)" }
        ],
        { duration: 420, easing: "ease-in", fill: "forwards" }
    ).finished;

    storyText.getAnimations().forEach((a) => a.cancel());

    currentStoryIndex++;

    if (currentStoryIndex < storyMessages.length) {
        storyLocked = false;
        showStoryMessage();
    } else {
        storyText.textContent = "";
        typingCursor.style.display = "none";
        storyLocked = false;
        openAdventure();
    }
}


/* =========================================================
   OPEN ADVENTURE
   ========================================================= */

function openAdventure() {

    storyScreen.classList.remove("active");

    setTimeout(() => {
        adventureOverlay.classList.remove("hidden");
        FX.sound.chime();
        FX.confetti({ x: window.innerWidth / 2, y: window.innerHeight * 0.35, count: 60, power: 9 });
    }, 600);
}


/* =========================================================
   START ADVENTURE BUTTON
   ========================================================= */

startAdventureButton.addEventListener("click", (event) => {

    event.stopPropagation();
    FX.sound.pop();

    adventureOverlay.classList.add("hidden");

    setTimeout(() => {
        loadingScreen.classList.remove("hidden");
        startLoading();
    }, 450);
});


/* =========================================================
   LOADING  (ไปติดที่ 91% แล้วเฉลยว่ามีอะไรตกหล่น)
   ========================================================= */

let loadingStarted = false;

function startLoading() {

    if (loadingStarted) return;
    loadingStarted = true;

    let progress = 0;
    let lastShown = 0;
    const targetProgress = 91;

    const loadingInterval = setInterval(() => {

        let increase;

        if (progress < 30)      increase = 3;
        else if (progress < 65) increase = 2;
        else if (progress < 82) increase = 1.2;
        else                    increase = 0.45;

        progress += increase;

        if (progress >= targetProgress) {

            clearInterval(loadingInterval);

            loadingPercent.textContent = "91%";
            setLoaderProgress(91);

            /* หัวใจแตกเบา ๆ แล้วสั่น */
            loaderCenter.textContent = "💔";
            loaderCenter.classList.add("broken");
            FX.sound.error();
            FX.vibrate(120);

            loadingSubtext.textContent = "เอ๊ะ... เหมือนมีอะไรตกหล่นไป...";

            setTimeout(showBirthdayPin, 1900);
            return;
        }

        const rounded = Math.floor(progress);
        loadingPercent.textContent = rounded + "%";
        setLoaderProgress(rounded);

        /* เสียงติ๊กทุก 10% */
        if (rounded >= lastShown + 10) {
            lastShown = rounded;
            FX.sound.tick();
        }

        if (progress < 35)      loadingSubtext.textContent = "กำลังรวบรวมความทรงจำ...";
        else if (progress < 65) loadingSubtext.textContent = "กำลังเปิดประตูหัวใจ...";
        else if (progress < 85) loadingSubtext.textContent = "ใกล้แล้วนะ... 💗";
        else                    loadingSubtext.textContent = "กำลังตรวจสอบอะไรบางอย่าง...";

    }, 75);
}


function setLoaderProgress(percent) {

    const degree = percent * 3.6;

    loaderRing.style.background = `
        conic-gradient(
            #ff4f97 0deg,
            #ff4f97 ${degree}deg,
            rgba(255, 161, 198, 0.23) ${degree}deg,
            rgba(255, 161, 198, 0.23) 360deg
        )
    `;
}


/* =========================================================
   SHOW BIRTHDAY PIN
   ========================================================= */

function showBirthdayPin() {

    loadingScreen.classList.add("hidden");

    setTimeout(() => {
        birthdayOverlay.classList.remove("hidden");
        resetPin();
    }, 500);
}


/* =========================================================
   PIN
   ========================================================= */

let enteredPin  = "";
let wrongCount  = 0;
let pinLocked   = false;

pinKeys.forEach((button) => {

    button.addEventListener("click", () => {

        const key = button.dataset.key;

        if (key === "delete") {
            deletePin();
            return;
        }

        addPin(key);
    });
});


function addPin(number) {

    if (pinLocked || enteredPin.length >= 8) return;

    enteredPin += number;

    FX.sound.tap();
    updatePinDots();
    hidePinError();

    if (enteredPin.length === 8) {
        pinLocked = true;
        setTimeout(checkPin, 200);
    }
}


function deletePin() {

    if (pinLocked || enteredPin.length === 0) return;

    enteredPin = enteredPin.slice(0, -1);

    updatePinDots();
    hidePinError();
}


function updatePinDots() {

    pinDots.forEach((dot, index) => {
        dot.classList.toggle("filled", index < enteredPin.length);
    });
}


function checkPin() {

    if (acceptedPins.includes(enteredPin)) correctPin();
    else wrongPin();
}


/* =========================================================
   WRONG PIN
   ========================================================= */

function wrongPin() {

    wrongCount++;

    FX.shake(birthdayCard);
    FX.sound.error();
    FX.vibrate([70, 40, 70]);

    pinDotsBox.classList.add("wrong");

    pinError.style.color = "#e04b76";
    pinError.textContent = WRONG_MESSAGES[(wrongCount - 1) % WRONG_MESSAGES.length];
    pinError.classList.add("show");

    /* ใบ้โผล่หลังผิดหลายครั้ง */
    if (wrongCount >= HINT_AFTER) {
        pinHint.textContent = HINT_TEXT;
        pinHint.classList.add("hint-on");
    }

    setTimeout(() => {
        enteredPin = "";
        updatePinDots();
        pinDotsBox.classList.remove("wrong");
        pinLocked = false;
    }, 550);
}


/* =========================================================
   CORRECT PIN
   ========================================================= */

function correctPin() {

    pinDots.forEach((d, i) => {
        d.style.setProperty("--i", i);
        d.classList.add("ok");
    });

    pinError.textContent = "ถูกต้องแล้ว 💗";
    pinError.style.color = "#d34883";
    pinError.classList.add("show");

    pinKeys.forEach((b) => { b.disabled = true; });

    birthdayIcon.textContent = "🎉";
    birthdayIcon.classList.add("pop");

    FX.sound.chime();
    FX.vibrate(80);
    FX.confettiFrom(birthdayIcon, { count: 120, power: 12 });

    setTimeout(() => {

        birthdayOverlay.classList.add("hidden");

        setTimeout(() => {

            successScreen.classList.remove("hidden");

            createSuccessHearts();
            FX.rain(2200);
            FX.sound.fanfare();

            /* ไปหน้า 2 */
            setTimeout(() => FX.go("page2.html"), 2400);

        }, 550);

    }, 1100);
}


function resetPin() {

    enteredPin = "";
    pinLocked  = false;

    updatePinDots();
    hidePinError();

    pinError.style.color = "#e04b76";
    pinKeys.forEach((b) => { b.disabled = false; });
}


function hidePinError() {
    pinError.classList.remove("show");
}


/* =========================================================
   KEYBOARD SUPPORT (ตอนหน้า PIN เปิดอยู่)
   ========================================================= */

document.addEventListener("keydown", (event) => {

    if (birthdayOverlay.classList.contains("hidden")) return;

    if (/^[0-9]$/.test(event.key))      addPin(event.key);
    if (event.key === "Backspace")      deletePin();
});


/* =========================================================
   HEART CANVAS
   ========================================================= */

let hearts       = [];
let canvasWidth  = 0;
let canvasHeight = 0;


function resizeCanvas() {

    const dpr = window.devicePixelRatio || 1;

    canvasWidth  = window.innerWidth;
    canvasHeight = window.innerHeight;

    canvas.width  = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;

    canvas.style.width  = canvasWidth + "px";
    canvas.style.height = canvasHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);


function createHeart(forceBottom = false) {

    return {
        x: Math.random() * canvasWidth,
        y: forceBottom ? canvasHeight + Math.random() * 30 : Math.random() * canvasHeight,
        size: 7 + Math.random() * 13,
        speed: 0.4 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.45,
        opacity: 0.16 + Math.random() * 0.28,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015
    };
}


function initHearts() {

    hearts = [];

    const amount = Math.min(24, Math.max(12, Math.floor(canvasWidth / 65)));

    for (let i = 0; i < amount; i++) hearts.push(createHeart());
}


function drawHeart(heart) {

    const s = heart.size;

    ctx.save();
    ctx.translate(heart.x, heart.y);
    ctx.rotate(heart.rotation);
    ctx.globalAlpha = heart.opacity;
    ctx.fillStyle = "#ed6f9f";

    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(-s * 1.5, -s * 0.6, -s * 0.9, -s * 1.5, 0, -s * 0.65);
    ctx.bezierCurveTo(s * 0.9, -s * 1.5, s * 1.5, -s * 0.6, 0, s * 0.3);
    ctx.fill();

    ctx.restore();
}


function updateHearts() {

    hearts.forEach((heart) => {

        heart.y        -= heart.speed;
        heart.x        += heart.drift;
        heart.rotation += heart.rotationSpeed;

        if (heart.y < -30) Object.assign(heart, createHeart(true));
    });
}


function startHeartAnimation() {

    initHearts();

    (function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        updateHearts();
        hearts.forEach(drawHeart);
        requestAnimationFrame(animate);
    })();
}


/* หัวใจพุ่งขึ้นตอนปลดล็อกสำเร็จ */
function createSuccessHearts() {

    for (let i = 0; i < 18; i++) {

        const heart = createHeart(true);

        heart.x       = canvasWidth / 2 + (Math.random() - 0.5) * 300;
        heart.y       = canvasHeight / 2 + (Math.random() - 0.5) * 160;
        heart.speed   = 1 + Math.random() * 2;
        heart.opacity = 0.45 + Math.random() * 0.35;

        hearts.push(heart);
    }
}