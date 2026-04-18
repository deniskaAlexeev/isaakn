document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial Animations & Preloader
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
        // Remove FOUC hiding class
        document.documentElement.classList.remove('js-loading');

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

    // 2. Custom Cursor (Desktop only)
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    
    if (!isTouchDevice && cursor && follower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        });

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

        // 3. Magnetic effect
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
    }

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

    // 6. Audio Player Logic
    const globalAudio = document.getElementById('global-audio');
    const trackItems = document.querySelectorAll('.track-item');
    let currentPlayingItem = null;

    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ":" + (s < 10 ? "0" : "") + s;
    }

    trackItems.forEach(item => {
        const src = item.getAttribute('data-src');
        const playBtn = item.querySelector('.track-play');
        const progressCircle = item.querySelector('.progress-ring__circle');
        const durationDisplay = item.querySelector('.track-duration');
        
        // Initial circumference
        const circumference = 113; // 2 * pi * 18
        if(progressCircle) {
            progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
            progressCircle.style.strokeDashoffset = circumference;
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent bubbling

            const isPlaying = item.classList.contains('playing');

            // If a different track is playing, stop it
            if (currentPlayingItem && currentPlayingItem !== item) {
                currentPlayingItem.classList.remove('playing');
                // Reset its progress UI slightly
                const oldCircle = currentPlayingItem.querySelector('.progress-ring__circle');
                if(oldCircle) oldCircle.style.strokeDashoffset = circumference;
            }

            if (isPlaying) {
                globalAudio.pause();
                item.classList.remove('playing');
                currentPlayingItem = null;
            } else {
                if (globalAudio.src !== window.location.origin + '/' + src && !globalAudio.src.endsWith(src)) {
                    globalAudio.src = src;
                }
                globalAudio.play().catch(e => console.log("Audio play prevented:", e));
                item.classList.add('playing');
                currentPlayingItem = item;
            }
        });
    });

    // Audio progress update
    globalAudio.addEventListener('timeupdate', () => {
        if (!currentPlayingItem) return;
        
        const progressCircle = currentPlayingItem.querySelector('.progress-ring__circle');
        const durationDisplay = currentPlayingItem.querySelector('.track-duration');
        
        const duration = globalAudio.duration || 0;
        const currentTime = globalAudio.currentTime || 0;
        
        if (duration > 0) {
            const percent = currentTime / duration;
            const circumference = 113;
            const offset = circumference - percent * circumference;
            
            if(progressCircle) {
                progressCircle.style.strokeDashoffset = offset;
            }
            if(durationDisplay) {
                durationDisplay.textContent = formatTime(currentTime) + " / " + formatTime(duration);
            }
        }
    });

    // Reset when audio ends
    globalAudio.addEventListener('ended', () => {
        if(currentPlayingItem) {
            currentPlayingItem.classList.remove('playing');
            const progressCircle = currentPlayingItem.querySelector('.progress-ring__circle');
            if(progressCircle) progressCircle.style.strokeDashoffset = 113;
            currentPlayingItem = null;
        }
    });

    // Load initial metadata to set durations if possible
    trackItems.forEach(item => {
        const src = item.getAttribute('data-src');
        const durationDisplay = item.querySelector('.track-duration');
        const tempAudio = new Audio(src);
        tempAudio.addEventListener('loadedmetadata', () => {
            durationDisplay.textContent = formatTime(tempAudio.duration);
        });
    });

    // 7. Scroll Animations with GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

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

    const parallaxImgs = document.querySelectorAll('.parallax-img');
    parallaxImgs.forEach(img => {
        gsap.fromTo(img, 
            { yPercent: -15 },
            {
                yPercent: 15,
                ease: "none",
                scrollTrigger: {
                    trigger: img.parentElement,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1
                }
            }
        );
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
