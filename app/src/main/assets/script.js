/**
 * SCRIPT FOR ACCURATE PEST CONTROL
 * INTERACTIVE BEHAVIORS, VALIDATION, AND GOOGLE ANALYTICS SERVICE EVENTS
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  function handleHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll(); // Trigger immediately in case page is already scrolled


  // ==========================================
  // 2. MOBILE HAMBURGER MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const menuIcon = document.getElementById('menuIcon');

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = mobileNav.classList.toggle('active');
      
      // Update icon based on menu state
      if (isActive) {
        menuIcon.textContent = 'close';
      } else {
        menuIcon.textContent = 'menu';
      }
    });

    // Close mobile nav when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('.mobile-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        menuIcon.textContent = 'menu';
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileNav.classList.remove('active');
        menuIcon.textContent = 'menu';
      }
    });
  }


  // ==========================================
  // 3. INTERACTIVE BOOKING HOOKS FOR SERVICE CARDS
  // ==========================================
  const bookingLinks = document.querySelectorAll('.service-book-link');
  const serviceDropdown = document.getElementById('serviceNeeded');

  bookingLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetServiceId = link.getAttribute('data-service-value');
      
      if (serviceDropdown && targetServiceId) {
        // Pre-select the service inside the dropdown
        serviceDropdown.value = targetServiceId;
        
        // Remove error highlights if they exist
        const formGroup = serviceDropdown.closest('.form-group');
        if (formGroup) {
          formGroup.classList.remove('has-error');
        }
      }

      // Smooth scroll to the contact form section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // "View All Services" button event listener
  const viewAllBtn = document.getElementById('viewAllServicesBtn');
  if (viewAllBtn && serviceDropdown) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Smooth scroll to the contact form section
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        // Focus the dropdown so user sees all choices
        setTimeout(() => {
          serviceDropdown.focus();
        }, 800);
      }
    });
  }


  // ==========================================
  // 4. TESTIMONIALS CAROUSEL ENGINE
  // ==========================================
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');
  
  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    const totalSlides = track.children.length;

    function updateCarousel(slideIndex) {
      if (slideIndex < 0) slideIndex = totalSlides - 1;
      if (slideIndex >= totalSlides) slideIndex = 0;
      
      currentSlide = slideIndex;
      
      // Shift track via transform translateX
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update indicator active classes
      indicators.forEach((ind, index) => {
        if (index === currentSlide) {
          ind.classList.add('active');
        } else {
          ind.classList.remove('active');
        }
      });
    }

    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlide + 1);
    });

    indicators.forEach((indicator) => {
      indicator.addEventListener('click', () => {
        const slideIdx = parseInt(indicator.getAttribute('data-slide'), 10);
        updateCarousel(slideIdx);
      });
    });

    // Auto-advance testimonials every 6 seconds
    let carouselInterval = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 6000);

    // Reset interval on manual user interaction
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      container.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(() => {
          updateCarousel(currentSlide + 1);
        }, 6000);
      });
    }
  }


  // ==========================================
  // 5. FAQ ACCORDION TRANSITIONS
  // ==========================================
  const faqTriggers = document.querySelectorAll('.faq-trigger');

  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.parentElement;
      const content = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other active FAQ items for a clean single-open layout
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
          item.querySelector('.faq-content').style.maxHeight = null;
        }
      });

      // Toggle active state on current item
      parent.classList.toggle('active');
      trigger.setAttribute('aria-expanded', !isExpanded);

      if (parent.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = null;
      }
    });
  });


  // ==========================================
  // 6. CONTACT LEAD FORM VALIDATION & WHATSAPP REDIRECT
  // ==========================================
  const bookingForm = document.getElementById('pestBookingForm');
  const targetPhoneNumber = '917507102266'; // Client's destination business number (pre-filled target)

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form controls
      const visitorName = document.getElementById('visitorName');
      const visitorPhone = document.getElementById('visitorPhone');
      const visitorArea = document.getElementById('visitorArea');
      const serviceNeeded = document.getElementById('serviceNeeded');
      const visitorMessage = document.getElementById('visitorMessage');

      let isValid = true;

      // Clean validation styles initially
      document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('has-error');
      });

      // 1. Full Name Validation
      if (!visitorName.value.trim()) {
        visitorName.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // 2. Phone Number Validation (Regex Check for Indian/International Mobile Format)
      const phonePattern = /^[0-9-+ ]{10,15}$/;
      if (!visitorPhone.value.trim() || !phonePattern.test(visitorPhone.value.trim())) {
        visitorPhone.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // 3. Property Address/Area Validation
      if (!visitorArea.value.trim()) {
        visitorArea.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // 4. Selected Service Validation
      if (!serviceNeeded.value) {
        serviceNeeded.closest('.form-group').classList.add('has-error');
        isValid = false;
      }

      // If validation fails, do not compile or redirect
      if (!isValid) {
        // Focus the first invalid element
        const firstError = document.querySelector('.has-error .form-control');
        if (firstError) firstError.focus();
        return;
      }

      // Retrieve friendly display name for the selected service
      const selectedOptionText = serviceNeeded.options[serviceNeeded.selectedIndex].text;

      // ==========================================
      // GOOGLE ANALYTICS EVENT FOR BOOKING SUBMIT
      // ==========================================
      try {
        if (typeof gtag === 'function') {
          // Fire custom event as requested
          gtag('event', 'booking_form_submit', {
            'service_needed': serviceNeeded.value,
            'service_name': selectedOptionText,
            'visitor_name': visitorName.value.trim(),
            'visitor_area': visitorArea.value.trim()
          });
          console.log('GA4 event: booking_form_submit triggered successfully.');
        }
      } catch (err) {
        console.error('GA4 tracking error on booking_form_submit:', err);
      }
      // ==========================================

      // Compile pre-filled message structure
      const name = visitorName.value.trim();
      const phone = visitorPhone.value.trim();
      const address = visitorArea.value.trim();
      const optionalNote = visitorMessage.value.trim() || 'No additional notes provided.';

      const whatsappText = `Hi, I want pest control service.\nName: ${name}\nAddress: ${address}\nService Needed: ${selectedOptionText}\nPhone: ${phone}\nNotes: ${optionalNote}`;
      
      // Properly URL-encode message payload
      const encodedText = encodeURIComponent(whatsappText);
      const redirectUrl = `https://wa.me/${targetPhoneNumber}?text=${encodedText}`;

      // Open redirect URL in new tab as requested
      window.open(redirectUrl, '_blank');

      // Optional feedback: reset form
      bookingForm.reset();
    });
  }


  // ==========================================
  // 7. GOOGLE ANALYTICS WHATSAPP FLOATING CLICK EVENT
  // ==========================================
  const whatsappFloatingBtn = document.getElementById('whatsappFloatingBtn');
  if (whatsappFloatingBtn) {
    whatsappFloatingBtn.addEventListener('click', () => {
      try {
        if (typeof gtag === 'function') {
          // Fire custom event as requested
          gtag('event', 'whatsapp_button_click', {
            'button_type': 'floating_fixed',
            'timestamp': new Date().toISOString()
          });
          console.log('GA4 event: whatsapp_button_click triggered successfully.');
        }
      } catch (err) {
        console.error('GA4 tracking error on whatsapp_button_click:', err);
      }
    });
  }


  // ==========================================
  // 8. SCROLL ENTRANCE ANIMATIONS (Intersection Observer)
  // ==========================================
  const animationElements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .about-image-column, .about-content-column, .form-card-column, .info-card-column');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Unobserve after animating once to prevent scroll stuttering
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animationElements.forEach(el => {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback: add class immediately if browser doesn't support IntersectionObserver
    animationElements.forEach(el => {
      el.classList.add('animated');
    });
  }


  // ==========================================
  // 9. ACTIVE NAV LINK TRACKING ON SCROLL
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function highlightActiveNavigation() {
    let scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120; // Margin to offset sticky header height
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightActiveNavigation);
  highlightActiveNavigation();


  // ==========================================================================
  // 10. AESTHETIC STUDIO DESIGN SELECTOR CONTROLLER
  // ==========================================================================
  const customizerToggleBtn = document.getElementById('customizerToggleBtn');
  const customizerCloseBtn = document.getElementById('customizerCloseBtn');
  const customizerSidebar = document.getElementById('customizerSidebar');
  const customizerBackdrop = document.getElementById('customizerBackdrop');

  if (customizerToggleBtn && customizerCloseBtn && customizerSidebar && customizerBackdrop) {
    
    // Toggle sidebar opening
    customizerToggleBtn.addEventListener('click', () => {
      customizerSidebar.classList.add('open');
      customizerBackdrop.classList.add('active');
    });

    // Close sidebar
    const closeSidebar = () => {
      customizerSidebar.classList.remove('open');
      customizerBackdrop.classList.remove('active');
    };

    customizerCloseBtn.addEventListener('click', closeSidebar);
    customizerBackdrop.addEventListener('click', closeSidebar);

    // Theme Palettes Selector swapping
    const paletteBtns = document.querySelectorAll('.palette-option-btn');
    paletteBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active class state
        paletteBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Extract theme value and replace class on body
        const targetTheme = btn.getAttribute('data-theme');
        if (targetTheme) {
          // Remove previous themes
          document.body.classList.remove('theme-ocean', 'theme-forest', 'theme-midnight', 'theme-royal');
          document.body.classList.add(`theme-${targetTheme}`);
          console.log(`Design Studio: Switched theme palette to ${targetTheme}`);
        }
      });
    });

    // Hero Layouts Selector triggers
    const heroLayoutCards = document.querySelectorAll('[data-hero-layout]');
    const heroSection = document.getElementById('home');
    heroLayoutCards.forEach(card => {
      card.addEventListener('click', () => {
        heroLayoutCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const targetLayout = card.getAttribute('data-hero-layout');
        if (heroSection && targetLayout) {
          // Reset hero classes and apply selection
          heroSection.className = 'hero-section';
          heroSection.classList.add(`hero-layout-${targetLayout}`);
          console.log(`Design Studio: Switched Hero layout to ${targetLayout}`);
        }
      });
    });

    // Services Layout Selector triggers
    const servicesLayoutCards = document.querySelectorAll('[data-services-layout]');
    const servicesSection = document.querySelector('.services-section');
    servicesLayoutCards.forEach(card => {
      card.addEventListener('click', () => {
        servicesLayoutCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const targetLayout = card.getAttribute('data-services-layout');
        if (servicesSection && targetLayout) {
          // Update services layout state class
          servicesSection.className = 'services-section';
          servicesSection.classList.add(`services-layout-${targetLayout}`);
          console.log(`Design Studio: Switched Services layout to ${targetLayout}`);
        }
      });
    });

    // Gallery / Before-After layout options
    const galleryLayoutCards = document.querySelectorAll('[data-gallery-layout]');
    const gallerySection = document.querySelector('.gallery-section');
    galleryLayoutCards.forEach(card => {
      card.addEventListener('click', () => {
        galleryLayoutCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const targetLayout = card.getAttribute('data-gallery-layout');
        if (gallerySection && targetLayout) {
          gallerySection.className = 'gallery-section';
          gallerySection.classList.add(`gallery-layout-${targetLayout}`);
          console.log(`Design Studio: Switched Gallery layout to ${targetLayout}`);
        }
      });
    });
  }


  // ==========================================================================
  // 11. BEFORE-AFTER REVEAL SLIDING ENGINE
  // ==========================================================================
  const sliderWrapper = document.getElementById('sliderWrapper');
  const sliderOverlayAfter = document.getElementById('sliderOverlayAfter');
  const sliderHandle = document.getElementById('sliderHandle');

  if (sliderWrapper && sliderOverlayAfter && sliderHandle) {
    let isDragging = false;

    const setSliderPosition = (clientX) => {
      const rect = sliderWrapper.getBoundingClientRect();
      let x = clientX - rect.left;
      
      // Keep x within wrapper bounds
      if (x < 0) x = 0;
      if (x > rect.width) x = rect.width;

      const percentage = (x / rect.width) * 100;
      sliderOverlayAfter.style.width = `${percentage}%`;
      sliderHandle.style.left = `${percentage}%`;
    };

    // Mouse interactions
    sliderHandle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isDragging = true;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      setSliderPosition(e.clientX);
    });

    // Touch interactions (Mobile & tablet support)
    sliderHandle.addEventListener('touchstart', () => {
      isDragging = true;
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      if (e.touches.length > 0) {
        setSliderPosition(e.touches[0].clientX);
      }
    });

    // Optional click on slider tracks to instant snap
    sliderWrapper.addEventListener('click', (e) => {
      if (e.target !== sliderHandle && !sliderHandle.contains(e.target)) {
        setSliderPosition(e.clientX);
      }
    });
  }

  // ==========================================================================
  // 12. DYNAMIC HERO BACKGROUND LOADER (GOOGLE DRIVE LINK + FALLBACKS)
  // ==========================================================================
  const heroSectionElement = document.getElementById('home');
  if (heroSectionElement) {
    const driveUrl = "https://lh3.googleusercontent.com/d/14GULzQVLxzhp6h9S8VCVBbAEdI0ArHpk";
    const backupDriveUrl = "https://docs.google.com/uc?export=download&id=14GULzQVLxzhp6h9S8VCVBbAEdI0ArHpk";
    
    const testImg = new Image();
    testImg.onload = function() {
      heroSectionElement.style.backgroundImage = `url('${driveUrl}')`;
    };
    testImg.onerror = function() {
      const altImg = new Image();
      altImg.onload = function() {
        heroSectionElement.style.backgroundImage = `url('${backupDriveUrl}')`;
      };
      altImg.onerror = function() {
        const localImg = new Image();
        localImg.onload = function() {
          heroSectionElement.style.backgroundImage = "url('hero_bg.png')";
        };
        localImg.onerror = function() {
          heroSectionElement.style.backgroundImage = "url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1920&auto=format&fit=crop')";
        };
        localImg.src = 'hero_bg.png';
      };
      altImg.src = backupDriveUrl;
    };
    testImg.src = driveUrl;
  }

  // ==========================================================================
  // 13. DYNAMIC MOSQUITO CONTROL IMAGE LOADER (LOCAL IMAGE + FALLBACK)
  // ==========================================================================
  const mosquitoImg = document.getElementById('mosquito-service-img');
  if (mosquitoImg) {
    const testImg = new Image();
    testImg.onload = function() {
      // If mosquito_bg.png loads successfully (e.g. user places file), prioritize it
      mosquitoImg.src = 'mosquito_bg.png';
    };
    testImg.onerror = function() {
      // Fallback to high-quality Unsplash image of professional outdoor mosquito fogging in a garden
      mosquitoImg.src = 'https://images.unsplash.com/photo-1590138221364-c466c9c63283?q=80&w=800&auto=format&fit=crop';
    };
    testImg.src = 'mosquito_bg.png';
  }

  // ==========================================================================
  // 14. DYNAMIC TERMITE CONTROL IMAGE LOADER (GOOGLE DRIVE LINK + FALLBACKS)
  // ==========================================================================
  const termiteImg = document.getElementById('termite-service-img');
  if (termiteImg) {
    const driveUrl = "https://lh3.googleusercontent.com/d/1WiANMHg44K5KmvPa-pYLcs3luSjbH-tF";
    const backupDriveUrl = "https://docs.google.com/uc?export=download&id=1WiANMHg44K5KmvPa-pYLcs3luSjbH-tF";
    
    const testImg = new Image();
    testImg.onload = function() {
      termiteImg.src = driveUrl;
    };
    testImg.onerror = function() {
      const altImg = new Image();
      altImg.onload = function() {
        termiteImg.src = backupDriveUrl;
      };
      altImg.onerror = function() {
        termiteImg.src = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop';
      };
      altImg.src = backupDriveUrl;
    };
    testImg.src = driveUrl;
  }

});
