/* ==========================================================================
   GUNASRI A - MAIN INTERACTION SCRIPT
   Navbar Toggling, Smooth Scroll, Contact Form Handling, Active Sections
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. PRELOADER FADEOUT ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.transition = 'opacity 0.4s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 400);
    }, 400);
  }

  // --- 2. NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // --- 3. MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
  }

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileClose) {
      mobileClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('.nav-link, .mobile-social-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }

  // --- 4. ACTIVE NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.desktop-menu .nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 140;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  // --- 5. CONTACT FORM HANDLING ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');

      const nameVal = nameInput ? nameInput.value.trim() : '';
      const emailVal = emailInput ? emailInput.value.trim() : '';
      const messageVal = messageInput ? messageInput.value.trim() : '';

      if (!nameVal || !emailVal || !messageVal) {
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = '<div style="background: rgba(244, 67, 54, 0.15); border: 1px solid #f44336; color: #f44336; padding: 0.8rem; border-radius: 0.5rem; margin-top: 1rem; font-weight: 600;">Please fill in all required fields.</div>';
        }
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = '<div style="background: rgba(0, 206, 168, 0.15); border: 1px solid #00cea8; color: #00cea8; padding: 0.8rem; border-radius: 0.5rem; margin-top: 1rem; font-weight: 600; line-height: 1.5;">Thank you, ' + escapeHtml(nameVal) + '! Your message has been received. I will get back to you shortly.</div>';
          contactForm.reset();
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 6000);
        }
      }, 800);
    });
  }

  function escapeHtml(string) {
    const div = document.createElement('div');
    div.innerText = string;
    return div.innerHTML;
  }

  // --- 6. RESUME DOWNLOAD EVENT HANDLER ---
  const resumeBtns = document.querySelectorAll('.btn-resume-download');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.href = 'Gunasri_A_Resume.pdf';
      link.download = 'Gunasri_A_Resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  });
});
