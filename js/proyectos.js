document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('proyectos-container');
    if (!container) {
        console.error("El contenedor #proyectos-container no fue encontrado.");
        return;
    }

    // La ruta correcta al archivo de datos es '/data/proyectos.json'
    fetch('/data/proyectos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo: ${response.statusText}`);
            }
            return response.json();
        })
        .then(proyectos => {
            if (!proyectos || proyectos.length === 0) {
                container.innerHTML = '<p>No hay proyectos para mostrar en este momento.</p>';
                return;
            }

            container.innerHTML = ''; // Limpiar por si acaso

            // Mostramos los proyectos del más nuevo al más viejo
            proyectos.reverse().forEach(proyecto => {
                const card = document.createElement('div');
                card.className = 'proyecto-card';

                // CORRECIÓN: Manejar tanto image_url (string) como imagenes (array)
                const imagenes = proyecto.imagenes || [proyecto.image_url];
                
                // Verificar que las imágenes existan y sean válidas
                const imagenesValidas = imagenes.filter(img => img && img !== '');
                
                card.innerHTML = `
                    <div class="proyecto-carousel">
                        <div class="carousel-slides">
                            ${imagenesValidas.length > 0 
                                ? imagenesValidas.map(img => `
                                    <img src="${img}" 
                                         alt="${proyecto.title}" 
                                         class="carousel-slide" 
                                         loading="lazy"
                                         onerror="this.style.display='none'; this.parentElement.parentElement.classList.add('no-image');">
                                  `).join('')
                                : '<div class="carousel-slide placeholder-slide"><i class="fas fa-image" style="font-size: 3rem; color: rgba(255,255,255,0.3);"></i></div>'
                            }
                        </div>
                        ${imagenesValidas.length > 1 ? `
                            <button class="carousel-btn prev-btn" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>
                            <button class="carousel-btn next-btn" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>
                        ` : ''}
                    </div>
                    <div class="proyecto-info">
                        <h3>${proyecto.title}</h3>
                        <p>${proyecto.description}</p>
                        ${proyecto.external_link ? `<a href="${proyecto.external_link}" target="_blank" rel="noopener noreferrer" class="btn-ver-mas">Ver más en Instagram</a>` : ''}
                    </div>
                `;
                container.appendChild(card);
            });

            // Se llama a la función que activa los carruseles
            if (typeof inicializarCarruseles === 'function') {
                inicializarCarruseles();
            }
        })
        .catch(error => {
            console.error('Error al cargar los proyectos:', error);
            container.innerHTML = '<p style="color: red;">Hubo un error al cargar los proyectos.</p>';
        });
});