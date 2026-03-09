/* ═══════════════════════════════════════════
   ANTHONY JARDY — Portfolio Scripts
   Vanilla JS — zéro dépendance externe
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Scroll progress bar ── */
    const progressBar = document.getElementById('scrollProgress');
    window.addEventListener('scroll', () => {
        const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
        progressBar.style.width = pct + '%';
    }, { passive: true });


    /* ── Navbar : fond au scroll + lien actif ── */
    const navbar   = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            navLinks.forEach(l => l.classList.remove('active'));
            const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
            if (link) link.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => navObserver.observe(s));


    /* ── Menu mobile ── */
    const menuToggle = document.getElementById('menuToggle');
    const navMenu    = document.getElementById('navMenu');

    menuToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        menuToggle.classList.toggle('active', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });


    /* ── Thème dark / light ── */
    const themeBtn  = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const root      = document.documentElement;

    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeIcon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    };

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
    } else {
        applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    themeBtn.addEventListener('click', () => {
        applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });


    /* ── Typed effect (hero) ── */
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const words = ['Web', 'Front-End', 'PHP', 'créatif'];
        let wi = 0, ci = 0, deleting = false;
        const tick = () => {
            const word = words[wi];
            typedEl.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
            let delay = deleting ? 65 : 110;
            if (!deleting && ci > word.length)  { deleting = true; delay = 1600; }
            if (deleting  && ci < 0)            { deleting = false; wi = (wi + 1) % words.length; delay = 400; }
            setTimeout(tick, delay);
        };
        setTimeout(tick, 800);
    }


    /* ── Âge dynamique ── */
    const ageEl = document.getElementById('age');
    if (ageEl) {
        const birth = new Date(2000, 6, 26); // 26 juillet 2000
        const now   = new Date();
        let age     = now.getFullYear() - birth.getFullYear();
        const m     = now.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
        ageEl.textContent = age;
    }


    /* ── Année footer ── */
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();


    /* ── Reveal on scroll ── */
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


    /* ── Skill bars animées ── */
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const w = entry.target.getAttribute('data-w');
            if (w) entry.target.style.width = w + '%';
            skillObs.unobserve(entry.target);
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-bar[data-w]').forEach(bar => skillObs.observe(bar));


    /* ── Lightbox ── */
    if (typeof SimpleLightbox !== 'undefined') {
        new SimpleLightbox({ elements: '.lightbox-link', closeText: '×', history: false });
        new SimpleLightbox({ elements: '.lightbox-cv',   closeText: '×', history: false, captions: false });
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

    if (!form) return;

    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const setFieldError = (field, hasError) => {
        field.closest('.form-group').classList.toggle('error', hasError);
    };

    const validate = () => {
        let valid = true;
        form.querySelectorAll('[required]').forEach(field => {
            const empty    = !field.value.trim();
            const badEmail = field.type === 'email' && field.value.trim() && !EMAIL_RE.test(field.value.trim());
            const err      = empty || badEmail;
            setFieldError(field, err);
            if (err) valid = false;
        });
        return valid;
    };

    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('input', () => setFieldError(field, false));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formSuccess.hidden = true;
        formError.hidden   = true;
        if (!validate()) return;

        submitBtn.disabled      = true;
        submitLabel.textContent = 'Envoi en cours…';
        submitIcon.className    = 'bi bi-hourglass-split';

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
            submitBtn.disabled      = false;
            submitLabel.textContent = 'Envoyer le message';
            submitIcon.className    = 'bi bi-send';
        }
    });

});
