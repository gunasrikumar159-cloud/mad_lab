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
      preloader.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    }, 600);
  }

  // --- 2. NAVBAR SCROLL EFFECT ---
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- 3. MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking outside or on a link
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });

    const mobileLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // --- 4. ACTIVE NAV LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

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

  window.addEventListener('scroll', highlightNavOnScroll);

  // --- 5. CONTACT FORM HANDLING ---
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        if (formStatus) {
          formStatus.style.display = 'block';
          formStatus.innerHTML = '<div style="background: rgba(0, 206, 168, 0.15); border: 1px solid #00cea8; color: #00cea8; padding: 0.8rem; border-radius: 0.5rem; margin-top: 1rem; font-weight: 600;">Thank you! Your message has been sent successfully. I will get back to you shortly.</div>';
          contactForm.reset();
          setTimeout(() => {
            formStatus.style.display = 'none';
          }, 6000);
        }
      }, 1000);
    });
  }

  // --- 6. RESUME DOWNLOAD EVENT HANDLER ---
  const resumeBtns = document.querySelectorAll('.btn-resume-download');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // PDF download link
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

