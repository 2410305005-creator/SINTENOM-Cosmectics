/* =============================================
   SINTENOM COSMETICS — INTERACTIVE SCRIPTS
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    // ===== PRELOADER & INITIAL ANIMATIONS =====
    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
        document.body.style.transition = 'opacity .8s ease';
        document.body.style.opacity = '1';
    });

    // ===== GENERATE HERO PARTICLES =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-10px';
            particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
            particle.style.animationDelay = (Math.random() * 8) + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            particle.style.opacity = Math.random() * 0.5 + 0.2;
            particlesContainer.appendChild(particle);
        }
    }

    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ===== BACK TO TOP =====
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ===== MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
        document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ===== SCROLL REVEAL ANIMATIONS =====
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, delay);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ===== ANIMATED COUNTERS =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.dataset.target);
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        num.textContent = Math.floor(target * eased);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            num.textContent = target;
                        }
                    }
                    requestAnimationFrame(updateCounter);
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) counterObserver.observe(statsSection);

    // ===== TESTIMONIAL SLIDER =====
    const track = document.getElementById('testimonialTrack');
    const cards = track ? track.querySelectorAll('.testimonial-card') : [];
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentSlide = 0;
    let autoSlideInterval;

    function createDots() {
        if (!dotsContainer) return;
        cards.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (!track || cards.length === 0) return;
        currentSlide = index;
        track.style.transform = `translateX(-${currentSlide * 100}%)`;

        const dots = dotsContainer.querySelectorAll('.slider-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });

        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % cards.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + cards.length) % cards.length);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    createDots();
    resetAutoSlide();

    // Touch swipe for slider
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });
    }

    // ===== NEWSLETTER FORM =====
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('emailInput');
            const btn = document.getElementById('subscribeBtn');
            const originalText = btn.innerHTML;

            btn.innerHTML = '<span>Subscribed! ✓</span>';
            btn.style.background = 'linear-gradient(135deg, #2a7a2a, #1a5a1a)';

            emailInput.value = '';

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 3000);
        });
    }

    // ===== PARALLAX EFFECT ON HERO =====
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < window.innerHeight) {
                const heroBg = hero.querySelector('.hero-bg');
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
                }
            }
        }, { passive: true });
    }

    // ===== MAGNETIC EFFECT ON BUTTONS =====
    const magneticBtns = document.querySelectorAll('.btn-primary');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ===== TILT EFFECT ON PRODUCT CARDS =====
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            const rotateX = (0.5 - y) * 8;
            const rotateY = (x - 0.5) * 8;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .6s cubic-bezier(.22,1,.36,1)';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform .1s ease';
        });
    });

    // ===== CATEGORY CARDS HOVER GLOW =====
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--glow-x', x + 'px');
            card.style.setProperty('--glow-y', y + 'px');
        });
    });

    // ===== CURSOR GLOWING DOT (Desktop only) =====
    if (window.innerWidth > 992) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            position: fixed;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(201,168,76,.4), transparent);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            transition: width .3s, height .3s, opacity .3s;
            mix-blend-mode: screen;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Grow on hover of interactive elements
        document.querySelectorAll('a, button, .product-card, .category-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '40px';
                cursor.style.height = '40px';
                cursor.style.opacity = '.6';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '16px';
                cursor.style.height = '16px';
                cursor.style.opacity = '1';
            });
        });
    }

    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinksAll.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--gold)';
                    }
                });
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
});
