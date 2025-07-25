const starCount = 200;
const starLevels = [
    { size: 3, speed: 0.1, brightness: 180 },
    { size: 2, speed: 0.3, brightness: 150 },
    { size: 1, speed: 0.5, brightness: 100 },
    { size: 0.7, speed: 0.8, brightness: 70 },
];

const starsWrapper = document.getElementById("stars-wrapper");

function getDocumentHeight() {
    return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
}

function updateStarsWrapperHeight() {
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
    );
    starsWrapper.style.height = `${documentHeight}px`;
}
window.addEventListener("load", updateStarsWrapperHeight);
window.addEventListener("resize", updateStarsWrapperHeight);

// Buat bintang
for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const level = starLevels[Math.floor(Math.random() * starLevels.length)];
    star.style.width = `${level.size}px`;
    star.style.height = `${level.size}px`;
    star.style.backgroundColor = `rgb(${level.brightness}, ${level.brightness}, ${level.brightness})`;
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * getDocumentHeight()}px`;
    star.dataset.speed = level.speed;

    starsWrapper.appendChild(star);
}

// Parallax scroll
window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    document.querySelectorAll(".star").forEach((star) => {
        const speed = parseFloat(star.dataset.speed);
        star.style.transform = `translateY(${scrollTop * speed}px)`;
    });
});

// Bintang jatuh
function createShootingStar() {
    const star = document.createElement("div");
    star.classList.add("shooting-star");

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * (window.innerHeight / 2);

    star.style.width = "2px";
    star.style.height = "100px";
    star.style.background = "white";
    star.style.left = `${startX}px`;
    star.style.top = `${startY + window.scrollY}px`;
    star.style.transform = "rotate(45deg)";
    star.style.opacity = "0.8";
    star.style.transition = "all 1s ease-out";

    starsWrapper.appendChild(star);

    setTimeout(() => star.remove(), 1000);
}

setInterval(() => {
    if (Math.random() < 0.5) createShootingStar();
}, 3000);

// Black hole
function createBlackHole() {
    const blackHole = document.createElement("div");
    blackHole.classList.add("black-hole");

    blackHole.style.width = "120px";
    blackHole.style.height = "120px";
    blackHole.style.background = "radial-gradient(circle, black 60%, transparent)";
    blackHole.style.opacity = "0.7";

    const left = Math.random() * (window.innerWidth - 120);
    const top = Math.random() * (getDocumentHeight() - 120);

    blackHole.style.left = `${left}px`;
    blackHole.style.top = `${top}px`;

    starsWrapper.appendChild(blackHole);

    const radius = 250;
    const centerX = left + 60;
    const centerY = top + 60;
    const absorbedStars = [];

    document.querySelectorAll(".star").forEach((star) => {
        const starLeft = parseFloat(star.style.left);
        const starTop = parseFloat(star.style.top);
        const starX = starLeft + (star.offsetWidth / 2);
        const starY = starTop + (star.offsetHeight / 2);
        const dist = Math.hypot(centerX - starX, centerY - starY);

        if (dist < radius) {
            const deltaX = centerX - starX;
            const deltaY = centerY - starY;

            star.style.transition = "transform 1.5s ease-in-out, opacity 1.5s ease-in-out";
            star.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0)`;
            star.style.opacity = 0;

            absorbedStars.push(star);
        }
    });

    setTimeout(() => {
        blackHole.remove();
        absorbedStars.forEach((star) => {
            star.style.transition = "none";
            star.style.transform = "translateY(0) scale(1)";
            star.style.opacity = 1;
            star.style.left = `${Math.random() * window.innerWidth}px`;
            star.style.top = `${Math.random() * getDocumentHeight()}px`;
        });
    }, 8000);
}

setInterval(() => {
    if (Math.random() < 0.7) createBlackHole();
}, 10000);