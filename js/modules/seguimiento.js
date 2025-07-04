// js/modules/seguimiento.js

const seguimientoModule = (() => {
    let moduleContainer = null; 
    let currentProcesoId = null; 

    function render() {
        if (!moduleContainer) { 
            console.error('Seguimiento: moduleContainer es undefined o null en render(). Esto no debería pasar si init() se llamó correctamente.');
            return;
        }
        moduleContainer.innerHTML = ''; 
        console.log('Seguimiento: Iniciando render(). currentProcesoId:', currentProcesoId);

        if (currentProcesoId) {
            renderProcessDetail();
        } else {
            renderProcessList();
        }
    }

    function renderProcessList() {
        console.log('Seguimiento: Renderizando lista de procesos.');
        let html = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-primary">Seguimiento de Procesos de Contratación</h2>
                <button class="btn btn-success" id="new-process-btn"><i class="bi bi-plus-circle me-2"></i>Nuevo Proceso</button>
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
                    <tbody id="processes-table-body">
                        <!-- Process rows will be inserted here -->
                    </tbody>
                </table>
            </div>
        `;
        moduleContainer.innerHTML = html;

        const processes = appData.procesos || []; 
        console.log('Seguimiento: appData.procesos al renderizar lista:', processes);

        const tableBody = moduleContainer.querySelector('#processes-table-body');
        
        if (!tableBody) {
            console.error('Seguimiento: Elemento #processes-table-body no encontrado en el DOM.');
            return; 
        }

        if (processes.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" class="text-center">No hay procesos registrados.</td></tr>`;
            console.warn('Seguimiento: No hay procesos para mostrar.');
        } else {
            processes.forEach(proceso => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${proceso.id}</td>
                    <td>${proceso.nombre}</td>
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
            console.log(`Seguimiento: ${processes.length} procesos renderizados en la tabla.`);
        }

        moduleContainer.querySelector('#new-process-btn').addEventListener('click', () => {
            console.log('Seguimiento: Botón Nuevo Proceso clicado. Creando nuevo proceso y mostrando detalle.');
            if (typeof appData !== 'undefined' && typeof appData.createProcess === 'function') {
                const newProcess = appData.createProcess();
                console.log('Seguimiento: Nuevo proceso creado:', newProcess);
                currentProcesoId = newProcess.id;
                renderProcessDetail(); 
            } else {
                console.error("Error: appData.createProcess no está disponible al crear proceso desde seguimiento.");
                alert("Hubo un error al iniciar un nuevo proceso. Inténtalo de nuevo.");
            }
        });

        moduleContainer.querySelectorAll('.view-process-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                console.log('Seguimiento: Botón Ver Proceso clicado para ID:', id);
                currentProcesoId = id;
                renderProcessDetail();
            });
        });

        moduleContainer.querySelectorAll('.delete-process-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                console.log('Seguimiento: Botón Eliminar Proceso clicado para ID:', id);
                if (confirm('¿Estás seguro de que quieres eliminar este proceso? Esta acción no se puede deshacer.')) {
                    appData.deleteProcess(id);
                    console.log('Seguimiento: Proceso eliminado. Recargando lista.');
                    renderProcessList();
                }
            });
        });
    }

    function renderProcessDetail() {
        console.log('Seguimiento: Renderizando detalle del proceso ID:', currentProcesoId);
        const proceso = appData.getProcess(currentProcesoId);

        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado. <button class="btn btn-primary btn-sm" id="back-to-list-btn">Volver a la lista</button></p>';
            moduleContainer.querySelector('#back-to-list-btn').addEventListener('click', () => {
                currentProcesoId = null;
                renderProcessList();
            });
            console.error('Seguimiento: Proceso no encontrado con ID:', currentProcesoId);
            return;
        }

        const modulesConfig = {
            'requerimiento': {
                name: 'Requerimiento',
                variable: typeof requerimientoModule !== 'undefined' ? requerimientoModule : null
            },
            'area_usuaria': {
                name: 'Área Usuaria',
                variable: typeof areaUsuariaModule !== 'undefined' ? areaUsuariaModule : null
            },
            'segmentacion': {
                name: 'Segmentación',
                variable: typeof segmentacionModule !== 'undefined' ? segmentacionModule : null
            },
            'costos': {
                name: 'Costos y Presupuesto',
                variable: typeof costosModule !== 'undefined' ? costosModule : null
            },
            'estrategia': {
                name: 'Estrategia de Contratación',
                variable: typeof estrategiaModule !== 'undefined' ? estrategiaModule : null
            }
        };

        let moduleTabsHtml = '';
        let moduleContentHtml = '';

        for (const key in modulesConfig) {
            const module = modulesConfig[key];
            if (module.variable && typeof module.variable.init === 'function') {
                const isActive = (proceso.currentModule === key || (proceso.currentModule === undefined && key === 'requerimiento')) ? 'active' : '';
                const isShow = isActive ? 'show active' : '';

                moduleTabsHtml += `<li class="nav-item">
                                    <button class="nav-link ${isActive}" id="tab-${key}" data-bs-toggle="tab" data-bs-target="#content-${key}" type="button" role="tab" aria-controls="content-${key}" aria-selected="${isActive ? 'true' : 'false'}">${module.name}</button>
                                </li>`;
                moduleContentHtml += `<div class="tab-pane fade ${isShow}" id="content-${key}" role="tabpanel" aria-labelledby="tab-${key}">
                                        <div class="module-placeholder" data-module="${key}"></div>
                                    </div>`;
            } else {
                console.warn(`Seguimiento: Módulo ${key} no encontrado o no tiene método init. No se añadirá a las pestañas.`);
            }
        }
        
        let html = `
            <div class="card mt-3">
                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 class="mb-0">Detalle del Proceso: ${proceso.nombre} (ID: ${proceso.id})</h3>
                    <button class="btn btn-secondary" id="back-to-list-btn"><i class="bi bi-arrow-left"></i> Volver a la Lista</button>
                </div>
                <div class="card-body">
                    <form id="process-detail-form">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="process-name" class="form-label">Nombre del Proceso:</label>
                                <input type="text" class="form-control" id="process-name" value="${proceso.nombre || ''}" placeholder="Ej: Adquisición de Equipos de Cómputo">
                            </div>
                            <div class="col-md-3">
                                <label for="process-type" class="form-label">Tipo de Contratación:</label>
                                <select class="form-select" id="process-type">
                                    <option value="">Seleccione Tipo</option>
                                    ${appData.getConfig().lists.tiposContratacion.map(tipo => `<option value="${tipo}" ${proceso.tipoContratacion === tipo ? 'selected' : ''}>${tipo}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="process-state" class="form-label">Estado:</label>
                                <select class="form-select" id="process-state">
                                    <option value="">Seleccione Estado</option>
                                    ${appData.getConfig().lists.estadosProceso.map(estado => `<option value="${estado}" ${proceso.estado === estado ? 'selected' : ''}>${estado}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="process-start-date" class="form-label">Fecha de Inicio:</label>
                                <input type="date" class="form-control" id="process-start-date" value="${proceso.fechaInicio || ''}">
                            </div>
                            <div class="col-md-6">
                                <label for="process-end-date" class="form-label">Fecha de Fin Estimada:</label>
                                <input type="date" class="form-control" id="process-end-date" value="${proceso.fechaFinEstimada || ''}">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="process-description" class="form-label">Descripción:</label>
                            <textarea class="form-control" id="process-description" rows="3" placeholder="Descripción breve del proceso...">${proceso.descripcion || ''}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" id="save-process-details-btn"><i class="bi bi-save me-2"></i>Guardar Detalles del Proceso</button>
                    </form>
                </div>
            </div>

            <div class="card mt-4">
                <div class="card-header bg-secondary text-white">
                    <h4 class="mb-0">Etapas del Proceso</h4>
                </div>
                <div class="card-body">
                    <ul class="nav nav-tabs" id="process-tabs" role="tablist">
                        ${moduleTabsHtml}
                    </ul>
                    <div class="tab-content mt-3" id="process-tab-content">
                        ${moduleContentHtml}
                    </div>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#process-detail-form').addEventListener('submit', saveProcessDetails);
        
        moduleContainer.querySelector('#back-to-list-btn').addEventListener('click', () => {
            console.log('Seguimiento: Botón Volver a la Lista clicado. Reseteando ID y renderizando lista.');
            currentProcesoId = null; 
            renderProcessList(); 
        });

        let initialModuleKey = proceso.currentModule;
        if (!initialModuleKey || !modulesConfig[initialModuleKey]?.variable) {
            initialModuleKey = Object.keys(modulesConfig).find(key => modulesConfig[key].variable && typeof modulesConfig[key].variable.init === 'function');
        }

        if (initialModuleKey) {
            const tabButton = moduleContainer.querySelector(`#tab-${initialModuleKey}`);
            const tabContent = moduleContainer.querySelector(`#content-${initialModuleKey}`);
            if (tabButton && tabContent) {
                tabButton.classList.add('active');
                tabContent.classList.add('show', 'active');
            }
            console.log('Seguimiento: Cargando módulo inicial:', initialModuleKey);
            loadModuleContent(initialModuleKey, `content-${initialModuleKey}`);
        } else {
            console.warn('Seguimiento: No hay módulos disponibles para cargar en el detalle del proceso.');
        }

        moduleContainer.querySelectorAll('.nav-link').forEach(tabButton => {
            tabButton.addEventListener('shown.bs.tab', function (event) {
                const moduleKey = event.target.id.replace('tab-', '');
                const targetId = event.target.dataset.bsTarget.replace('#', '');
                
                const updatedProceso = appData.getProcess(currentProcesoId);
                if (updatedProceso) {
                    updatedProceso.currentModule = moduleKey;
                    appData.updateProcess(updatedProceso); 
                    console.log('Seguimiento: Módulo activo del proceso actualizado a:', moduleKey);
                }
                
                loadModuleContent(moduleKey, targetId);
            });
        });
    }

    function loadModuleContent(moduleKey, containerId) {
        console.log(`Seguimiento: Intentando cargar contenido para el módulo ${moduleKey} en #${containerId}`);
        const modulePlaceholder = moduleContainer.querySelector(`#${containerId} .module-placeholder`);
        if (!modulePlaceholder) {
            console.error(`Seguimiento: Contenedor para el módulo ${moduleKey} no encontrado.`);
            return;
        }

        const modulesConfig = {
            'requerimiento': { name: 'Requerimiento', variable: typeof requerimientoModule !== 'undefined' ? requerimientoModule : null },
            'area_usuaria': { name: 'Área Usuaria', variable: typeof areaUsuariaModule !== 'undefined' ? areaUsuariaModule : null },
            'segmentacion': { name: 'Segmentación', variable: typeof segmentacionModule !== 'undefined' ? segmentacionModule : null },
            'costos': { name: 'Costos y Presupuesto', variable: typeof costosModule !== 'undefined' ? costosModule : null },
            'estrategia': { name: 'Estrategia de Contratación', variable: typeof estrategiaModule !== 'undefined' ? estrategiaModule : null }
        };

        const module = modulesConfig[moduleKey];
        if (module && module.variable && typeof module.variable.init === 'function') {
            modulePlaceholder.innerHTML = ''; 
            module.variable.init(currentProcesoId, modulePlaceholder);
            console.log(`Seguimiento: Módulo ${moduleKey} inicializado.`);
        } else {
            modulePlaceholder.innerHTML = `<p class="alert alert-warning">El módulo '${module?.name || moduleKey}' no pudo ser cargado o no tiene un método 'init' válido.</p>`;
            console.error(`Seguimiento: No se pudo cargar el módulo de ${module?.name || moduleKey}.`);
        }
    }

    function saveProcessDetails(event) {
        event.preventDefault(); 
        console.log('Seguimiento: Guardando detalles del proceso.');

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Seguimiento: Proceso no encontrado al intentar guardar detalles.');
            return;
        }

        const updatedProcesoData = { ...proceso }; 

        updatedProcesoData.nombre = document.getElementById('process-name').value;
        updatedProcesoData.tipoContratacion = document.getElementById('process-type').value;
        updatedProcesoData.estado = document.getElementById('process-state').value;
        updatedProcesoData.fechaInicio = document.getElementById('process-start-date').value;
        updatedProcesoData.fechaFinEstimada = document.getElementById('process-end-date').value;
        updatedProcesoData.descripcion = document.getElementById('process-description').value;

        appData.updateProcess(updatedProcesoData);

        alert('Detalles del proceso guardados exitosamente.');
        console.log('Seguimiento: Proceso actualizado:', updatedProcesoData);
    }

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

    return {
        init: (id, containerElement) => {
            moduleContainer = containerElement; 
            currentProcesoId = id || null; 
            console.log('Seguimiento: init() llamado con ID:', id);
            console.log('Seguimiento: moduleContainer asignado:', moduleContainer); 
            render();
        }
    };
})();