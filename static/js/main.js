/* ============================================================
   HDK EXPERTS — MAIN JS
   ============================================================ */

'use strict';

/* ── Helpers ── */
const $  = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const raf = requestAnimationFrame;

/* ══════════════════════════════════════
   1. PRELOADER
══════════════════════════════════════ */
(function initPreloader() {
    const el    = document.getElementById('preloader');
    const term  = document.getElementById('pl-term');
    const stamp = document.getElementById('pl-stamp');

    function dismiss() { if (el) el.classList.add('gone'); }

    // Failsafe: always dismiss after 5s no matter what
    const failsafe = setTimeout(dismiss, 5000);

    if (!el || !term || !stamp) { dismiss(); return; }

    const lines = [
        { text: '> BOOTING AI STACK',         cls: 'ok' },
        { text: '> NEURAL LAYERS LOADED',      cls: 'ok' },
        { text: '> VOICE AGENTS ONLINE',       cls: 'ok' },
        { text: '> RAG PIPELINE READY',        cls: 'ok' },
        { text: '> AGENTIC CORE INITIALIZED',  cls: 'ok' },
        { text: '> HDK EXPERTS v2.0 — READY',  cls: 'ok' },
    ];

    let i = 0;
    function nextLine() {
        if (i >= lines.length) {
            setTimeout(() => {
                stamp.classList.add('show');
                setTimeout(() => { clearTimeout(failsafe); dismiss(); }, 650);
            }, 250);
            return;
        }
        const div = document.createElement('div');
        div.className = 'pl-line ' + lines[i].cls;
        div.textContent = lines[i].text;
        term.appendChild(div);
        i++;
        setTimeout(nextLine, 120);
    }

    setTimeout(nextLine, 200);
})();

/* ══════════════════════════════════════
   2. CUSTOM CURSOR
══════════════════════════════════════ */
(function initCursor() {
    const ring = $('#cursor-ring');
    const dot  = $('#cursor-dot');
    if (!ring || !dot) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top  = my + 'px';
    });

    // Lag the ring slightly for a fluid feel
    const lerp = (a, b, t) => a + (b - a) * t;
    const loop = () => {
        rx = lerp(rx, mx, 0.12);
        ry = lerp(ry, my, 0.12);
        ring.style.left = rx + 'px';
        ring.style.top  = ry + 'px';
        raf(loop);
    };
    loop();

    // Expand cursor on interactive elements
    $$('a, button, [data-magnetic]').forEach((el) => {
        el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
    });
})();

/* ══════════════════════════════════════
   3. STICKY NAV
══════════════════════════════════════ */
(function initNav() {
    const nav = $('#nav');
    if (!nav) return;
    const toggle = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
})();

/* ══════════════════════════════════════
   4. PARTICLE CANVAS
══════════════════════════════════════ */
(function initCanvas() {
    const canvas = $('#bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    const COLORS = ['rgba(0,255,135,', 'rgba(255,45,120,', 'rgba(78,242,226,'];
    const N = 55;
    const particles = Array.from({ length: N }, () => ({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.2 + Math.random() * 0.4,
    }));

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw faint connection lines
        for (let i = 0; i < N; i++) {
            for (let j = i + 1; j < N; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.hypot(dx, dy);
                if (dist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,255,255,${0.025 * (1 - dist / 160)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Draw dots
        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height)  p.vy *= -1;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.alpha + ')';
            ctx.fill();
        });

        raf(draw);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    draw();
})();

/* ══════════════════════════════════════
   5. SCROLL REVEAL
══════════════════════════════════════ */
(function initReveal() {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            });
        },
        { threshold: 0.15 }
    );

    $$('.reveal').forEach((el, i) => {
        el.style.animationDelay = (i % 4) * 80 + 'ms';
        io.observe(el);
    });
})();

/* ══════════════════════════════════════
   6. BENTO CARD SPOTLIGHT + TILT
══════════════════════════════════════ */
(function initBentoCards() {
    $$('[data-tilt]').forEach((card) => {
        const shine = $('.bento-shine', card);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const px   = (e.clientX - rect.left) / rect.width;
            const py   = (e.clientY - rect.top)  / rect.height;

            // Tilt
            const rx = (0.5 - py) * 10;
            const ry = (px - 0.5) * 10;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;

            // Spotlight
            if (shine) {
                shine.style.setProperty('--mx', (px * 100) + '%');
                shine.style.setProperty('--my', (py * 100) + '%');
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

/* ══════════════════════════════════════
   7. ANIMATED COUNTERS
══════════════════════════════════════ */
(function initCounters() {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el     = entry.target;
                const target = parseInt(el.dataset.count, 10);
                const duration = 1400;
                const start    = performance.now();

                const tick = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // ease-out-quart
                    const eased = 1 - Math.pow(1 - progress, 4);
                    el.textContent = Math.round(eased * target);
                    if (progress < 1) raf(tick);
                };

                raf(tick);
                io.unobserve(el);
            });
        },
        { threshold: 0.6 }
    );

    $$('[data-count]').forEach((el) => io.observe(el));
})();

/* ══════════════════════════════════════
   8. TEXT SCRAMBLE ON HERO HEADLINE
══════════════════════════════════════ */
(function initScramble() {
    const target = $('#h1-line-2');
    if (!target) return;

    const CHARS   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#';
    const original = target.textContent.trim();
    let frame = 0;
    let running = false;

    const scramble = () => {
        if (running) return;
        running = true;
        frame = 0;
        const totalFrames = 18;

        const tick = () => {
            frame++;
            target.textContent = original
                .split('')
                .map((ch, i) => {
                    if (ch === ' ') return ' ';
                    if (i < Math.floor((frame / totalFrames) * original.length)) return ch;
                    return CHARS[Math.floor(Math.random() * CHARS.length)];
                })
                .join('');

            if (frame < totalFrames) {
                raf(tick);
            } else {
                target.textContent = original;
                running = false;
            }
        };
        raf(tick);
    };

    // Run on load after preloader clears, then every 6s
    setTimeout(() => {
        scramble();
        setInterval(scramble, 6000);
    }, 1200);
})();

/* ══════════════════════════════════════
   9. WAVE PATH ANIMATION
══════════════════════════════════════ */
(function initWave() {
    const path = $('#wave-path');
    if (!path) return;

    let t = 0;
    const tick = () => {
        t += 0.008;
        const amp = 36;
        const d = `M0,90 C200,${90 + Math.sin(t) * amp} 400,${90 - Math.sin(t + 1) * amp} 600,${90 + Math.sin(t + 2) * amp} C800,${90 - Math.sin(t + 3) * amp} 1000,${90 + Math.sin(t + 4) * amp} 1200,90`;
        path.setAttribute('d', d);
        raf(tick);
    };
    tick();
})();

/* ══════════════════════════════════════
   10. MAGNETIC BUTTONS
══════════════════════════════════════ */
(function initMagnetic() {
    $$('[data-magnetic]').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) * 0.28;
            const dy   = (e.clientY - cy) * 0.28;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

