document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.querySelector('.menu-toggle');
    const menuPrincipal = document.querySelector('.menu-principal');

    if (menuToggle && menuPrincipal) {
        menuToggle.addEventListener('click', () => {
            menuPrincipal.classList.toggle('active');
            const isExpanded = menuPrincipal.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }

    function validateForm() {
        let isValid = true;
        return isValid;
    }

    const themeToggle = document.getElementById('theme-toggle');

    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');

        const applyTheme = (theme) => {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            } else {
                document.body.classList.remove('dark-mode');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        };

        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    const iniciarAnimaciones = () => {
        if (typeof ScrollReveal === 'undefined') {
            console.error('La librería ScrollReveal no está cargada.');
            return;
        }

        const sr = ScrollReveal({
            distance: '60px',
            duration: 2000,
            delay: 200,
            reset: false
        });

        sr.reveal('.section-title, .section-subtitle', { origin: 'top' });
        sr.reveal('#hero h1', { delay: 400, origin: 'left' });
        sr.reveal('#hero p', { delay: 500, origin: 'right' });
        sr.reveal('#hero .btn-primary', { delay: 600, origin: 'bottom' });
        sr.reveal('.convocatoria-texto', { origin: 'left' });
        sr.reveal('.convocatoria-contador', { origin: 'right' });
        sr.reveal('.card-proyecto, .testimonio-card, .miembro-card, .paso-card, .prueba-item', {
            interval: 150,
            origin: 'bottom'
        });
        sr.reveal('.info-box', { origin: 'left' });
        sr.reveal('.form-box', { origin: 'right' });
    };

    iniciarAnimaciones();

    const requisitosToggle = document.getElementById('requisitos-toggle');
    const requisitosOficiales = document.getElementById('requisitos-oficiales');

    if (requisitosToggle && requisitosOficiales) {
        requisitosToggle.addEventListener('click', () => {
            const isVisible = requisitosOficiales.style.display === 'block';
            requisitosOficiales.style.display = isVisible ? 'none' : 'block';
            requisitosToggle.querySelector('i').classList.toggle('fa-chevron-down');
            requisitosToggle.querySelector('i').classList.toggle('fa-chevron-up');
        });
    }

    const iniciarCountdownInterpromo = () => {
        const target = new Date('2026-06-05T08:00:00');
        const cdDias  = document.getElementById('cd-dias');
        const cdHoras = document.getElementById('cd-horas');
        const cdMin   = document.getElementById('cd-min');
        const cdSeg   = document.getElementById('cd-seg');

        if (!cdDias) return;

        const tick = () => {
            const diff = target - new Date();
            if (diff <= 0) {
                document.getElementById('interpromo-countdown').innerHTML =
                    '<p style="font-weight:700;color:var(--rotary-gold)">¡El evento ya comenzó! 🔥</p>';
                return;
            }
            const d = Math.floor(diff / 86400000);
            const h = Math.floor((diff % 86400000) / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);

            cdDias.textContent  = String(d).padStart(2, '0');
            cdHoras.textContent = String(h).padStart(2, '0');
            cdMin.textContent   = String(m).padStart(2, '0');
            cdSeg.textContent   = String(s).padStart(2, '0');
        };

        tick();
        setInterval(tick, 1000);
    };

    iniciarCountdownInterpromo();

});

function inicializarCarruseles() {
    const carousels = document.querySelectorAll('.proyecto-carousel');

    carousels.forEach(carousel => {
        const slidesContainer = carousel.querySelector('.carousel-slides');
        const prevBtn = carousel.querySelector('.prev-btn');
        const nextBtn = carousel.querySelector('.next-btn');

        if (!slidesContainer || !prevBtn || !nextBtn) return;

        const slides = Array.from(slidesContainer.children);
        const totalSlides = slides.length;
        let currentIndex = 0;

        function mostrarSlide(index) {
            slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalSlides - 1 : currentIndex - 1;
            mostrarSlide(currentIndex);
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalSlides - 1) ? 0 : currentIndex + 1;
            mostrarSlide(currentIndex);
        });

        mostrarSlide(currentIndex);
    });
}