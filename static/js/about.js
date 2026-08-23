/* about.js — counter animation + reveal for the founder page */

const initAboutCounters = () => {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;

    const run = (el) => {
        const target = Number(el.dataset.count);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            // ease out expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    run(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.6 }
    );

    els.forEach((el) => observer.observe(el));
};

const initAboutReveal = () => {
    const els = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    els.forEach((el, i) => {
        el.style.animationDelay = `${i * 90}ms`;
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    initAboutCounters();
    initAboutReveal();
});
