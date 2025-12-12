
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

    // Form validation and AJAX submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        const submitButton = document.getElementById('submit');
        const submitButtonText = document.getElementById('submitButtonText');
        const submitButtonIcon = document.getElementById('submitButtonIcon');
        const successMessage = document.getElementById('submitSuccessMessage');
        const errorMessage = document.getElementById('submitErrorMessage');
        const successMessageText = document.getElementById('successMessageText');
        const errorMessageText = document.getElementById('errorMessageText');

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Empêcher la soumission classique

            // Validation côté client
            const inputs = this.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            // Réinitialiser les messages
            successMessage.classList.add('d-none');
            errorMessage.classList.add('d-none');

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
                errorMessageText.textContent = 'Veuillez remplir tous les champs correctement.';
                errorMessage.classList.remove('d-none');
                // Scroll to error message
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }

            // Désactiver le bouton et afficher le chargement
            if (submitButton) {
                submitButton.disabled = true;
                if (submitButtonText) submitButtonText.textContent = 'Envoi en cours...';
                if (submitButtonIcon) {
                    submitButtonIcon.className = 'spinner-border spinner-border-sm ms-2';
                }
            }

            // Préparer les données du formulaire
            const formData = new FormData(this);

            // Envoyer la requête AJAX
            fetch('./src/send_email.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Succès
                    successMessageText.textContent = data.message;
                    successMessage.classList.remove('d-none');
                    contactForm.reset();
                    
                    // Scroll to success message
                    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Réactiver le bouton
                    if (submitButton) {
                        submitButton.disabled = false;
                        if (submitButtonText) submitButtonText.textContent = 'Envoyer le message';
                        if (submitButtonIcon) {
                            submitButtonIcon.className = 'bi bi-send ms-2';
                        }
                    }

                    // Masquer le message après 5 secondes
                    setTimeout(() => {
                        successMessage.classList.add('d-none');
                    }, 10000);
                } else {
                    // Erreur
                    errorMessageText.textContent = data.message || 'Une erreur est survenue. Veuillez réessayer.';
                    errorMessage.classList.remove('d-none');
                    
                    // Scroll to error message
                    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Réactiver le bouton
                    if (submitButton) {
                        submitButton.disabled = false;
                        if (submitButtonText) submitButtonText.textContent = 'Envoyer le message';
                        if (submitButtonIcon) {
                            submitButtonIcon.className = 'bi bi-send ms-2';
                        }
                    }

                    // Masquer le message après 5 secondes
                    setTimeout(() => {
                        errorMessage.classList.add('d-none');
                    }, 10000);
                }
            })
            .catch(error => {
                // Erreur réseau
                errorMessageText.textContent = 'Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.';
                errorMessage.classList.remove('d-none');
                
                // Scroll to error message
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Réactiver le bouton
                if (submitButton) {
                    submitButton.disabled = false;
                    if (submitButtonText) submitButtonText.textContent = 'Envoyer le message';
                    if (submitButtonIcon) {
                        submitButtonIcon.className = 'bi bi-send ms-2';
                    }
                }
            });
        });

        // Remove invalid class on input
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    this.classList.remove('is-invalid');
                }
                // Masquer les messages d'erreur quand l'utilisateur tape
                if (errorMessage && !errorMessage.classList.contains('d-none')) {
                    errorMessage.classList.add('d-none');
                }
            });
        });
    }

    // Cursor effect for interactive elements (optional enhancement)
    const interactiveElements = document.querySelectorAll('a, button, .btn');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });

    // Handle image loading errors and retry with cache busting
    const portfolioImages = document.querySelectorAll('#portfolio_anthony img');
    portfolioImages.forEach(img => {
        img.addEventListener('error', function() {
            // If image fails to load, try reloading with timestamp
            const src = this.src.split('?')[0];
            this.src = src + '?t=' + Date.now();
        });
    });
});
