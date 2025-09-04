document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA PARA EL MENÚ MÓVIL (HAMBURGUESA) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const menuPrincipal = document.querySelector('.menu-principal');

    if (menuToggle && menuPrincipal) {
        menuToggle.addEventListener('click', () => {
            menuPrincipal.classList.toggle('active');
            const isExpanded = menuPrincipal.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    // --- LÓGICA MEJORADA PARA EL FORMULARIO DE CONTACTO ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Si el action del form es para Formspree, dejamos que se envíe.
            // La validación la hacemos para evitar envíos vacíos.
            if (!validateForm()) {
                event.preventDefault(); // Detener el envío SOLO si la validación falla
            }
        });
    }

    function validateForm() {
        let isValid = true;
        clearErrors();

        const nombre = document.getElementById('nombre');
        if (nombre && nombre.value.trim() === '') {
            showError('nombre', 'Por favor, ingresa tu nombre.');
            isValid = false;
        }

        const email = document.getElementById('email');
        if (email && email.value.trim() === '') {
            showError('email', 'Por favor, ingresa tu correo electrónico.');
            isValid = false;
        } else if (email && !isValidEmail(email.value)) {
            showError('email', 'Por favor, ingresa un correo electrónico válido.');
            isValid = false;
        }

        const asunto = document.getElementById('asunto');
        if (asunto && asunto.value.trim() === '') {
            showError('asunto', 'Por favor, ingresa el asunto.');
            isValid = false;
        }

        const mensaje = document.getElementById('mensaje');
        if (mensaje && mensaje.value.trim() === '') {
            showError('mensaje', 'Por favor, ingresa tu mensaje.');
            isValid = false;
        }

        return isValid;
    }

    function showError(fieldId, message) {
        const errorField = document.getElementById(`${fieldId}-error`);
        if (errorField) {
            errorField.textContent = message;
        }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.textContent = '');
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- LÓGICA PARA EL MODO OSCURO (DARK MODE) ---
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
});

document.addEventListener('DOMContentLoaded', () => {
    

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
});