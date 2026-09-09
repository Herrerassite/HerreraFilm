document.addEventListener("DOMContentLoaded", () => {
            
    // --- 0. OPTIMIZACIÓN MÓVIL: SMART VIDEO AUTOPLAY ---
    const smartVideos = document.querySelectorAll('.smart-video');
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.play().catch(e => console.log("Autoplay paused"));
            } else {
                entry.target.pause();
            }
        });
    }, { rootMargin: '100px 0px' });
    smartVideos.forEach(vid => videoObserver.observe(vid));

    // --- 1. SMOOTH SCROLL (LENIS) ---
    const lenis = new Lenis({
        duration: 1.4, 
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        direction: 'vertical', gestureDirection: 'vertical', smooth: true, smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        renderLoop();
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ELEMENTOS DEL DOM
    const videoBg = document.querySelector('.video-bg');
    const heroContent = document.querySelector('.hero-content');
    const navbar = document.getElementById('navbar');
    
    const marqueeTop = document.querySelector('.scroll-left');
    const marqueeBottom = document.querySelector('.scroll-right');
    
    const secMetodo = document.getElementById('experiencia');
    const scaleMetodo = document.getElementById('scale-metodo');
    const trackMetodo = document.getElementById('track-metodo');
    const contentMetodo = document.getElementById('content-metodo');

    const secDirector = document.getElementById('director');
    const scaleDirector = document.getElementById('scale-director');
    const trackDirector = document.getElementById('track-director');
    const contentDirector = document.getElementById('content-director');
    
    const secContacto = document.getElementById('contacto');
    const boxContacto = document.getElementById('contacto-box');
    const contactElements = boxContacto ? boxContacto.querySelectorAll(':scope > *') : [];
    const parallaxWraps = document.querySelectorAll('.parallax-wrap');
    
    let currentScroll = window.scrollY;
    let lastScrollY = window.scrollY;
    let posTop = 0, widthTop = 0, posBottom = 0, widthBottom = 0, marqueeSpeed = 0;
    
    let maxTransMetodo = 0, maxTransDirector = 0;
    let isDesktop = window.innerWidth > 992;

    // ESTADO DE SCROLL CACHEADO (SECRETO PARA 60FPS EN MÓVIL)
    const scrollState = {
        metodo: { top: 0, height: 0 },
        director: { top: 0, height: 0 },
        contacto: { top: 0, height: 0 },
        parallax: []
    };

    function getPageOffsetTop(el) {
        let top = 0;
        while(el) { top += el.offsetTop; el = el.offsetParent; }
        return top;
    }

    // --- 2. CÁLCULOS MATEMÁTICOS DE ALTURA (SOLO EN RESIZE) ---
    const calcDimensions = () => {
        isDesktop = window.innerWidth > 992;
        widthTop = marqueeTop.scrollWidth / 2;
        widthBottom = marqueeBottom.scrollWidth / 2;
        if (posBottom === 0) posBottom = -widthBottom; 
        
        if(trackMetodo && secMetodo && contentMetodo) {
            maxTransMetodo = contentMetodo.offsetWidth - window.innerWidth;
            let totalScrollMetodo = maxTransMetodo * 1.2; 
            secMetodo.style.height = `${totalScrollMetodo + window.innerHeight}px`;
            
            scrollState.metodo.top = getPageOffsetTop(secMetodo);
            scrollState.metodo.height = secMetodo.offsetHeight;
        }
        if(trackDirector && secDirector && contentDirector) {
            maxTransDirector = contentDirector.offsetWidth - window.innerWidth;
            let totalScrollDirector = maxTransDirector * 1.2;
            secDirector.style.height = `${totalScrollDirector + window.innerHeight}px`;
            
            scrollState.director.top = getPageOffsetTop(secDirector);
            scrollState.director.height = secDirector.offsetHeight;
        }

        if (secContacto) {
            scrollState.contacto.top = getPageOffsetTop(secContacto);
            scrollState.contacto.height = secContacto.offsetHeight;
        }

        scrollState.parallax = Array.from(parallaxWraps).map(wrap => {
            const parent = wrap.parentElement;
            return { wrap: wrap, top: getPageOffsetTop(parent), height: parent.offsetHeight };
        });
    };
    
    window.addEventListener('load', calcDimensions);
    window.addEventListener('resize', calcDimensions);

    lenis.on('scroll', (e) => { currentScroll = e.scroll; });

    // --- 3. BUCLE FÍSICO ULTRA-OPTIMIZADO 60FPS ---
    function renderLoop() {
        let delta = currentScroll - lastScrollY;
        lastScrollY = currentScroll;

        if (currentScroll < window.innerHeight) {
            videoBg.style.transform = `translate3d(0, ${(currentScroll * 0.4).toFixed(2)}px, 0)`;
            if(heroContent) {
                heroContent.style.transform = `translate3d(0, ${(currentScroll * 0.85).toFixed(2)}px, 0)`;
                heroContent.style.opacity = Math.max(0, 1 - (currentScroll / (window.innerHeight * 0.65))).toFixed(2);
            }
        }

        if (currentScroll > 60) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        marqueeSpeed += Math.abs(delta) * 0.05;
        marqueeSpeed *= 0.9; 
        let totalSpeed = 1.0 + marqueeSpeed;
        posTop -= totalSpeed; posBottom += totalSpeed; 

        if (widthTop > 0) {
            if (posTop <= -widthTop) posTop += widthTop;
            if (posTop > 0) posTop -= widthTop;
            marqueeTop.style.transform = `translate3d(${posTop.toFixed(2)}px, 0, 0)`;
        }
        if (widthBottom > 0) {
            if (posBottom >= 0) posBottom -= widthBottom;
            if (posBottom < -widthBottom) posBottom += widthBottom;
            marqueeBottom.style.transform = `translate3d(${posBottom.toFixed(2)}px, 0, 0)`;
        }

        let viewportOffset = window.innerWidth * 0.30; 
        
        // SECCIÓN 1: EL MÉTODO
        if (secMetodo && trackMetodo && scaleMetodo && maxTransMetodo > 0) {
                let rectTop = scrollState.metodo.top - currentScroll;
                let rectHeight = scrollState.metodo.height;

                let rawProgress = -rectTop / (rectHeight - window.innerHeight);
                let progress = Math.max(0, Math.min(1, rawProgress)); 
                
                let entryP = Math.max(0, Math.min(1, (rawProgress + 0.4) / 0.4)); 
                let exitP = Math.max(0, Math.min(1, (rawProgress - 1.0) / 0.4)); 
                
                let targetOpacity = 1; let targetBlur = 0; let targetScale = 1;

                if (rawProgress < 0.5) {
                    targetOpacity = entryP; 
                    targetBlur = isDesktop ? 20 * (1 - entryP) : 0; 
                    targetScale = 1.15 - (0.15 * entryP);
                } else {
                    targetOpacity = 1 - exitP; 
                    targetBlur = isDesktop ? 20 * exitP : 0; 
                    targetScale = 1 - (0.15 * exitP);
                }
                
                let xOffset = 0;
                let entryRatio = window.innerHeight / (rectHeight - window.innerHeight);
                
                if (rawProgress < 0) {
                    let normalizedEntry = rawProgress / entryRatio; 
                    xOffset = -(normalizedEntry * viewportOffset); 
                } else if (rawProgress > 1) {
                    let normalizedExit = (rawProgress - 1) / entryRatio; 
                    xOffset = -maxTransMetodo - (normalizedExit * viewportOffset);
                } else {
                    xOffset = -(progress * maxTransMetodo);
                }
                
                trackMetodo.style.transform = `translate3d(${xOffset.toFixed(2)}px, 0, 0)`;
                scaleMetodo.style.transform = `scale(${targetScale.toFixed(3)}) translateZ(0)`;
                if(isDesktop) scaleMetodo.style.filter = `blur(${targetBlur.toFixed(1)}px)`;
                scaleMetodo.style.opacity = targetOpacity.toFixed(2);
                scaleMetodo.style.visibility = 'visible'; 
            }

            // SECCIÓN 2: EL DIRECTOR
            if (secDirector && trackDirector && scaleDirector && maxTransDirector > 0) {
                let rectTop = scrollState.director.top - currentScroll;
                let rectHeight = scrollState.director.height;

                let rawProgress = -rectTop / (rectHeight - window.innerHeight);
                let progress = Math.max(0, Math.min(1, rawProgress));
                
                let entryP = Math.max(0, Math.min(1, (rawProgress + 0.4) / 0.4)); 
                let exitP = Math.max(0, Math.min(1, (rawProgress - 1.0) / 0.4)); 
                
                let targetOpacity = 1; let targetBlur = 0; let targetScale = 1;

                if (rawProgress < 0.5) {
                    targetOpacity = entryP; 
                    targetBlur = isDesktop ? 20 * (1 - entryP) : 0; 
                    targetScale = 1.15 - (0.15 * entryP);
                } else {
                    targetOpacity = 1 - exitP; 
                    targetBlur = isDesktop ? 20 * exitP : 0; 
                    targetScale = 1 - (0.15 * exitP);
                }
                
                let xOffset = 0;
                let entryRatio = window.innerHeight / (rectHeight - window.innerHeight);
                
                if (rawProgress < 0) {
                    let normalizedEntry = rawProgress / entryRatio; 
                    xOffset = -maxTransDirector + (normalizedEntry * viewportOffset); 
                } else if (rawProgress > 1) {
                    let normalizedExit = (rawProgress - 1) / entryRatio; 
                    xOffset = 0 + (normalizedExit * viewportOffset);
                } else {
                    xOffset = -maxTransDirector + (progress * maxTransDirector);
                }
                
                trackDirector.style.transform = `translate3d(${xOffset.toFixed(2)}px, 0, 0)`;
                scaleDirector.style.transform = `scale(${targetScale.toFixed(3)}) translateZ(0)`;
                if(isDesktop) scaleDirector.style.filter = `blur(${targetBlur.toFixed(1)}px)`;
                scaleDirector.style.opacity = targetOpacity.toFixed(2);
                scaleDirector.style.visibility = 'visible'; 
            }

        // ===============================================
        // PARALLAX EFECTO LAX PARA LOS VÍDEOS DEL PORTFOLIO
        // ===============================================
        if (scrollState.parallax.length > 0) {
            let windowH = window.innerHeight;
            scrollState.parallax.forEach(pData => {
                let rectTop = pData.top - currentScroll;
                let rectBottom = rectTop + pData.height;
                
                if (rectTop < windowH && rectBottom > 0) {
                    let progress = (windowH - rectTop) / (windowH + pData.height);
                    let maxMovement = pData.height * 0.45;
                    let yOffset = (progress - 0.5) * maxMovement;
                    
                    pData.wrap.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
                }
            });
        }

        // ===============================================
        // CAJA DE CONTACTO 3D
        // ===============================================
        if (secContacto && boxContacto) {
            let rectTop = scrollState.contacto.top - currentScroll;
            let rectHeight = scrollState.contacto.height;
            let windowH = window.innerHeight;
            
            if (isDesktop && rectTop < windowH && rectTop + rectHeight > 0) {
                let entranceProgress = 1 - (rectTop - windowH * 0.1) / (windowH * 0.7);
                entranceProgress = Math.max(0, Math.min(1, entranceProgress));
                
                let boxScale = 0.85 + (0.15 * entranceProgress); 
                let boxBlur = 15 * (1 - entranceProgress);     
                
                boxContacto.style.transform = `scale(${boxScale.toFixed(3)}) translateZ(0)`;
                boxContacto.style.filter = `blur(${boxBlur.toFixed(1)}px)`;
                boxContacto.style.opacity = Math.max(0.01, entranceProgress).toFixed(2);

                let parallaxProgress = (windowH - rectTop) / (windowH + rectHeight);
                parallaxProgress = Math.max(0, Math.min(1, parallaxProgress));

                contactElements.forEach((el, index) => {
                    let speed = 25 + (index * 15); 
                    let yOffset = speed - (parallaxProgress * speed * 2);
                    el.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
                });
            } else if (!isDesktop) {
                boxContacto.style.transform = 'translateZ(0)';
                boxContacto.style.filter = 'none';
                boxContacto.style.opacity = '1';
                contactElements.forEach(el => el.style.transform = 'translateZ(0)');
            }
        }
    }

    // --- 4. MENÚ MÓVIL Y NAVEGACIÓN ---
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active'); 
        navLinks.classList.toggle('active');
        if(navLinks.classList.contains('active')) lenis.stop(); else lenis.start();
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); 
            mobileMenuBtn.classList.remove('active'); 
            navLinks.classList.remove('active'); 
            lenis.start();
            const targetId = item.getAttribute('href');
            lenis.scrollTo(targetId, { duration: 1.5, offset: 0 });
        });
    });

    // Animaciones Nativas (Portfolio revelado alterno y fade up general)
    const fadeElements = document.querySelectorAll('.fade-up, .img-reveal');
    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    fadeElements.forEach(el => appearOnScroll.observe(el));
    setTimeout(() => { if(heroContent) heroContent.classList.add('visible'); }, 250);

    // ===============================================
    // MOTOR DE TIPOGRAFÍA MAGNÉTICA OPTIMIZADO
    // ===============================================
    if (isDesktop) {
        const textContainers = document.querySelectorAll('.hero-title, .hero-subtitle, .exp-title, .exp-paragraph, .exp-highlight, .section-title, .marquee-text, .contacto-title, .contacto-text');
        const allContainersData = [];

        textContainers.forEach(container => {
            const newNodes = [];
            container.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    const words = node.textContent.split(/(\s+)/);
                    
                    words.forEach(word => {
                        if (word === '') return;
                        if (word.trim() === '') {
                            newNodes.push(document.createTextNode(word)); 
                        } else {
                            const wordSpan = document.createElement('span');
                            wordSpan.style.whiteSpace = 'nowrap';
                            
                            const chars = word.split('');
                            chars.forEach(char => {
                                const span = document.createElement('span');
                                span.className = 'char';
                                span.textContent = char;
                                wordSpan.appendChild(span);
                            });
                            newNodes.push(wordSpan);
                        }
                    });
                } else {
                    newNodes.push(node.cloneNode(true)); 
                }
            });
            
            container.innerHTML = '';
            newNodes.forEach(node => container.appendChild(node));

            container.style.position = 'relative';
            
            const isTitle = container.tagName.match(/^H[1-6]$/i) || container.classList.contains('marquee-text') || container.classList.contains('exp-highlight') || container.classList.contains('contacto-title');
            const radius = isTitle ? 140 : 80; 
            const maxScale = isTitle ? 0.4 : 0.15; 
            
            const chars = container.querySelectorAll('.char');
            const containerData = {
                container: container,
                chars: Array.from(chars).map(char => ({
                    el: char, x: 0, y: 0, 
                    currentScale: 1, targetScale: 1, isHovered: false
                })),
                radius: radius,
                maxScale: maxScale,
                isActive: false,
                mouseX: -1000,
                mouseY: -1000
            };

            container.addEventListener('mouseenter', () => {
                containerData.isActive = true;
                containerData.chars.forEach(item => {
                    item.x = item.el.offsetLeft + item.el.offsetWidth / 2;
                    item.y = item.el.offsetTop + item.el.offsetHeight / 2;
                });
            });

            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                containerData.mouseX = e.clientX - rect.left;
                containerData.mouseY = e.clientY - rect.top;
            });

            container.addEventListener('mouseleave', () => {
                containerData.isActive = false;
            });
            
            allContainersData.push(containerData);
        });

        function animateMagneticText() {
            allContainersData.forEach(data => {
                data.chars.forEach(item => {
                    if (data.isActive) {
                        const dist = Math.hypot(data.mouseX - item.x, data.mouseY - item.y);
                        if (dist < data.radius) {
                            item.targetScale = 1 + ((data.radius - dist) / data.radius) * data.maxScale;
                            if(!item.isHovered) {
                                item.el.style.color = 'var(--champagne)';
                                item.el.style.zIndex = '2';
                                item.isHovered = true;
                            }
                        } else {
                            item.targetScale = 1;
                            if(item.isHovered) {
                                item.el.style.color = '';
                                item.el.style.zIndex = '1';
                                item.isHovered = false;
                            }
                        }
                    } else {
                        item.targetScale = 1;
                        if(item.isHovered) {
                            item.el.style.color = '';
                            item.el.style.zIndex = '1';
                            item.isHovered = false;
                        }
                    }

                    if (Math.abs(item.currentScale - item.targetScale) > 0.001) {
                        item.currentScale += (item.targetScale - item.currentScale) * 0.25;
                        item.el.style.transform = `scale(${item.currentScale.toFixed(3)})`;
                    } else if (item.currentScale !== 1 && item.targetScale === 1) {
                        item.currentScale = 1;
                        item.el.style.transform = 'scale(1)';
                    }
                });
            });
            requestAnimationFrame(animateMagneticText);
        }
        
        animateMagneticText();
    }
});