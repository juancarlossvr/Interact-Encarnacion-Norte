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

    const iniciarContador = () => {
        const fechaLimite = new Date('September 13, 2025 17:00:00').getTime();
        
        const diasEl = document.getElementById('dias');
        const horasEl = document.getElementById('horas');
        const minutosEl = document.getElementById('minutos');
        const segundosEl = document.getElementById('segundos');

        if (!diasEl) return; 

        const intervalo = setInterval(() => {
            const ahora = new Date().getTime();
            const distancia = fechaLimite - ahora;

            if (distancia < 0) {
                clearInterval(intervalo);
                document.getElementById('countdown-timer').innerHTML = "<h4>¡El plazo ha terminado!</h4>";
                return;
            }

            const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

            diasEl.innerText = dias < 10 ? '0' + dias : dias;
            horasEl.innerText = horas < 10 ? '0' + horas : horas;
            minutosEl.innerText = minutos < 10 ? '0' + minutos : minutos;
            segundosEl.innerText = segundos < 10 ? '0' + segundos : segundos;

        }, 1000);
    };

    iniciarContador(); 


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
}); 