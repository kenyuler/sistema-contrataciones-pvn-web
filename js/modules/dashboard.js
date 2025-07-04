// js/modules/dashboard.js

const dashboardModule = (() => {
    let moduleContainer = null; // Debe inicializarse a null

    // Función para renderizar el contenido del dashboard
    function render() {
        if (!moduleContainer) {
            console.error('Dashboard: moduleContainer es null o undefined en render(). Esto no debería pasar si init() se llamó correctamente.');
            return; // Salir si el contenedor no es válido
        }
        moduleContainer.innerHTML = ''; // Aquí es donde ocurre el error si moduleContainer es null

        // Asegúrate de que appData está disponible antes de usarlo
        if (typeof appData === 'undefined') {
            console.error('Dashboard: appData no está definido. No se pueden cargar los procesos.');
            moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles. Por favor, recarga la página.</p>';
            return;
        }

        const procesos = appData.getProcesos(); // Obtener los procesos de appData

        let dashboardHtml = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-primary">Dashboard de Contrataciones</h2>
                <button class="btn btn-success" id="new-process-btn-dashboard"><i class="bi bi-plus-circle me-2"></i>Nuevo Proceso</button>
            </div>

            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card bg-info text-white shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Total de Procesos</h5>
                            <p class="card-text fs-3">${procesos.length}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card bg-warning text-dark shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">En Ejecución</h5>
                            <p class="card-text fs-3">${procesos.filter(p => p.estado === 'En Ejecución').length}</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-4">
                    <div class="card bg-success text-white shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">Completados</h5>
                            <p class="card-text fs-3">${procesos.filter(p => p.estado === 'Completado').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h3 class="mt-4 mb-3 text-secondary">Últimos Procesos Activos</h3>
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
                    <tbody id="dashboard-processes-table-body">
                        </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-end mt-3">
                <button class="btn btn-primary" id="view-all-processes-btn"><i class="bi bi-list-task me-2"></i>Ver Todos los Procesos</button>
            </div>
        `;
        moduleContainer.innerHTML = dashboardHtml;

        // Llenar la tabla de últimos procesos
        const tableBody = moduleContainer.querySelector('#dashboard-processes-table-body');
        if (tableBody) {
            const latestProcesses = procesos.slice(-5); // Mostrar los últimos 5
            if (latestProcesses.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay procesos recientes.</td></tr>`;
            } else {
                latestProcesses.forEach(proceso => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${proceso.id}</td>
                        <td>${proceso.nombre}</td>
                        <td><span class="badge bg-${getBadgeClass(proceso.estado)}">${proceso.estado || 'N/A'}</span></td>
                        <td>${proceso.tipoContratacion || 'N/A'}</td>
                        <td>${proceso.fechaInicio || 'N/A'}</td>
                        <td>
                            <button class="btn btn-info btn-sm view-process-detail-dashboard-btn" data-id="${proceso.id}"><i class="bi bi-eye"></i> Ver Detalle</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        }

        // Configurar event listeners
        setupEventListeners();
    }

    // Configura los listeners para los botones del dashboard
    function setupEventListeners() {
        if (!moduleContainer) return; // Doble verificación

        const newProcessBtn = moduleContainer.querySelector('#new-process-btn-dashboard');
        if (newProcessBtn) {
            newProcessBtn.addEventListener('click', () => {
                console.log('Dashboard: Clic en Nuevo Proceso desde Dashboard.');
                // Llama a app.loadModule para cargar el módulo de seguimiento y crear un nuevo proceso
                if (typeof app !== 'undefined' && typeof app.loadModule === 'function' && typeof appData !== 'undefined' && typeof appData.createProcess === 'function') {
                    const newProcess = appData.createProcess(); // Crea el proceso y obtén su ID
                    app.loadModule('seguimiento', newProcess.id); // Pasa el ID al módulo de seguimiento
                } else {
                    console.error('Error: app.loadModule o appData.createProcess no están disponibles.');
                    alert('Hubo un error al iniciar un nuevo proceso.');
                }
            });
        }

        const viewAllBtn = moduleContainer.querySelector('#view-all-processes-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                console.log('Dashboard: Clic en Ver Todos los Procesos. Navegando a Seguimiento.');
                // Llama a app.loadModule para cargar el módulo de seguimiento (sin ID de proceso específico)
                if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                    app.loadModule('seguimiento');
                } else {
                    console.error('Error: app.loadModule no está disponible para ver todos los procesos.');
                    alert('Hubo un error al cargar la lista de procesos.');
                }
            });
        }

        moduleContainer.querySelectorAll('.view-process-detail-dashboard-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                console.log('Dashboard: Clic en Ver Detalle de Proceso para ID:', id);
                // Llama a app.loadModule para cargar el módulo de seguimiento con el ID del proceso
                if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                    app.loadModule('seguimiento', id);
                } else {
                    console.error('Error: app.loadModule no está disponible para ver el detalle del proceso.');
                    alert('Hubo un error al cargar el detalle del proceso.');
                }
            });
        });
    }

    // Helper para clases de badges
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

    // Método de inicialización del módulo dashboard
    return {
        init: (id, containerElement) => { // 'id' no se usa en dashboard pero se mantiene para la firma de loadModule
            moduleContainer = containerElement; // ¡Aquí se asigna el contenedor!
            console.log('Dashboard: init() llamado. ContainerElement:', containerElement);
            if (!moduleContainer) {
                console.error('Dashboard: Error - containerElement es null o undefined al inicializar el módulo. Renderizado abortado.');
                return;
            }
            render();
        }
    };
})();
