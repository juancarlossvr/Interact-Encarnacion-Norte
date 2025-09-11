document.addEventListener('DOMContentLoaded', () => {
    const ADMIN_USER = "juanka";
    const ADMIN_PASS = "webos2025"; 

    let currentTab = 'proyectos';
    let data = {
        proyectos: [],
        eventos: []
    };

    const loginView = document.getElementById('login-view');
    const panelView = document.getElementById('panel-view');
    const authForm = document.getElementById('auth-form');
    const logoutBtn = document.getElementById('logout-btn');
    const itemsList = document.getElementById('items-list');
    const generateBtn = document.getElementById('generate-file-btn');
    
    const proyectosForm = document.getElementById('proyectos-form');
    const eventosForm = document.getElementById('eventos-form');
    
    const proyectoCancelBtn = document.getElementById('proyecto-cancel-edit');
    const eventoCancelBtn = document.getElementById('evento-cancel-edit');

    function checkAuth() {
        if (sessionStorage.getItem('isAdmin') === 'true') {
            loginView.classList.add('hidden');
            panelView.classList.remove('hidden');
            loadInitialData();
        } else {
            loginView.classList.remove('hidden');
            panelView.classList.add('hidden');
        }
    }

    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username === ADMIN_USER && password === ADMIN_PASS) {
            sessionStorage.setItem('isAdmin', 'true');
            checkAuth();
        } else {
            document.getElementById('login-error').textContent = 'Usuario o contraseña incorrectos.';
        }
    });

    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('isAdmin');
        checkAuth();
    });

    window.changeTab = (tabName) => {
        currentTab = tabName;
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-button[onclick="changeTab('${tabName}')"]`).classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-content`).classList.add('active');
        renderList();
    };

    async function loadInitialData() {
        try {
            const [proyectosRes, eventosRes] = await Promise.all([
                fetch('/data/proyectos.json'),
                fetch('/data/eventos.json')
            ]);
            data.proyectos = await proyectosRes.json();
            data.eventos = await eventosRes.json();
            renderList();
        } catch (error) {
            console.error("Error al cargar los archivos JSON:", error);
            alert("No se pudieron cargar los datos iniciales. Revisa la consola.");
        }
    }

    function renderList() {
        itemsList.innerHTML = '';
        const items = data[currentTab] || [];
        items.slice().reverse().forEach(item => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.innerHTML = `
                <span class="list-item-title">${item.title}</span>
                <div class="list-item-actions">
                    <button class="secondary" onclick="editItem(${item.id})">Editar</button>
                    <button class="danger" onclick="deleteItem(${item.id})">Eliminar</button>
                </div>
            `;
            itemsList.appendChild(listItem);
        });
    }
    

    const imageInput = document.getElementById('proyecto-imagenes');
    const previewContainer = document.getElementById('imagenes-preview');
    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', () => {
            previewContainer.innerHTML = '';
            if (imageInput.files.length > 0) {
                const title = document.createElement('p');
                title.style.fontWeight = 'bold';
                title.textContent = 'Archivos seleccionados:';
                previewContainer.appendChild(title);
                const list = document.createElement('ul');
                Array.from(imageInput.files).forEach(file => {
                    const listItem = document.createElement('li');
                    listItem.textContent = file.name;
                    list.appendChild(listItem);
                });
                previewContainer.appendChild(list);
            }
        });
    }

    async function handleProjectSubmit(e) {
        e.preventDefault();

        const files = document.getElementById('proyecto-imagenes').files;
        const imageURLs = [];
        
        const isEditing = !!document.getElementById('proyecto-id').value;
        if (isEditing && files.length === 0) {
             alert("Funcionalidad de edición sin subir nuevas fotos aún no implementada. Debes seleccionar las imágenes de nuevo por ahora.");
             return; 
        }

        if (!isEditing && files.length === 0) {
            alert("Debes seleccionar al menos una imagen para el nuevo proyecto.");
            return;
        }

        const submitButton = proyectosForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Subiendo imágenes...';
        submitButton.disabled = true;

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('projectImage', file);
                const response = await fetch('http://localhost:3000/upload', {
                    method: 'POST',
                    body: formData,
                });
                if (!response.ok) throw new Error(`Error al subir la imagen: ${file.name}`);
                const result = await response.json();
                imageURLs.push(result.imageUrl);
            }

            const proyecto = {
                id: isEditing ? parseInt(document.getElementById('proyecto-id').value) : Date.now(),
                title: document.getElementById('proyecto-title').value,
                date: document.getElementById('proyecto-date').value,
                description: document.getElementById('proyecto-description').value,
                members: document.getElementById('proyecto-members').value,
                external_link: document.getElementById('proyecto-external_link').value,
                imagenes: imageURLs 
            };

            const existingIndex = data.proyectos.findIndex(p => p.id === proyecto.id);
            if (existingIndex > -1) {
                data.proyectos[existingIndex] = proyecto;
            } else {
                data.proyectos.push(proyecto);
            }

            proyectosForm.reset();
            previewContainer.innerHTML = '';
            document.getElementById('proyecto-id').value = '';
            proyectoCancelBtn.classList.add('hidden');
            renderList();
            alert('Proyecto guardado. No olvides generar el archivo JSON para publicar los cambios.');

        } catch (error) {
            console.error('Error en el proceso de guardado:', error);
            alert('Hubo un error al subir las imágenes. Revisa la consola y asegúrate de que el servidor (server.js) esté corriendo.');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }

    function handleEventSubmit(e) {
        e.preventDefault();
        const id = document.getElementById('evento-id').value;
        const event = {
            title: document.getElementById('evento-title').value,
            date: document.getElementById('evento-date').value,
            time: document.getElementById('evento-time').value,
            place: document.getElementById('evento-place').value,
            description: document.getElementById('evento-description').value,
        };
        if (id) {
            const index = data.eventos.findIndex(ev => ev.id == id);
            data.eventos[index] = { ...data.eventos[index], id: parseInt(id), ...event };
        } else { 
            event.id = Date.now();
            data.eventos.push(event);
        }
        eventosForm.reset();
        document.getElementById('evento-id').value = '';
        eventoCancelBtn.classList.add('hidden');
        renderList();
        alert('Evento guardado. No olvides generar y descargar el archivo.');
    }

    window.editItem = (id) => {
        const item = data[currentTab].find(i => i.id === id);
        if (!item) return;

        if (currentTab === 'proyectos') {
            document.getElementById('proyecto-id').value = item.id;
            document.getElementById('proyecto-title').value = item.title;
            document.getElementById('proyecto-date').value = item.date;
            document.getElementById('proyecto-description').value = item.description;
            document.getElementById('proyecto-members').value = item.members;
            document.getElementById('proyecto-external_link').value = item.external_link;
            previewContainer.innerHTML = `<p style="color: #D4AF37;"><b>Editando:</b> Vuelve a seleccionar las imágenes para este proyecto.</p>`;
            proyectoCancelBtn.classList.remove('hidden');
        } else if (currentTab === 'calendario') {
            document.getElementById('evento-id').value = item.id;
            document.getElementById('evento-title').value = item.title;
            document.getElementById('evento-date').value = item.date;
            document.getElementById('evento-time').value = item.time;
            document.getElementById('evento-place').value = item.place;
            document.getElementById('evento-description').value = item.description;
            eventoCancelBtn.classList.remove('hidden');
        }
        window.scrollTo(0, 0);
    };

    window.deleteItem = (id) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este elemento?')) return;
        data[currentTab] = data[currentTab].filter(item => item.id !== id);
        renderList();
        alert('Elemento eliminado. No olvides generar y descargar el archivo.');
    };

    proyectosForm.addEventListener('submit', handleProjectSubmit);
    eventosForm.addEventListener('submit', handleEventSubmit);

    proyectoCancelBtn.addEventListener('click', () => {
        proyectosForm.reset();
        document.getElementById('proyecto-id').value = '';
        previewContainer.innerHTML = '';
        proyectoCancelBtn.classList.add('hidden');
    });

    eventoCancelBtn.addEventListener('click', () => {
        eventosForm.reset();
        document.getElementById('evento-id').value = '';
        eventoCancelBtn.classList.add('hidden');
    });
    
    generateBtn.addEventListener('click', () => {
        if (data[currentTab].length === 0) {
            alert(`No hay ${currentTab} para generar.`);
            return;
        }
        const filename = currentTab === 'proyectos' ? 'proyectos.json' : 'eventos.json';
        const content = JSON.stringify(data[currentTab], null, 2);
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        alert(`¡Archivo "${filename}" generado!\n\nAhora debes subirlo a la carpeta "/data/" de tu sitio web para publicar los cambios.`);
    });

    checkAuth();
});