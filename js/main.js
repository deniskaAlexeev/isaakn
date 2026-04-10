document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader & Initial Animations
    gsap.to(".loader-logo", { opacity: 1, duration: 1, ease: "power2.inOut" });
    
    setTimeout(() => {
        gsap.to("#preloader", {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: initHeroAnimations
        });
    }, 1500);

    function initHeroAnimations() {
        // Image reveal
        const wrappers = document.querySelectorAll('.image-wrapper');
        wrappers.forEach(wrap => wrap.classList.add('revealed'));
        
        // Text reveals
        gsap.fromTo(".hero-subtitle", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );
        gsap.fromTo(".hero-title", 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
        );
        gsap.fromTo(".hero-actions", 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power3.out" }
        );
    }

    // 2. Custom Cursor (Desktop only mostly)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    
    // Only run if not on touch device
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        });

        // Hover effect for interactive elements (magnetic class elements + links)
        const hoverables = document.querySelectorAll('a, button, .magnetic, .magnetic-area');
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                follower.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                follower.classList.remove('hovered');
            });
        });
    }

    // 3. Magnetic effect for buttons
    const magneticEls = document.querySelectorAll('.magnetic');
    magneticEls.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) - (rect.width / 2);
            const y = (e.clientY - rect.top) - (rect.height / 2);
            
            gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        });
        
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.3)" });
        });
    });

    // 4. Header Scroll State
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 5. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav-link');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // 6. Scroll Animations with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Fade up texts
    const textReveals = document.querySelectorAll('.reveal-text');
    textReveals.forEach(text => {
        gsap.fromTo(text, 
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power3.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%",
                }
            }
        );
    });

    // Fade elements
    const fadeReveals = document.querySelectorAll('.reveal-fade');
    fadeReveals.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0 },
            {
                opacity: 1, duration: 1.5, ease: "power2.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                }
            }
        );
    });

    // Parallax Images
    const parallaxImgs = document.querySelectorAll('.parallax-img');
    parallaxImgs.forEach(img => {
        gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Set Copyright Year
    document.getElementById('year').textContent = new Date().getFullYear();
});
