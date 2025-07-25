// Jumlah bintang dan level ukuran
const starCount = 200;
const starLevels = [
    { size: 3, speed: 0.1, brightness: 180 },   // paling besar dan paling lambat
    { size: 2, speed: 0.3, brightness: 150 },
    { size: 1, speed: 0.5, brightness: 100 },
    { size: 0.7, speed: 0.8, brightness: 70 }, // paling kecil dan paling cepat
];

// Ambil tinggi dokumen
const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
);

// Buat bintang
for (let i = 0; i < starCount; i++) {
    const star = document.createElement("div");
    star.classList.add("star");

    const level = starLevels[Math.floor(Math.random() * starLevels.length)];
    star.style.width = `${level.size}px`;
    star.style.height = `${level.size}px`;
    star.style.backgroundColor = `rgb(${level.brightness}, ${level.brightness}, ${level.brightness})`;
    star.style.left = `${Math.random() * window.innerWidth}px`;
    star.style.top = `${Math.random() * documentHeight}px`;
    star.dataset.speed = level.speed;

    document.body.appendChild(star);
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

    star.style.left = `${startX}px`;
    star.style.top = `${startY}px`;

    document.body.appendChild(star);

    setTimeout(() => star.remove(), 1000);
}

setInterval(() => {
    if (Math.random() < 0.5) createShootingStar();
}, 3000);

// Black hole
function createBlackHole() {
    const blackHole = document.createElement("div");
    blackHole.classList.add("black-hole");

    const left = Math.random() * (window.innerWidth - 120);
    const top = Math.random() * (documentHeight - 120);

    blackHole.style.left = `${left}px`;
    blackHole.style.top = `${top + window.scrollY}px`;
    document.body.appendChild(blackHole);

    // Hisap bintang dalam radius
    const radius = 150;
    const centerX = left + 60;
    const centerY = top + 60;

    const absorbedStars = [];

    document.querySelectorAll(".star").forEach((star) => {
        const rect = star.getBoundingClientRect();
        const starX = rect.left + rect.width / 2;
        const starY = rect.top + rect.height / 2;
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

    // Remove blackhole and respawn absorbed stars
    setTimeout(() => {
        blackHole.remove();
        absorbedStars.forEach((star) => {
            star.style.transition = "none";
            star.style.transform = "translateY(0) scale(1)";
            star.style.opacity = 1;
            star.style.left = `${Math.random() * window.innerWidth}px`;
            star.style.top = `${Math.random() * documentHeight}px`;
        });
    }, 8000);
}

setInterval(() => {
    if (Math.random() < 0.7) createBlackHole();
}, 10000);
