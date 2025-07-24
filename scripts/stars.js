$(document).ready(function () {
    const totalStars = 200;
    const starLayers = [
        { size: 3, speed: 0.3, opacity: 1 },
        { size: 2, speed: 0.15, opacity: 0.7 },
        { size: 1, speed: 0.07, opacity: 0.4 }
    ];

    const $container = $('.stars__container');
    const $stars = [];

    for (let i = 0; i < totalStars; i++) {
        const layer = starLayers[Math.floor(Math.random() * starLayers.length)];
        const $star = $('<div class="star"></div>');

        const x = Math.random() * window.innerWidth;
        const y = Math.random() * document.body.scrollHeight;

        $star.css({
            width: layer.size + 'px',
            height: layer.size + 'px',
            left: x + 'px',
            top: y + 'px',
            opacity: layer.opacity,
            background: 'white'
        });

        $container.append($star);
        $stars.push({ el: $star, speed: layer.speed, initialY: y, size: layer.size });
    }

    $(window).on('scroll', function () {
        const scrollTop = $(this).scrollTop();
        $stars.forEach(star => {
            const newY = star.initialY - scrollTop * star.speed;
            star.el.css('transform', `translateY(${newY}px)`);
        });
    });

    function spawnShootingStar() {
        const $shootingStar = $('<div class="shooting-star"></div>');
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * (window.innerHeight / 2);

        $shootingStar.css({
            top: startY + 'px',
            left: startX + 'px',
        });

        $('.stars__container').append($shootingStar);
        setTimeout(() => $shootingStar.remove(), 1000);
    }

    setInterval(() => Math.random() > 0.4 && spawnShootingStar(), 1500);

    let blackHoleActive = false;
    const absorbedStars = [];

    function spawnBlackHole() {
        if (blackHoleActive) return;
        blackHoleActive = true;

        const $blackHole = $('<div class="black-hole"></div>');

        const bhWidth = 120;
        const bhHeight = 120;

        const maxX = window.innerWidth - bhWidth;
        const maxY = document.body.scrollHeight - bhHeight;

        const randX = Math.random() * maxX;
        const randY = Math.random() * maxY;

        $blackHole.css({
            position: 'absolute',
            left: randX + 'px',
            top: randY + 'px',
        });

        $('.stars__container').append($blackHole);

        const bhCenterX = randX + bhWidth / 2;
        const bhCenterY = randY + bhHeight / 2;

        const absorptionInterval = setInterval(() => {
            const $availableStars = $('.star').not('.absorbed');
            if ($availableStars.length === 0) return;

            let closestStar = null;
            let minDistance = Infinity;

            $availableStars.each(function () {
                const $star = $(this);
                const offset = $star.offset();
                const starX = offset.left + $star.width() / 2;
                const starY = offset.top + $star.height() / 2;

                const distance = Math.sqrt(
                    Math.pow(bhCenterX - starX, 2) +
                    Math.pow(bhCenterY - starY, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestStar = $star;
                }
            });

            if (closestStar && minDistance < 500) {
                absorbStar(closestStar, bhCenterX, bhCenterY);
            }
        }, 200);

        setTimeout(() => {
            clearInterval(absorptionInterval);
            $blackHole.addClass('disappear');
            setTimeout(() => {
                $blackHole.remove();
                blackHoleActive = false;
                respawnStars();
            }, 1500); // match blackhole-disappear duration
        }, 7000);
    }

    function absorbStar($star, bhCenterX, bhCenterY) {
        $star.addClass('absorbed');
        absorbedStars.push($star);

        const offset = $star.offset();
        const starX = offset.left + $star.width() / 2;
        const starY = offset.top + $star.height() / 2;

        const dx = bhCenterX - starX;
        const dy = bhCenterY - starY;

        $star.css('will-change', 'auto');

        TweenMax.to($star, 1, {
            x: dx,
            y: dy,
            scale: 0,
            opacity: 0,
            ease: Power2.easeIn,
            onComplete: () => {
                $star.css('display', 'none');
            }
        });
    }

    function respawnStars() {
        absorbedStars.forEach(($star, index) => {
            setTimeout(() => {
                const newX = Math.random() * window.innerWidth;
                const newY = Math.random() * document.body.scrollHeight;

                $star.css({
                    left: newX + 'px',
                    top: newY + 'px',
                    display: 'block',
                    opacity: 0,
                    transform: 'translate(0, 0) scale(0.5)',
                    boxShadow: 'none'
                });

                $star.removeClass('absorbed');
                $star.addClass('respawning');

                TweenMax.to($star, 1, {
                    opacity: 1,
                    scale: 1,
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.8), 0 0 10px white',
                    ease: Power2.easeOut,
                    onComplete: () => $star.removeClass('respawning')
                });
            }, index * 5); // lebih cepat
        });

        absorbedStars.length = 0;
    }

    setInterval(() => Math.random() > 0.7 && spawnBlackHole(), 10000);
    setTimeout(spawnBlackHole, 3000);
});