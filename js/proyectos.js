document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('proyectos-container');

    fetch('/proyectos.json')
        .then(response => response.json())
        .then(proyectos => {
            if (proyectos.length === 0) {
                container.innerHTML = '<p>No hay proyectos para mostrar en este momento.</p>';
                return;
            }

            proyectos.reverse().forEach(proyecto => {
                const proyectoCard = document.createElement('div');
                proyectoCard.className = 'proyecto-card-full';

                const projectDate = new Date(proyecto.date);
                const formattedDate = projectDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                proyectoCard.innerHTML = `
                    <img src="${proyecto.image_url}" alt="Imagen del proyecto ${proyecto.title}" loading="lazy">
                    <div class="proyecto-contenido">
                        <h3>${proyecto.title}</h3>
                        <p>${proyecto.description}</p>
                        <div class="proyecto-datos">
                            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                            ${proyecto.members ? `<span><i class="fas fa-users"></i> ${proyecto.members}</span>` : ''}
                        </div>
                        ${proyecto.external_link ? `<a href="${proyecto.external_link}" target="_blank" class="btn-secondary" style="margin-top: 15px;">Ver más</a>` : ''}
                    </div>
                `;
                container.appendChild(proyectoCard);
            });
        })
        .catch(error => {
            console.error('Error al cargar los proyectos:', error);
            container.innerHTML = '<p>Hubo un error al cargar los proyectos. Por favor, inténtalo de nuevo más tarde.</p>';
        });
});