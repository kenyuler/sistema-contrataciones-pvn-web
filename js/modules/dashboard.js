// js/modules/dashboard.js

const dashboardModule = (() => {
    let moduleContainer = null;

    function render() {
        // Aseguramos que appData.procesos esté disponible y sea un array
        const procesos = appData.procesos || []; 

        moduleContainer.innerHTML = `
            <div class="card bg-light mb-3">
                <div class="card-body text-center">
                    <h2 class="card-title text-primary">Bienvenido al Sistema de Gestión de Contrataciones</h2>
                    <p class="card-text lead">Aquí podrás administrar y dar seguimiento a todos tus procesos de contratación.</p>
                    <hr>
                    <div class="row">
                        <div class="col-md-4 mb-3">
                            <div class="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-folder-plus text-success" style="font-size: 3rem;"></i>
                                <h5 class="mt-2">Crear Nuevo Proceso</h5>
                                <p class="text-muted">Inicia un nuevo expediente de contratación.</p>
                                <button class="btn btn-success mt-auto" id="create-process-btn">Crear Proceso</button>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-list-check text-info" style="font-size: 3rem;"></i>
                                <h5 class="mt-2">Ver Procesos Existentes</h5>
                                <p class="text-muted">Revisa el listado completo de tus procesos.</p>
                                <button class="btn btn-info mt-auto" id="view-processes-btn">Ver Procesos</button>
                            </div>
                        </div>
                        <div class="col-md-4 mb-3">
                            <div class="p-3 border rounded h-100 d-flex flex-column justify-content-center align-items-center">
                                <i class="bi bi-gear text-secondary" style="font-size: 3rem;"></i>
                                <h5 class="mt-2">Configuración</h5>
                                <p class="text-muted">Ajusta las opciones y listas del sistema.</p>
                                <button class="btn btn-secondary mt-auto" id="settings-btn">Configuración</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header bg-primary text-white">
                    <h4 class="mb-0">Estadísticas Rápidas</h4>
                </div>
                <div class="card-body">
                    <div class="row text-center">
                        <div class="col-md-4">
                            <div class="p-3 border rounded">
                                <h5>Total de Procesos</h5>
                                <p class="fs-2 text-primary" id="total-processes">0</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3 border rounded">
                                <h5>En Ejecución</h5>
                                <p class="fs-2 text-warning" id="in-progress-processes">0</p>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="p-3 border rounded">
                                <h5>Completados</h5>
                                <p class="fs-2 text-success" id="completed-processes">0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Update statistics
        // Usamos la variable local 'procesos' que ya está validada
        const totalProcesses = procesos.length;
        const inProgressProcesses = procesos.filter(p => p.estado !== 'Completado' && p.estado !== 'Cancelado').length;
        const completedProcesses = procesos.filter(p => p.estado === 'Completado').length;

        moduleContainer.querySelector('#total-processes').textContent = totalProcesses;
        moduleContainer.querySelector('#in-progress-processes').textContent = inProgressProcesses;
        moduleContainer.querySelector('#completed-processes').textContent = completedProcesses;


        // Add event listeners
        moduleContainer.querySelector('#create-process-btn').addEventListener('click', () => {
            // Asegurarse de que app y appData estén disponibles
            if (typeof appData !== 'undefined' && typeof appData.createProcess === 'function' && typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                const newProcess = appData.createProcess();
                app.loadModule('seguimiento', newProcess.id);
            } else {
                console.error("Error: appData o app no están completamente definidos al crear proceso.");
                alert("Hubo un error al iniciar un nuevo proceso. Inténtalo de nuevo.");
            }
        });

        moduleContainer.querySelector('#view-processes-btn').addEventListener('click', () => {
            if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                app.loadModule('seguimiento'); // Load seguimiento module to view all processes
            } else {
                console.error("Error: app no está definido al cargar módulo de seguimiento.");
            }
        });

        moduleContainer.querySelector('#settings-btn').addEventListener('click', () => {
            if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                app.loadModule('settings');
            } else {
                console.error("Error: app no está definido al cargar módulo de configuración.");
            }
        });
    }

    return {
        init: (containerElement) => {
            moduleContainer = containerElement;
            render();
        }
    };
})();