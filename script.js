/* =====================================================
   SEJAL'S DIWALI CELEBRATION
   COMPLETE JAVASCRIPT ENGINE
   Version: 1.0
   ===================================================== */

"use strict";


/* =====================================================
   1. INITIALIZATION
   ===================================================== */

const loader = document.getElementById("loader");

const musicButton = document.getElementById("musicToggle");

const diwaliSong = document.getElementById("diwaliSong");

const fireworksContainer =
    document.getElementById("fireworks-container");

const particlesContainer =
    document.getElementById("particles-container");

const diyasContainer =
    document.getElementById("diyas-container");

const canvas = document.getElementById("animationCanvas");

const ctx = canvas ? canvas.getContext("2d") : null;

const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

const isMobile = window.innerWidth <= 600;

console.log("✨ SEJAL'S DIWALI WEBSITE INITIALIZED");


/* =====================================================
   2. LOADING SCREEN
   ===================================================== */

let loaderRemoved = false;

function hideLoader() {

    if (loaderRemoved) return;

    loaderRemoved = true;

    if (loader) {

        loader.classList.add("is-hidden");

    }

}

window.addEventListener("load", hideLoader, {
    once: true
});

// Safety fallback

setTimeout(hideLoader, 2500);


/* =====================================================
   3. BACKGROUND MUSIC
   ===================================================== */

if (diwaliSong && musicButton) {

    diwaliSong.volume = 0.45;

    musicButton.addEventListener("click", async () => {

        try {

            if (diwaliSong.paused) {

                await diwaliSong.play();

                musicButton.textContent = "⏸ Pause Music";

                musicButton.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                diwaliSong.pause();

                musicButton.textContent = "🎵 Play Music";

                musicButton.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

        } catch (error) {

            console.error("Music playback failed:", error);

            musicButton.textContent = "🎵 Song Unavailable";

        }

    });

    // Reset button after song finishes

    diwaliSong.addEventListener("ended", () => {

        musicButton.textContent = "🎵 Play Music";

        musicButton.setAttribute(
            "aria-pressed",
            "false"
        );

    });

    // Handle missing audio

    diwaliSong.addEventListener("error", () => {

        musicButton.textContent = "🎵 Song Unavailable";

    });

}


/* =====================================================
   4. FLOATING PARTICLES
   ===================================================== */

function createParticleStyles() {

    const style = document.createElement("style");

    style.textContent = `

        .ambient-particle {

            position: absolute;

            bottom: -20px;

            border-radius: 50%;

            background: #ffd166;

            box-shadow:
                0 0 8px #ffd166,
                0 0 15px #ff9d42;

            opacity: 0;

            animation: particleRise linear infinite;

            pointer-events: none;

        }

        @keyframes particleRise {

            0% {

                transform: translateY(0) scale(0.5);

                opacity: 0;

            }

            15% {

                opacity: 0.8;

            }

            80% {

                opacity: 0.6;

            }

            100% {

                transform:
                    translateY(-110vh)
                    translateX(35px)
                    scale(1.2);

                opacity: 0;

            }

        }

    `;

    document.head.appendChild(style);

}


function createParticles() {

    if (!particlesContainer || prefersReducedMotion) return;

    createParticleStyles();

    const particleCount = isMobile ? 22 : 45;

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("span");

        particle.className = "ambient-particle";

        particle.style.left = Math.random() * 100 + "%";

        particle.style.animationDuration =
            (Math.random() * 8 + 6) + "s";

        particle.style.animationDelay =
            (Math.random() * 10) + "s";

        const size = Math.random() * 4 + 2;

        particle.style.width = size + "px";

        particle.style.height = size + "px";

        particlesContainer.appendChild(particle);

    }

}

createParticles();


/* =====================================================
   5. FLOATING DIYAS
   ===================================================== */

function createDiyaStyles() {

    const style = document.createElement("style");

    style.textContent = `

        .floating-diya {

            position: absolute;

            bottom: -70px;

            font-size: 24px;

            opacity: 0;

            filter:
                drop-shadow(0 0 8px #ff9d42)
                drop-shadow(0 0 15px #ffd166);

            animation: diyaFloat linear infinite;

            pointer-events: none;

        }

        @keyframes diyaFloat {

            0% {

                transform:
                    translateY(0)
                    rotate(-10deg);

                opacity: 0;

            }

            15% {

                opacity: 0.65;

            }

            50% {

                transform:
                    translateY(-55vh)
                    rotate(10deg);

            }

            85% {

                opacity: 0.6;

            }

            100% {

                transform:
                    translateY(-115vh)
                    rotate(-10deg);

                opacity: 0;

            }

        }

    `;

    document.head.appendChild(style);

}


function createFloatingDiyas() {

    if (!diyasContainer || prefersReducedMotion) return;

    createDiyaStyles();

    const diyaCount = isMobile ? 5 : 9;

    for (let i = 0; i < diyaCount; i++) {

        const diya = document.createElement("span");

        diya.className = "floating-diya";

        diya.textContent = "🪔";

        diya.style.left = Math.random() * 95 + "%";

        diya.style.animationDuration =
            (Math.random() * 10 + 12) + "s";

        diya.style.animationDelay =
            (Math.random() * 12) + "s";

        diyasContainer.appendChild(diya);

    }

}

createFloatingDiyas();


/* =====================================================
   6. FIREWORKS ENGINE
   HTML CANVAS INITIALIZATION
   ===================================================== */

let canvasWidth = 0;

let canvasHeight = 0;

let pixelRatio = 1;

const fireworks = [];

const fireworkParticles = [];

const MAX_PARTICLES = isMobile ? 140 : 240;

let animationFrame = null;

let lastLaunchTime = 0;

let nextLaunchDelay = isMobile ? 3200 : 2200;


function resizeCanvas() {

    if (!canvas || !ctx) return;

    pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        1.5
    );

    canvasWidth = window.innerWidth;

    canvasHeight = window.innerHeight;

    canvas.width = Math.floor(
        canvasWidth * pixelRatio
    );

    canvas.height = Math.floor(
        canvasHeight * pixelRatio
    );

    canvas.style.width = canvasWidth + "px";

    canvas.style.height = canvasHeight + "px";

    ctx.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
    );

}


resizeCanvas();

window.addEventListener("resize", resizeCanvas);


/* =====================================================
   7. FIREWORK ROCKETS
   ===================================================== */

function launchFirework(x, targetY) {

    if (!canvas || !ctx) return;

    // Prevent too many simultaneous rockets

    if (fireworks.length >= 8) return;

    const hue = Math.random() * 360;

    fireworks.push({

        x: x,

        y: canvasHeight + 10,

        targetY: targetY,

        speed: Math.random() * 2 + 4,

        hue: hue,

        radius: 2

    });

}


/* =====================================================
   8. FIREWORK EXPLOSIONS
   ===================================================== */

function explodeFirework(x, y, hue) {

    const particleCount = isMobile ? 28 : 48;

    for (let i = 0; i < particleCount; i++) {

        const angle =
            (Math.PI * 2 * i) / particleCount;

        const speed =
            Math.random() * 3.5 + 1;

        fireworkParticles.push({

            x: x,

            y: y,

            vx: Math.cos(angle) * speed,

            vy: Math.sin(angle) * speed,

            hue: hue + Math.random() * 25,

            alpha: 1,

            life: 65 + Math.random() * 30,

            radius: Math.random() * 2 + 1,

            gravity: 0.035 + Math.random() * 0.025

        });

    }

    // Control memory usage

    if (fireworkParticles.length > MAX_PARTICLES) {

        fireworkParticles.splice(
            0,
            fireworkParticles.length - MAX_PARTICLES
        );

    }

}


/* =====================================================
   9. UPDATE FIREWORKS
   ===================================================== */

function updateFireworks() {

    if (!ctx) return;

    ctx.clearRect(
        0,
        0,
        canvasWidth,
        canvasHeight
    );

    ctx.globalCompositeOperation = "lighter";


    // Update rocket positions

    for (let i = fireworks.length - 1; i >= 0; i--) {

        const rocket = fireworks[i];

        const previousY = rocket.y;

        rocket.y -= rocket.speed;

        // Draw rocket trail

        ctx.beginPath();

        ctx.moveTo(rocket.x, previousY);

        ctx.lineTo(rocket.x, rocket.y);

        ctx.strokeStyle =
            `hsla(${rocket.hue}, 100%, 70%, 0.85)`;

        ctx.lineWidth = 2;

        ctx.stroke();


        // Create explosion

        if (rocket.y <= rocket.targetY) {

            explodeFirework(
                rocket.x,
                rocket.y,
                rocket.hue
            );

            fireworks.splice(i, 1);

        }

    }


    // Update explosion particles

    for (
        let i = fireworkParticles.length - 1;
        i >= 0;
        i--
    ) {

        const particle = fireworkParticles[i];

        particle.x += particle.vx;

        particle.y += particle.vy;

        // Gravity

        particle.vy += particle.gravity;

        // Air resistance

        particle.vx *= 0.985;

        particle.vy *= 0.985;

        // Particle lifetime

        particle.life--;

        particle.alpha = Math.max(
            0,
            particle.life / 95
        );


        if (particle.life <= 0) {

            fireworkParticles.splice(i, 1);

            continue;

        }


        // Draw glowing particle

        ctx.beginPath();

        ctx.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `hsla(
                ${particle.hue},
                100%,
                70%,
                ${particle.alpha}
            )`;

        ctx.fill();


        // Draw particle trail

        ctx.beginPath();

        ctx.moveTo(
            particle.x - particle.vx * 2,
            particle.y - particle.vy * 2
        );

        ctx.lineTo(
            particle.x,
            particle.y
        );

        ctx.strokeStyle =
            `hsla(
                ${particle.hue},
                100%,
                65%,
                ${particle.alpha * 0.7}
            )`;

        ctx.lineWidth = 1.5;

        ctx.stroke();

    }

    ctx.globalCompositeOperation = "source-over";

}


/* =====================================================
   10. AUTOMATIC FIREWORKS
   ===================================================== */

function automaticFireworks(currentTime) {

    if (
        currentTime - lastLaunchTime >
        nextLaunchDelay
    ) {

        if (fireworks.length < 2) {

            const x =
                Math.random() *
                (canvasWidth * 0.8) +
                (canvasWidth * 0.1);

            const targetY =
                Math.random() *
                (canvasHeight * 0.4) +
                (canvasHeight * 0.15);

            launchFirework(x, targetY);

        }

        lastLaunchTime = currentTime;

        nextLaunchDelay = isMobile

            ? Math.random() * 1800 + 2500

            : Math.random() * 1700 + 1800;

    }

}


/* =====================================================
   11. MAIN ANIMATION LOOP
   ===================================================== */

function animateFireworks(currentTime) {

    if (
        document.hidden ||
        prefersReducedMotion ||
        !ctx
    ) {

        animationFrame = null;

        return;

    }

    automaticFireworks(currentTime);

    updateFireworks();

    animationFrame = requestAnimationFrame(
        animateFireworks
    );

}


function startFireworks() {

    if (
        prefersReducedMotion ||
        !ctx ||
        animationFrame !== null ||
        document.hidden
    ) {

        return;

    }

    animationFrame = requestAnimationFrame(
        animateFireworks
    );

}


function stopFireworks() {

    if (animationFrame !== null) {

        cancelAnimationFrame(animationFrame);

        animationFrame = null;

    }

}

startFireworks();


/* =====================================================
   12. CLICK AND TOUCH FIREWORKS
   ===================================================== */

document.addEventListener("pointerdown", (event) => {

    if (
        prefersReducedMotion ||
        !canvas ||
        !ctx
    ) {

        return;

    }

    // Ignore buttons, links and form controls

    if (
        event.target.closest(
            "button, a, input, textarea, select"
        )
    ) {

        return;

    }

    const x = event.clientX;

    const y = event.clientY;

    const safeY = Math.max(
        70,
        Math.min(y, canvasHeight - 100)
    );

    launchFirework(x, safeY);

});


/* =====================================================
   13. SCROLL REVEAL ANIMATION
   ===================================================== */

function initializeScrollReveal() {

    const style = document.createElement("style");

    style.textContent = `

        .js-reveal {

            opacity: 0;

            transform: translateY(30px);

            transition:
                opacity 0.8s ease,
                transform 0.8s ease;

            transition-delay:
                var(--reveal-delay, 0ms);

        }

        .js-reveal.is-visible {

            opacity: 1;

            transform: translateY(0);

        }

        @media (prefers-reduced-motion: reduce) {

            .js-reveal {

                opacity: 1;

                transform: none;

                transition: none;

            }

        }

    `;

    document.head.appendChild(style);


    const revealElements = document.querySelectorAll(`

        .section-heading,

        .doctor-card,

        .medical-card,

        .wish-card,

        .future-content,

        .final-content

    `);


    // Browser fallback

    if (!("IntersectionObserver" in window)) {

        revealElements.forEach(element => {

            element.classList.add("is-visible");

        });

        return;

    }


    const observer = new IntersectionObserver(

        (entries, observerInstance) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add(
                        "is-visible"
                    );

                    observerInstance.unobserve(
                        entry.target
                    );

                }

            });

        },

        {

            threshold: 0.12,

            rootMargin: "0px 0px -40px 0px"

        }

    );


    revealElements.forEach((element, index) => {

        element.classList.add("js-reveal");

        if (element.classList.contains("medical-card")) {

            element.style.setProperty(

                "--reveal-delay",

                (index % 3) * 120 + "ms"

            );

        }

        observer.observe(element);

    });

}

initializeScrollReveal();


/* =====================================================
   14. ACTIVE NAVIGATION
   ===================================================== */

function initializeNavigation() {

    const sections = document.querySelectorAll(
        "main section[id]"
    );

    const navigationLinks = document.querySelectorAll(
        ".nav-links a"
    );

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    navigationLinks.forEach(link => {

                        const active =
                            link.getAttribute("href") ===
                            "#" + entry.target.id;

                        if (active) {

                            link.setAttribute(
                                "aria-current",
                                "location"
                            );

                        } else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    });

                }

            });

        },

        {

            threshold: 0.3

        }

    );

    sections.forEach(section => {

        observer.observe(section);

    });

}

initializeNavigation();


/* =====================================================
   15. PERFORMANCE MANAGEMENT
   ===================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (document.hidden) {

            stopFireworks();

        } else {

            startFireworks();

        }

    }
);


// Stop animation when leaving the page

window.addEventListener("pagehide", () => {

    stopFireworks();

});


// Final message

console.log("--------------------------------");

console.log("✨ SEJAL'S DIWALI EXPERIENCE");

console.log("🪔 Floating Diyas: Active");

console.log("🎆 Fireworks: Active");

console.log("✨ Golden Particles: Active");

console.log("🎵 Music System: Ready");

console.log("🩺 Future Doctor Mode: Activated");

console.log("--------------------------------");
