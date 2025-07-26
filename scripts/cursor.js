const cursor = document.getElementById("cursor");
const dotCount = 20;
const sineDots = Math.floor(dotCount * 0.3);
const width = 20;
let mousePos = { x: 0, y: 0 };
let dots = [];
let idle = false;
let lastFrame = 0;

class Dot {
    constructor(i) {
        this.index = i;
        this.angleSpeed = 0.05;
        this.x = 0;
        this.y = 0;
        this.scale = 1 - 0.05 * i;
        this.range = width / 2 - width / 2 * this.scale + 2;
        this.element = document.createElement("span");
        this.element.style.transform = `scale(${this.scale})`;
        cursor.appendChild(this.element);
    }

    lock() {
        this.lockX = this.x;
        this.lockY = this.y;
        this.angleX = Math.PI * 2 * Math.random();
        this.angleY = Math.PI * 2 * Math.random();
    }

    draw() {
        if (!idle || this.index <= sineDots) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        } else {
            this.angleX += this.angleSpeed;
            this.angleY += this.angleSpeed;
            this.y = this.lockY + Math.sin(this.angleY) * this.range;
            this.x = this.lockX + Math.sin(this.angleX) * this.range;
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }
}

function buildDots() {
    for (let i = 0; i < dotCount; i++) {
        dots.push(new Dot(i));
    }
}

function lockDots() {
    for (let dot of dots) {
        dot.lock();
    }
}

let idleTimer;
function resetIdleTimer() {
    clearTimeout(idleTimer);
    idle = false;
    idleTimer = setTimeout(() => {
        idle = true;
        lockDots();
    }, 150);
}

window.addEventListener("mousemove", e => {
    mousePos.x = e.clientX - width / 2;
    mousePos.y = e.clientY - width / 2;
    resetIdleTimer();
});

function render(ts) {
    let delta = ts - lastFrame;
    lastFrame = ts;
    updateDots(delta);
    requestAnimationFrame(render);
}

function updateDots(delta) {
    let x = mousePos.x;
    let y = mousePos.y;

    dots.forEach((dot, index, array) => {
        const next = array[index + 1] || array[0];
        dot.x = x;
        dot.y = y;
        dot.draw();
        if (!idle || index <= sineDots) {
            let dx = (next.x - dot.x) * 0.35;
            let dy = (next.y - dot.y) * 0.35;
            x += dx;
            y += dy;
        }
    });
}

document.querySelectorAll("a, button, input, select, textarea, h1, h2, h3, h4, h5, h6, p, small, .skill__card, .hamburger").forEach(el => {
    el.addEventListener("mouseenter", () => {
        document.body.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
        document.body.classList.remove("hovering");
    });
});


function init() {
    buildDots();
    requestAnimationFrame(render);
}

init();