const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right').forEach(el => {
    revealObserver.observe(el);
});

document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.glass-panel');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 20) {
        header.classList.add('bg-surface/95', 'h-16');
        header.classList.remove('h-20');
    } else {
        header.classList.remove('bg-surface/95', 'h-16');
        header.classList.add('h-20');
    }
});

(function initStarfield() {
    const canvas = document.getElementById('ls-stars');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const isMobile = W < 768;
    const starCount = isMobile ? 50 : 120;

    const stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.4 + 0.2,
        speed: Math.random() * 0.25 + 0.05,
        opacity: Math.random() * 0.7 + 0.2,
        twinkleOffset: Math.random() * Math.PI * 2
    }));
    let frame = 0;

    function draw() {
        ctx.clearRect(0, 0, W, H);
        frame++;
        stars.forEach(s => {
            const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.03 + s.twinkleOffset);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 210, 255, ${s.opacity * twinkle})`;
            ctx.fill();
            s.y -= s.speed;
            if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        });
        if (document.getElementById('loading-screen')) {
            requestAnimationFrame(draw);
        }
    }
    draw();
    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });
})();

window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    const minTime = 3400;
    const start = Date.now();

    function exitLoading() {
        const elapsed = Date.now() - start;
        const delay = Math.max(0, minTime - elapsed);
        setTimeout(() => {
            loadingScreen.classList.add('ls-exit');
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.remove('overflow-hidden');
            }, 850);
        }, delay);
    }

    exitLoading();
});
