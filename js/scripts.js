
window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio_anthony items
    new SimpleLightbox({
        elements: '#portfolio_anthony a.portfolio_anthony-box',
        close: true,
        closeText: '×',
        history: false
    });

    // Lightbox pour le CV (avec bouton de fermeture)
    const cvLightbox = new SimpleLightbox({
        elements: '.cv-lightbox',
        close: true,
        closeText: '×',
        history: false,
        captions: false,
        animationSpeed: 200
    });
    document.querySelectorAll('.cv-lightbox').forEach((a) => {
        a.addEventListener('click', (ev) => {
            // si la lightbox ne s'ouvre pas, empêcher la navigation et forcer l'ouverture
            setTimeout(() => {
                if (!document.querySelector('.sl-wrapper')) {
                    ev.preventDefault();
                    cvLightbox.open(a);
                }
            }, 0);
        });
    });

    // Dynamic age calculation
    const ageElement = document.getElementById('age');
    if (ageElement) {
        const today = new Date();
        const birthDate = new Date(2000, 6, 26); // 26 juillet 2000 (mois 0-indexé)
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        ageElement.textContent = String(age);
    }

    // Theme toggle (light/dark)
    const root = document.documentElement;
    const bodyEl = document.body;
    const themeToggleBtn = document.getElementById('themeToggle');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        if (bodyEl) bodyEl.setAttribute('data-theme', theme);
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = theme === 'dark'
                ? '<i class="bi bi-sun"></i>'
                : '<i class="bi bi-moon-stars"></i>';
        }
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        applyTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
    }

    const handleThemeToggle = () => {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
    };
    if (themeToggleBtn) themeToggleBtn.addEventListener('click', handleThemeToggle);
    // Fallback: délégation (si le bouton est re-généré)
    document.addEventListener('click', (e) => {
        const t = e.target;
        if (t && (t.id === 'themeToggle' || (t.closest && t.closest('#themeToggle')))) {
            e.preventDefault();
            handleThemeToggle();
        }
    });

    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            disable: function() {
                return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }

    // Reveal on scroll animations (sections & portfolio items)
    const revealElements = [
        ...document.querySelectorAll('.page-section'),
        ...document.querySelectorAll('#portfolio_anthony .portfolio_anthony-item')
    ];
    revealElements.forEach(el => el.classList.add('reveal'));

    const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 }) : null;

    if (io) {
        revealElements.forEach(el => io.observe(el));
    } else {
        // Fallback: tout rendre visible sans animation
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillValue = entry.target.getAttribute('data-skill');
                if (skillValue) {
                    entry.target.style.width = skillValue + '%';
                }
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }) : null;

    if (skillObserver) {
        skillBars.forEach(bar => {
            bar.style.width = '0%';
            skillObserver.observe(bar);
        });
    } else {
        // Fallback: afficher les barres sans animation
        skillBars.forEach(bar => {
            const skillValue = bar.getAttribute('data-skill');
            if (skillValue) {
                bar.style.width = skillValue + '%';
            }
        });
    }

    // Set current year in footer
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Parallax effect for hero section (desktop only)
    const masthead = document.querySelector('.masthead');
    if (masthead && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop < window.innerHeight) {
                const parallaxValue = scrollTop * 0.5;
                masthead.style.transform = `translateY(${parallaxValue}px)`;
            }
        }, { passive: true });
    }

    // Hide scroll indicator when scrolling
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
                scrollIndicator.style.transition = 'opacity 0.3s ease';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        }, { passive: true });
    }

    // Form validation enhancement
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('is-invalid');
                } else {
                    input.classList.remove('is-invalid');
                }
            });

            // Email validation
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value)) {
                    isValid = false;
                    emailInput.classList.add('is-invalid');
                }
            }

            if (!isValid) {
                e.preventDefault();
                // Show error message
                const errorDiv = document.getElementById('submitErrorMessage');
                if (errorDiv) {
                    errorDiv.classList.remove('d-none');
                    setTimeout(() => {
                        errorDiv.classList.add('d-none');
                    }, 5000);
                }
            }
        });

        // Remove invalid class on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
            });
        });
    }

    // Add loading state to submit button
    const submitButton = document.getElementById('submit');
    if (submitButton && contactForm) {
        contactForm.addEventListener('submit', function() {
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Envoi en cours...';
        });
    }

    // Cursor effect for interactive elements (optional enhancement)
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
});
