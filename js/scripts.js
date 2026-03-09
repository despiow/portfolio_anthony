/* ═══════════════════════════════════════════════════
   PORTFOLIO — ANTHONY JARDY — Scripts 2026
   Vanilla JS, zéro dépendance externe
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll progress bar ── */
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    document.body.prepend(progressBar);
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        progressBar.style.width = pct + '%';
    }, { passive: true });


    /* ── Navbar : shrink + active link ── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    const updateNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);

        // Active link via IntersectionObserver
    };
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    // Active nav via scroll position
    const observeNav = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => observeNav.observe(s));


    /* ── Menu mobile ── */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu    = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        menuToggle.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
    });

    // Fermer au clic sur un lien
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });


    /* ── Thème dark / light ── */
    const themeBtn = document.getElementById('themeToggle');
    const root     = document.documentElement;

    const setTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeBtn.innerHTML = theme === 'dark'
            ? '<i class="bi bi-sun"></i>'
            : '<i class="bi bi-moon-stars"></i>';
    };

    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
    } else {
        setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    themeBtn.addEventListener('click', () => {
        setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });


    /* ── Typed effect (hero) ── */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const words = ['Web', 'Front-End', 'PHP', 'créatif'];
        let wi = 0, ci = 0, deleting = false;
        const type = () => {
            const word = words[wi];
            typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
            let delay = deleting ? 60 : 110;
            if (!deleting && ci > word.length)  { deleting = true; delay = 1400; }
            if (deleting  && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
            setTimeout(type, delay);
        };
        setTimeout(type, 600);
    }


    /* ── Âge dynamique ── */
    const ageEl = document.getElementById('age');
    if (ageEl) {
        const birth = new Date(2000, 6, 26);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        ageEl.textContent = age;
    }


    /* ── Année footer ── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ── Reveal on scroll ── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObs.observe(el));


    /* ── Skill bars animées ── */
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const w = entry.target.getAttribute('data-w');
                if (w) entry.target.style.width = w + '%';
                skillObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    skillFills.forEach(b => skillObs.observe(b));


    /* ── Lightbox projets ── */
    if (typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox({ elements: '.lightbox-link', close: true, closeText: '×', history: false });
        new SimpleLightbox({ elements: '.lightbox-cv',   close: true, closeText: '×', history: false, captions: false });
    }


    /* ── Formulaire de contact (AJAX) ── */
    const form        = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');
    const submitLabel = document.getElementById('submitLabel');
    const submitIcon  = document.getElementById('submitIcon');
    const formSuccess = document.getElementById('formSuccess');
    const formError   = document.getElementById('formError');
    const successText = document.getElementById('successText');
    const errorText   = document.getElementById('errorText');

    if (form) {
        const validate = () => {
            let ok = true;
            form.querySelectorAll('[required]').forEach(field => {
                const group = field.closest('.form-group');
                const empty = !field.value.trim();
                const emailBad = field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
                const invalid = empty || emailBad;
                group.classList.toggle('has-error', invalid);
                field.classList.toggle('invalid', invalid);
                if (invalid) ok = false;
            });
            return ok;
        };

        // Effacer erreur en temps réel
        form.querySelectorAll('input, textarea').forEach(f => {
            f.addEventListener('input', () => {
                f.closest('.form-group').classList.remove('has-error');
                f.classList.remove('invalid');
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formSuccess.hidden = true;
            formError.hidden   = true;
            if (!validate()) return;

            submitBtn.disabled  = true;
            submitLabel.textContent = 'Envoi en cours…';
            submitIcon.className = 'bi bi-hourglass-split';

            try {
                const res  = await fetch('./src/send_email.php', { method: 'POST', body: new FormData(form) });
                const data = await res.json();

                if (data.success) {
                    successText.textContent = data.message;
                    formSuccess.hidden = false;
                    form.reset();
                    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    setTimeout(() => { formSuccess.hidden = true; }, 10000);
                } else {
                    errorText.textContent = data.message || 'Une erreur est survenue.';
                    formError.hidden = false;
                    formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } catch {
                errorText.textContent = 'Erreur réseau. Vérifiez votre connexion et réessayez.';
                formError.hidden = false;
            } finally {
                submitBtn.disabled  = false;
                submitLabel.textContent = 'Envoyer le message';
                submitIcon.className = 'bi bi-send';
            }
        });
    }

});
