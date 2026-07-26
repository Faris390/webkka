// ─── Scroll Reveal Animation ─────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            // Unobserve after first reveal so animation doesn't replay on scroll up
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
});

// Observe all reveal elements
document.querySelectorAll('.reveal-fade-up, .reveal-fade-left, .reveal-fade-right').forEach(el => {
    revealObserver.observe(el);
});

// ─── Mouse Glow on Glass Panels ──────────────────────────────────────────────
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

// ─── Header Shrink on Scroll ──────────────────────────────────────────────────
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 20) {
        header.classList.add('bg-surface/95');
        header.classList.add('h-16');
        header.classList.remove('h-20');
    } else {
        header.classList.remove('bg-surface/95');
        header.classList.add('h-20');
        header.classList.remove('h-16');
    }
});

// ─── Loading Screen ───────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Minimum visible time to see the animation
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                document.body.classList.remove('overflow-hidden');
            }, 1000);
        }, 3000);
    }
});
