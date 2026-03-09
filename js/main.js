// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Menu toggle - initialize after DOM is ready
setTimeout(() => {
  const menuBtn = document.getElementById('menuBtn');
  const closeMenuBtn = document.getElementById('closeMenuBtn');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      menuOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', () => {
      menuOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    menuLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          menuOverlay.classList.remove('active');
          document.body.style.overflow = '';
          
          setTimeout(() => {
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      });
    });
  }
}, 100);

function initMainAnimations() {
  // Navigation scroll effect
  const navHeader = document.getElementById('navHeader');
  if (navHeader) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // Hero Entrance Animation
  if (document.querySelector('.hero')) {
    const heroTl = gsap.timeline({ delay: 0.2 });

    gsap.set('#heroImage', { x: '-60vw', scale: 1.08, opacity: 0 });
    gsap.set('#heroDivider', { scaleY: 0, transformOrigin: 'top' });
    gsap.set('#heroHeadline span', { y: 60, opacity: 0 });
    gsap.set(['#heroSubheadline', '#heroCta', '#heroMeta'], { y: 24, opacity: 0 });

    heroTl
      .to('#heroImage', { x: 0, scale: 1, opacity: 1, duration: 1, ease: 'power3.out' })
      .to('#heroDivider', { scaleY: 1, duration: 0.8, ease: 'power2.out' }, '-=0.8')
      .to('#heroHeadline span', { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '-=0.6')
      .to(['#heroSubheadline', '#heroCta', '#heroMeta'], { y: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'power3.out' }, '-=0.5');

    // Hero Scroll Animation (Exit only)
    const heroScrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6,
        onLeaveBack: () => {
          gsap.to('#heroImage', { x: 0, scale: 1, opacity: 1, duration: 0.3 });
          gsap.to('#heroDivider', { scaleY: 1, opacity: 1, duration: 0.3 });
          gsap.to('#heroHeadline span', { x: 0, opacity: 1, duration: 0.3 });
          gsap.to(['#heroSubheadline', '#heroCta', '#heroMeta'], { y: 0, opacity: 1, duration: 0.3 });
        }
      }
    });

    heroScrollTl
      .fromTo('#heroHeadline span', { x: 0, opacity: 1 }, { x: '18vw', opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo(['#heroSubheadline', '#heroCta'], { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#heroImage', { x: 0, scale: 1, opacity: 1 }, { x: '-20vw', scale: 1.06, opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#heroDivider', { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0, transformOrigin: 'bottom', ease: 'power2.in' }, 0.7)
      .fromTo('#heroMeta', { y: 0, opacity: 1 }, { y: '5vh', opacity: 0, ease: 'power2.in' }, 0.75);
  }

  // Selected Work Animations
  if (document.querySelector('#work')) {
    gsap.fromTo('#work .section-header > *', 
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#work',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#featuredCard',
      { x: '20vw', rotateZ: 2, opacity: 0 },
      {
        x: 0,
        rotateZ: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#work',
          start: 'top 75%',
          end: 'top 35%',
          scrub: 0.4
        }
      }
    );

    gsap.fromTo('#projectList .project-item',
      { x: '-12vw', opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#projectList',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Manifesto Scroll Animation
  if (document.querySelector('#manifesto')) {
    const manifestoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#manifesto',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6
      }
    });

    manifestoTl
      .fromTo('#manifestoBg', { scale: 1.12, x: '8vw', opacity: 0.6 }, { scale: 1, x: 0, opacity: 1, ease: 'none' }, 0)
      .fromTo('#manifestoHeadline span', { y: 80, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.02, ease: 'none' }, 0.05)
      .fromTo('#manifestoBody', { y: 40, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1)
      .fromTo('#manifestoBg', { scale: 1, x: 0, opacity: 1 }, { scale: 1.08, x: '-6vw', opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#manifestoHeadline span', { y: 0, opacity: 1 }, { y: '-18vh', opacity: 0, stagger: 0.01, ease: 'power2.in' }, 0.7)
      .fromTo('#manifestoBody', { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.7);
  }

  // Capabilities Animations
  if (document.querySelector('#services')) {
    gsap.fromTo('#services .section-header > *',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#services',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#capabilitiesBlocks .capability-block',
      { x: '-10vw', opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#capabilitiesBlocks',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#capabilitiesImage',
      { x: '18vw', scale: 1.06, opacity: 0 },
      {
        x: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#services',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#capabilitiesDivider',
      { scaleY: 0, transformOrigin: 'top' },
      {
        scaleY: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#services',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Process Scroll Animation
  if (document.querySelector('#process')) {
    const processTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#process',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6
      }
    });

    processTl
      .fromTo('#processBg', { scale: 1.14, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
      .fromTo('#processWord', { x: '-60vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
      .fromTo('#processTop', { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1)
      .fromTo('#processBg', { scale: 1, opacity: 1 }, { scale: 1.08, opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#processWord', { y: 0, opacity: 1 }, { y: '18vh', opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#processTop', { y: 0, opacity: 1 }, { y: '-10vh', opacity: 0, ease: 'power2.in' }, 0.7);
  }

  // Latest Animations
  if (document.querySelector('.latest')) {
    gsap.fromTo('.latest .section-header > *',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.latest',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#notesList .note-item',
      { x: '-8vw', opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#notesList',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Collaboration Scroll Animation
  if (document.querySelector('.collaboration')) {
    const collabTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.collaboration',
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.6
      }
    });

    collabTl
      .fromTo('#collabBg', { scale: 1.12, opacity: 0.5 }, { scale: 1, opacity: 1, ease: 'none' }, 0)
      .fromTo('#collabWord', { x: '-55vw', opacity: 0 }, { x: 0, opacity: 1, ease: 'none' }, 0)
      .fromTo('#collabBottom', { y: 30, opacity: 0 }, { y: 0, opacity: 1, ease: 'none' }, 0.1)
      .fromTo('#collabBg', { scale: 1, opacity: 1 }, { scale: 1.08, opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#collabWord', { y: 0, opacity: 1 }, { y: '-16vh', opacity: 0, ease: 'power2.in' }, 0.7)
      .fromTo('#collabBottom', { y: 0, opacity: 1 }, { y: '10vh', opacity: 0, ease: 'power2.in' }, 0.7);
  }

  // Contact Animations
  if (document.querySelector('#contact')) {
    gsap.fromTo('#contact .section-header > *',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#contactDetails',
      { x: '-6vw', opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#contactForm',
      { x: '14vw', rotateZ: 1.5, opacity: 0 },
      {
        x: 0,
        rotateZ: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#contactForm .form-group',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '#contactForm',
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Footer Animations
  if (document.querySelector('.footer')) {
    gsap.fromTo('#footerWordmark',
      { scale: 0.96, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 90%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    gsap.fromTo('#footerBottom',
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.footer',
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }

  // Form submission
  const contactForm = document.getElementById('contactFormElement');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for reaching out! We will get back to you soon.');
      e.target.reset();
    });
  }

  // Back to top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Auto-initialize if no preloader
if (!document.getElementById('preloader')) {
  initMainAnimations();
}
