// js/modules/seguimiento.js

const seguimientoModule = (() => {
    let moduleContainer = null;
    let currentProcessId = null; // Para el proceso que se está viendo/editando
    let currentModuleView = 'list'; // 'list' o 'detail'

    /**
     * Renderiza la interfaz de usuario principal del módulo de seguimiento.
     */
    function render() {
        if (!moduleContainer) {
            console.error('Seguimiento: moduleContainer es null o undefined en render(). El módulo no se inicializó correctamente.');
            return;
        }
        moduleContainer.innerHTML = ''; // Limpiar el contenido anterior

        if (currentModuleView === 'list') {
            renderProcessList(moduleContainer);
        } else if (currentModuleView === 'detail' && currentProcessId) {
            renderProcessDetail(moduleContainer, currentProcessId);
        } else {
            console.warn('Seguimiento: Vista no reconocida o ID de proceso faltante para detalle.');
            renderProcessList(moduleContainer); // Volver a la lista por defecto
        }
        setupEventListeners(); // Re-configurar listeners cada vez que se renderiza
    }

    /**
     * Renderiza la vista de lista de procesos.
     * @param {HTMLElement} container - El contenedor donde se renderizará la lista.
     */
    function renderProcessList(container) {
        if (!container) return; // Asegurar que el contenedor existe

        // Asegúrate de que appData está disponible
        if (typeof appData === 'undefined') {
            console.error('Seguimiento: appData no está definido. No se pueden cargar los procesos.');
            container.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles. Por favor, recarga la página.</p>';
            return;
        }

        const procesos = appData.getProcesos(); // Obtener todos los procesos

        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-primary">Listado de Procesos de Contratación</h2>
                <button class="btn btn-success" id="new-process-btn"><i class="bi bi-plus-circle me-2"></i>Nuevo Proceso</button>
            </div>

            <div class="input-group mb-3">
                <input type="text" class="form-control" id="search-input" placeholder="Buscar por ID o nombre...">
                <button class="btn btn-outline-secondary" type="button" id="clear-search-btn">X</button>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-striped">
                    <thead class="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre del Proceso</th>
                            <th>Estado</th>
                            <th>Tipo</th>
                            <th>Fecha Inicio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="seguimiento-processes-table-body">
                        </tbody>
                </table>
            </div>
        `;

        const tableBody = container.querySelector('#seguimiento-processes-table-body');
        const searchInput = container.querySelector('#search-input');
        const clearSearchBtn = container.querySelector('#clear-search-btn');

        // Función para filtrar y mostrar procesos
        const displayProcesses = (filterText = '') => {
            let filteredProcesses = procesos;
            if (filterText) {
                const lowerCaseFilter = filterText.toLowerCase();
                filteredProcesses = procesos.filter(p =>
                    (p.id && p.id.toLowerCase().includes(lowerCaseFilter)) ||
                    (p.nombre && p.nombre.toLowerCase().includes(lowerCaseFilter))
                );
            }

            if (tableBody) {
                tableBody.innerHTML = ''; // Limpiar la tabla antes de renderizar

                if (filteredProcesses.length === 0) {
                    console.log('Seguimiento: No hay procesos para mostrar.');
                    tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay procesos registrados o coinciden con la búsqueda.</td></tr>`;
                    return;
                }

                filteredProcesses.forEach(proceso => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${proceso.id || 'N/A'}</td>
                        <td>${proceso.nombre || 'N/A'}</td>
                        <td><span class="badge bg-${getBadgeClass(proceso.estado)}">${proceso.estado || 'N/A'}</span></td>
                        <td>${proceso.tipoContratacion || 'N/A'}</td>
                        <td>${proceso.fechaInicio || 'N/A'}</td>
                        <td>
                            <button class="btn btn-info btn-sm view-process-btn" data-id="${proceso.id}"><i class="bi bi-eye"></i> Ver</button>
                            <button class="btn btn-danger btn-sm delete-process-btn" data-id="${proceso.id}"><i class="bi bi-trash"></i> Eliminar</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        };

        // Renderizar procesos inicialmente
        displayProcesses();

        // Event listeners para la búsqueda
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                displayProcesses(e.target.value);
            });
        }
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    displayProcesses('');
                }
            });
        }
    }

    /**
     * Renderiza la vista de detalle de un proceso específico.
     * @param {HTMLElement} container - El contenedor donde se renderizará el detalle.
     * @param {string} id - El ID del proceso a mostrar.
     */
    function renderProcessDetail(container, id) {
        if (!container) return; // Asegurar que el contenedor existe

        // Asegúrate de que appData está disponible
        if (typeof appData === 'undefined') {
            console.error('Seguimiento: appData no está definido. No se pueden cargar los detalles del proceso.');
            container.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles. Por favor, recarga la página.</p>';
            return;
        }

        const proceso = appData.getProcess(id); // Obtener el proceso por ID

        if (!proceso) {
            container.innerHTML = `<p class="alert alert-warning">Proceso con ID "${id}" no encontrado.</p>`;
            return;
        }

        // Determinar el módulo actual del proceso para resaltar la pestaña
        const activeModule = proceso.currentModule || 'requerimiento';

        container.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-primary">Detalles del Proceso: ${proceso.nombre || 'Sin Nombre'}</h2>
                <button class="btn btn-secondary" id="back-to-list-btn"><i class="bi bi-arrow-left me-2"></i>Volver a la Lista</button>
            </div>

            <div class="card shadow-sm mb-4">
                <div class="card-header bg-info text-white">
                    <h5 class="mb-0">Información General</h5>
                </div>
                <div class="card-body">
                    <p><strong>ID:</strong> ${proceso.id || 'N/A'}</p>
                    <p><strong>Nombre:</strong> ${proceso.nombre || 'N/A'}</p>
                    <p><strong>Objeto de Contratación:</strong> ${proceso.tipoContratacion || 'N/A'}</p>
                    <p><strong>Estado:</strong> <span class="badge bg-${getBadgeClass(proceso.estado)}">${proceso.estado || 'N/A'}</span></p>
                    <p><strong>Fecha Inicio:</strong> ${proceso.fechaInicio || 'N/A'}</p>
                    <p><strong>Descripción:</strong> ${proceso.descripcion || 'N/A'}</p>
                </div>
            </div>

            <h3 class="mt-4 mb-3 text-secondary">Etapas del Proceso</h3>
            <ul class="nav nav-tabs" id="processTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${activeModule === 'requerimiento' ? 'active' : ''}" id="tab-requerimiento" data-bs-toggle="tab" data-bs-target="#content-requerimiento" type="button" role="tab" aria-controls="content-requerimiento" aria-selected="${activeModule === 'requerimiento'}">Requerimiento</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${activeModule === 'area_usuaria' ? 'active' : ''}" id="tab-area-usuaria" data-bs-toggle="tab" data-bs-target="#content-area-usuaria" type="button" role="tab" aria-controls="content-area-usuaria" aria-selected="${activeModule === 'area_usuaria'}">Área Usuaria</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${activeModule === 'segmentacion' ? 'active' : ''}" id="tab-segmentacion" data-bs-toggle="tab" data-bs-target="#content-segmentacion" type="button" role="tab" aria-controls="content-segmentacion" aria-selected="${activeModule === 'segmentacion'}">Segmentación</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${activeModule === 'costos' ? 'active' : ''}" id="tab-costos" data-bs-toggle="tab" data-bs-target="#content-costos" type="button" role="tab" aria-controls="content-costos" aria-selected="${activeModule === 'costos'}">Costos</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${activeModule === 'estrategia' ? 'active' : ''}" id="tab-estrategia" data-bs-toggle="tab" data-bs-target="#content-estrategia" type="button" role="tab" aria-controls="content-estrategia" aria-selected="${activeModule === 'estrategia'}">Estrategia</button>
                </li>
            </ul>
            <div class="tab-content" id="processTabContent">
                <div class="tab-pane fade ${activeModule === 'requerimiento' ? 'show active' : ''}" id="content-requerimiento" role="tabpanel" aria-labelledby="tab-requerimiento"></div>
                <div class="tab-pane fade ${activeModule === 'area_usuaria' ? 'show active' : ''}" id="content-area-usuaria" role="tabpanel" aria-labelledby="tab-area-usuaria"></div>
                <div class="tab-pane fade ${activeModule === 'segmentacion' ? 'show active' : ''}" id="content-segmentacion" role="tabpanel" aria-labelledby="tab-segmentacion"></div>
                <div class="tab-pane fade ${activeModule === 'costos' ? 'show active' : ''}" id="content-costos" role="tabpanel" aria-labelledby="tab-costos"></div>
                <div class="tab-pane fade ${activeModule === 'estrategia' ? 'show active' : ''}" id="content-estrategia" role="tabpanel" aria-labelledby="tab-estrategia"></div>
            </div>
        `;

        // Cargar el contenido del módulo inicial
        loadSubModule(activeModule, id);

        // Configurar listeners para las pestañas
        container.querySelectorAll('#processTabs .nav-link').forEach(tabButton => {
            tabButton.addEventListener('shown.bs.tab', function (event) {
                const targetId = event.target.dataset.bsTarget.replace('#content-', ''); // Obtener el nombre del módulo (ej. 'requerimiento')
                loadSubModule(targetId, id);
                // Actualizar el currentModule del proceso en los datos (persistir la última pestaña abierta)
                proceso.currentModule = targetId;
                appData.updateProcess(proceso); // Guardar el cambio
            });
        });
    }

    /**
     * Carga el contenido de un submódulo (pestaña) dentro del detalle del proceso.
     * @param {string} subModuleName - El nombre del submódulo (ej. 'requerimiento').
     * @param {string} procesoId - El ID del proceso actual.
     */
    function loadSubModule(subModuleName, procesoId) {
        const subModuleContainer = moduleContainer.querySelector(`#content-${subModuleName}`);
        if (!subModuleContainer) {
            console.error(`Seguimiento: Contenedor para submódulo '${subModuleName}' no encontrado.`);
            return;
        }

        // Mapeo de submódulos a objetos de módulo (debe coincidir con app.js modules)
        const subModulesMap = {
            'requerimiento': typeof requerimientoModule !== 'undefined' ? requerimientoModule : null,
            'area_usuaria': typeof areaUsuariaModule !== 'undefined' ? areaUsuariaModule : null,
            'segmentacion': typeof segmentacionModule !== 'undefined' ? segmentacionModule : null,
            'costos': typeof costosModule !== 'undefined' ? costosModule : null,
            'estrategia': typeof estrategiaModule !== 'undefined' ? estrategiaModule : null
        };

        const subModule = subModulesMap[subModuleName];

        if (subModule && typeof subModule.init === 'function') {
            console.log(`Seguimiento: Cargando submódulo: ${subModuleName} para proceso ${procesoId}`);
            // Limpiar y mostrar spinner
            subModuleContainer.innerHTML = '<div class="d-flex justify-content-center align-items-center" style="min-height: 200px;"><div class="spinner-border text-secondary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
            subModule.init(procesoId, subModuleContainer); // Pasar el ID del proceso y el contenedor específico
        } else {
            console.error(`Seguimiento: Submódulo '${subModuleName}' no encontrado o no tiene método 'init'.`);
            subModuleContainer.innerHTML = `<p class="alert alert-danger">Error: Submódulo '${subModuleName}' no disponible.</p>`;
        }
    }


    /**
     * Configura los event listeners para los elementos del módulo de seguimiento.
     */
    function setupEventListeners() {
        if (!moduleContainer) return; // Doble verificación

        // Botón "Nuevo Proceso" en la vista de lista
        const newProcessBtn = moduleContainer.querySelector('#new-process-btn');
        if (newProcessBtn) {
            newProcessBtn.addEventListener('click', () => {
                console.log('Seguimiento: Clic en Nuevo Proceso.');
                if (typeof appData !== 'undefined' && typeof appData.createProcess === 'function') {
                    const newProcess = appData.createProcess(); // Crea el proceso
                    currentProcessId = newProcess.id; // Establece el ID del nuevo proceso
                    currentModuleView = 'detail'; // Cambia a vista de detalle
                    render(); // Re-renderiza para mostrar el detalle del nuevo proceso
                } else {
                    console.error('Seguimiento: appData o appData.createProcess no están disponibles.');
                    alert('Hubo un error al iniciar un nuevo proceso.');
                }
            });
        }

        // Botones "Ver" proceso en la lista
        moduleContainer.querySelectorAll('.view-process-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log('Seguimiento: Clic en Ver Proceso para ID:', id);
                currentProcessId = id; // Guarda el ID del proceso
                currentModuleView = 'detail'; // Cambia a vista de detalle
                render(); // Re-renderiza para mostrar el detalle
            });
        });

        // Botones "Eliminar" proceso en la lista
        moduleContainer.querySelectorAll('.delete-process-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (confirm(`¿Estás seguro de que quieres eliminar el proceso ${id}?`)) {
                    console.log('Seguimiento: Eliminando proceso con ID:', id);
                    if (typeof appData !== 'undefined' && typeof appData.deleteProcess === 'function') {
                        appData.deleteProcess(id);
                        render(); // Re-renderiza la lista después de eliminar
                    } else {
                        console.error('Seguimiento: appData o appData.deleteProcess no están disponibles.');
                        alert('Hubo un error al eliminar el proceso.');
                    }
                }
            });
        });

        // Botón "Volver a la Lista" en la vista de detalle
        const backToListBtn = moduleContainer.querySelector('#back-to-list-btn');
        if (backToListBtn) {
            backToListBtn.addEventListener('click', () => {
                console.log('Seguimiento: Volviendo a la lista de procesos.');
                currentProcessId = null; // Limpiar el ID del proceso actual
                currentModuleView = 'list'; // Volver a la vista de lista
                render(); // Re-renderiza para mostrar la lista
            });
        }
    }

    // Helper para clases de badges (copiado de dashboard.js para consistencia visual)
    function getBadgeClass(estado) {
        switch (estado) {
            case 'En Planificación': return 'secondary';
            case 'En Ejecución': return 'warning';
            case 'Completado': return 'success';
            case 'Cancelado': return 'danger';
            case 'Pendiente': return 'info';
            default: return 'primary';
        }
    }

    /**
     * Método de inicialización del módulo de seguimiento.
     * Este es llamado por app.js para cargar el módulo.
     * @param {string|null} id - El ID del proceso a mostrar en detalle al iniciar el módulo.
     * @param {HTMLElement} containerElement - El elemento DOM donde el módulo debe renderizar su contenido.
     */
    return {
        init: (id, containerElement) => {
            moduleContainer = containerElement; // Asignar el contenedor proporcionado por app.js
            currentProcessId = id; // Establecer el ID si se proporciona
            currentModuleView = id ? 'detail' : 'list'; // Si hay ID, ir a detalle; si no, a lista

            console.log(`Seguimiento: init() llamado. ID: ${id}, ContainerElement:`, containerElement);
            
            // Verificación explícita del contenedor después de la asignación
            if (!moduleContainer) {
                console.error('Seguimiento: Error - containerElement es null o undefined al inicializar el módulo. No se puede renderizar.');
                return; // No intentar renderizar si el contenedor no es válido
            }
            render(); // Llamar a render para mostrar la UI
        }
    };
})();
