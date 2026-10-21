/**
 * DK MAVE — Luxury Portfolio JavaScript
 * Brand: DK MAVE | Web Designer • Digital Creator • UGC Creator
 * Author: Dinesh Kumar
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. DOM Elements
  // -------------------------------------------------------------------------
  const siteHeader = document.getElementById('site-header');
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Contact Form & Modal Elements
  const contactForm = document.getElementById('contact-form');
  const serviceSelect = document.getElementById('service-select');
  const contactModal = document.getElementById('contact-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalWhatsappBtn = document.getElementById('modal-whatsapp-btn');
  const modalEmailBtn = document.getElementById('modal-email-btn');

  // Custom Cursor Elements
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');

  // -------------------------------------------------------------------------
  // 2. Sticky Header & Scroll Progress
  // -------------------------------------------------------------------------
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Header glassmorphism background
    if (scrollY > 50) {
      siteHeader?.classList.add('is-scrolled');
    } else {
      siteHeader?.classList.remove('is-scrolled');
    }

    // Scroll progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    // Active navigation highlight
    let currentSectionId = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    mobileLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial invocation

  // -------------------------------------------------------------------------
  // 3. Mobile Navigation Drawer
  // -------------------------------------------------------------------------
  const openMobileMenu = () => {
    mobileDrawer?.classList.add('is-open');
    mobileOverlay?.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    mobileToggle?.setAttribute('aria-expanded', 'true');
  };

  const closeMobileMenu = () => {
    mobileDrawer?.classList.remove('is-open');
    mobileOverlay?.classList.remove('is-visible');
    document.body.style.overflow = '';
    mobileToggle?.setAttribute('aria-expanded', 'false');
  };

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileCloseBtn?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close mobile drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeModal();
    }
  });

  // -------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (Intersection Observer)
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-fade');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: show immediately
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // -------------------------------------------------------------------------
  // 5. Service Pre-Selection Trigger
  // -------------------------------------------------------------------------
  // When user clicks "Inquire" on a service card, automatically pre-select that service
  const serviceInquireBtns = document.querySelectorAll('[data-service-inquire]');
  serviceInquireBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const serviceName = btn.getAttribute('data-service-inquire');
      if (serviceSelect && serviceName) {
        serviceSelect.value = serviceName;
        // Visual focus pulse on select element
        setTimeout(() => {
          serviceSelect.focus();
          serviceSelect.style.borderColor = 'var(--gold-primary)';
          setTimeout(() => {
            serviceSelect.style.borderColor = '';
          }, 1500);
        }, 600);
      }
    });
  });

  // -------------------------------------------------------------------------
  // 6. Contact Form Validation & Real Submission Flow
  // -------------------------------------------------------------------------
  let pendingSubmission = null;

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const clearFormErrors = () => {
    const errorGroups = document.querySelectorAll('.form-group.has-error');
    errorGroups.forEach((group) => group.classList.remove('has-error'));
  };

  const showFieldError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const parent = input?.closest('.form-group');
    if (parent) {
      parent.classList.add('has-error');
      const errSpan = parent.querySelector('.form-error-msg');
      if (errSpan) errSpan.textContent = message;
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const serviceInput = document.getElementById('service-select');
      const messageInput = document.getElementById('message');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const service = serviceInput ? serviceInput.value : '';
      const message = messageInput ? messageInput.value.trim() : '';

      let hasErrors = false;

      if (!name) {
        showFieldError('name', 'Please enter your name.');
        hasErrors = true;
      }

      if (!email) {
        showFieldError('email', 'Please enter your email address.');
        hasErrors = true;
      } else if (!validateEmail(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        hasErrors = true;
      }

      if (!message) {
        showFieldError('message', 'Please share brief details about your project.');
        hasErrors = true;
      }

      if (hasErrors) {
        return;
      }

      // Store pending submission details for direct client routing
      pendingSubmission = {
        name,
        email,
        service: service || 'General Creative Inquiry',
        message,
      };

      // Construct prefilled WhatsApp & Email links
      const waNumber = '919003522324';
      const waText = `Hello Dinesh, I visited your portfolio and would like to discuss a project:%0A%0A• Name: ${encodeURIComponent(name)}%0A• Email: ${encodeURIComponent(email)}%0A• Service: ${encodeURIComponent(pendingSubmission.service)}%0A• Project Details: ${encodeURIComponent(message)}`;
      const waUrl = `https://wa.me/${waNumber}?text=${waText}`;

      const emailSubject = `Project Inquiry from ${name} [DK MAVE Portfolio]`;
      const emailBody = `Hi Dinesh,%0D%0A%0D%0AI would like to discuss a project with DK MAVE.%0D%0A%0D%0AName: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0AService Required: ${encodeURIComponent(pendingSubmission.service)}%0D%0A%0D%0AProject Details:%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ABest regards,%0D%0A${encodeURIComponent(name)}`;
      const mailtoUrl = `mailto:dkmave2@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;

      if (modalWhatsappBtn) modalWhatsappBtn.href = waUrl;
      if (modalEmailBtn) modalEmailBtn.href = mailtoUrl;

      // Open luxury confirmation modal
      openModal();
    });
  }

  const openModal = () => {
    contactModal?.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    contactModal?.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  modalCloseBtn?.addEventListener('click', closeModal);
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeModal();
    }
  });

  // When user clicks either action inside modal, reset form after brief moment
  modalWhatsappBtn?.addEventListener('click', () => {
    setTimeout(() => {
      contactForm?.reset();
      closeModal();
    }, 400);
  });

  modalEmailBtn?.addEventListener('click', () => {
    setTimeout(() => {
      contactForm?.reset();
      closeModal();
    }, 400);
  });

  // -------------------------------------------------------------------------
  // 7. Desktop Custom Cursor Animation
  // -------------------------------------------------------------------------
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isFinePointer && !prefersReducedMotion && cursorDot && cursorFollower) {
    let mouseX = -100;
    let mouseY = -100;
    let followerX = -100;
    let followerY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
      cursorDot.style.opacity = '1';
    });

    const animateCursor = () => {
      followerX += (mouseX - followerX) * 0.16;
      followerY += (mouseY - followerY) * 0.16;

      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      cursorFollower.style.opacity = '1';

      requestAnimationFrame(animateCursor);
    };

    requestAnimationFrame(animateCursor);

    // Expand cursor on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .project-card, .service-card, .tool-card');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursorFollower.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorFollower.classList.remove('is-hovering'));
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorFollower.style.opacity = '0';
    });
  }

  // -------------------------------------------------------------------------
  // 8. Smooth Scroll for all internal anchor links
  // -------------------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    });
  });

  console.log('DK MAVE Portfolio initialised successfully.');
});
