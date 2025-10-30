
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
        elements: '#portfolio_anthony a.portfolio_anthony-box'
    });

    // Lightbox pour le CV (avec bouton de fermeture par défaut)
    new SimpleLightbox({
        elements: '#cv a.cv-lightbox'
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
    const themeToggleBtn = document.getElementById('themeToggle');

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
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

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
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
});
