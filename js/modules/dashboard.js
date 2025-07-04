// js/modules/dashboard.js

const dashboardModule = (() => {
    let moduleContainer = null;

    /**
     * Inicializa el módulo Dashboard.
     * @param {string|null} procesoId - Siempre null para el dashboard.
     * @param {HTMLElement} containerElement - El elemento HTML donde se renderizará el contenido del módulo.
     */
    function init(procesoId, containerElement) {
        console.log('Dashboard: init() llamado. ContainerElement:', containerElement);
        moduleContainer = containerElement;
        render();
    }

    /**
     * Renderiza el contenido HTML del módulo Dashboard.
     */
    function render() {
        if (!moduleContainer) {
            console.error('Dashboard: El contenedor del módulo no está definido.');
            return;
        }

        moduleContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2><i class="bi bi-speedometer2 me-2"></i>Dashboard de Procesos</h2>
                <button class="btn btn-primary" id="newProcesoBtn">
                    <i class="bi bi-plus-circle me-2"></i>Nuevo Proceso
                </button>
            </div>
            <div id="dashboard-content">
                <p>Aquí se mostrará un resumen de los procesos.</p>
                <table class="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID Proceso</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="procesosTableBody">
                        </tbody>
                </table>
                <div id="noProcesosMessage" class="alert alert-info" style="display: none;">
                    No hay procesos de contratación registrados aún.
                </div>
            </div>
        `;

        // Añadir evento al botón "Nuevo Proceso"
        const newProcesoBtn = moduleContainer.querySelector('#newProcesoBtn');
        if (newProcesoBtn) {
            newProcesoBtn.addEventListener('click', () => {
                console.log('Dashboard: Clic en Nuevo Proceso. Cargando módulo seguimiento...');
                if (window.app && typeof window.app.loadModule === 'function') {
                    window.app.loadModule('seguimiento'); // Cargar módulo de seguimiento sin ID de proceso
                } else {
                    console.error('Dashboard: app.loadModule no está disponible.');
                }
            });
        }

        loadProcesosTable();
    }

    /**
     * Carga y muestra los procesos en la tabla del dashboard.
     */
    function loadProcesosTable() {
        const procesos = window.appData.getProcesos(); // Acceder a appData globalmente
        const tbody = moduleContainer.querySelector('#procesosTableBody');
        const noProcesosMessage = moduleContainer.querySelector('#noProcesosMessage');

        if (!tbody) {
            console.error('Dashboard: No se encontró el tbody para la tabla de procesos.');
            return;
        }

        tbody.innerHTML = ''; // Limpiar tabla

        if (procesos.length === 0) {
            noProcesosMessage.style.display = 'block';
            return;
        } else {
            noProcesosMessage.style.display = 'none';
        }

        procesos.forEach(proceso => {
            const row = tbody.insertRow();
            row.insertCell().textContent = proceso.id;
            // Se asume que proceso.requerimiento.nombre existe después de guardar
            row.insertCell().textContent = proceso.requerimiento && proceso.requerimiento.nombre ? proceso.requerimiento.nombre : 'Sin nombre de requerimiento';
            row.insertCell().textContent = proceso.estado || 'Pendiente';
            
            const actionsCell = row.insertCell();
            const editBtn = document.createElement('button');
            editBtn.classList.add('btn', 'btn-sm', 'btn-info', 'me-2');
            editBtn.innerHTML = '<i class="bi bi-pencil"></i> Editar';
            editBtn.addEventListener('click', () => {
                console.log(`Dashboard: Editando proceso ${proceso.id}`);
                if (window.app && typeof window.app.loadModule === 'function') {
                    window.app.loadModule('seguimiento', proceso.id); // Cargar módulo de seguimiento con el ID
                }
            });
            actionsCell.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('btn', 'btn-sm', 'btn-danger');
            deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Eliminar';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`¿Está seguro de eliminar el proceso ${proceso.id}?`)) {
                    window.appData.deleteProceso(proceso.id);
                    loadProcesosTable(); // Recargar tabla después de eliminar
                }
            });
            actionsCell.appendChild(deleteBtn);
        });
    }

    return {
        init: init,
        render: loadProcesosTable // Exponer render para que el dashboard se pueda refrescar
    };
})();

window.dashboardModule = dashboardModule;