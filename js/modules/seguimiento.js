// js/modules/seguimiento.js

const seguimientoModule = (() => {
    let moduleContainer = null;
    let currentProcesoId = null; 
    let currentProcesoData = null; // Para almacenar los datos del proceso actual

    // Mapeo de los nombres de los módulos a sus referencias globales
    const subModules = {
        'requerimiento': window.requerimientoModule,
        'area-usuaria': window.areaUsuariaModule,
        'segmentacion': window.segmentacionModule,
        'costos': window.costosModule,
        'estrategia': window.estrategiaModule
    };

    // Funciones de manejo de eventos para limpieza
    const handleRequerimientoSaved = (data) => handleSubModuleData(data);
    const handleAreaUsuariaSaved = (data) => handleSubModuleData(data);
    const handleSegmentacionSaved = (data) => handleSubModuleData(data);
    const handleCostosSaved = (data) => handleSubModuleData(data);
    const handleEstrategiaSaved = (data) => handleSubModuleData(data);

    /**
     * Inicializa el módulo de Seguimiento.
     * @param {string|null} procesoId - El ID del proceso a cargar para edición, o null si es nuevo.
     * @param {HTMLElement} containerElement - El elemento HTML donde se renderizará el contenido.
     */
    function init(procesoId, containerElement) {
        console.log('Seguimiento: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement);
        moduleContainer = containerElement;
        currentProcesoId = procesoId; 

        // Cargar los datos del proceso si existe, o inicializar uno nuevo/vacío
        if (currentProcesoId) {
            const existingProcesos = window.appData.getProcesos();
            const foundProceso = existingProcesos.find(p => p.id === currentProcesoId);
            if (foundProceso) {
                currentProcesoData = { ...foundProceso }; // Clona para no modificar el original directamente
            } else {
                console.warn(`Seguimiento: Proceso con ID ${currentProcesoId} no encontrado. Inicializando como nuevo.`);
                currentProcesoId = null; // Tratamos como nuevo si no se encontró
                currentProcesoData = { requerimiento: {}, areaUsuaria: {}, segmentacion: {}, costos: {}, estrategia: {} };
            }
        } else {
            // Inicializa un nuevo proceso con objetos vacíos para cada etapa
            currentProcesoData = { requerimiento: {}, areaUsuaria: {}, segmentacion: {}, costos: {}, estrategia: {} };
        }
        console.log('Seguimiento: Datos del proceso actual:', currentProcesoData);

        render(); 

        // Suscribirse a eventos de los submódulos usando eventHandler
        if (window.eventHandler) {
            window.eventHandler.on('requerimientoSaved', handleRequerimientoSaved);
            window.eventHandler.on('areaUsuariaSaved', handleAreaUsuariaSaved);
            window.eventHandler.on('segmentacionSaved', handleSegmentacionSaved);
            window.eventHandler.on('costosSaved', handleCostosSaved);
            window.eventHandler.on('estrategiaSaved', handleEstrategiaSaved);
        } else {
            console.error('Seguimiento: EventHandler no está disponible. No se podrán escuchar eventos de submódulos.');
        }

        // Cargar el primer sub-módulo (pestaña) por defecto al iniciar
        const defaultTab = 'requerimiento'; 
        const defaultTabElement = moduleContainer.querySelector(`#seguimientoTabs [data-bs-target="#${defaultTab}"]`);
        if (defaultTabElement) {
            if (!defaultTabElement.classList.contains('active')) {
                const bsTab = new bootstrap.Tab(defaultTabElement);
                bsTab.show();
            } else {
                loadSubModule(defaultTab); // Si ya está activa, cárgala
            }
        } else {
            console.warn(`Seguimiento: No se encontró la pestaña por defecto: ${defaultTab}`);
            loadSubModule(defaultTab); // Intenta cargarla de todas formas
        }
    }

    /**
     * Handler para los datos guardados por los sub-módulos.
     * Actualiza `currentProcesoData` con los datos recibidos.
     * @param {object} data - Datos emitidos por el sub-módulo (ej. { module: 'requerimiento', data: { ... } })
     */
    function handleSubModuleData(data) {
        console.log(`Seguimiento: Datos recibidos de ${data.module}:`, data.data);
        if (currentProcesoData && data.module) {
            currentProcesoData[data.module] = { ...currentProcesoData[data.module], ...data.data };
            console.log('Seguimiento: Datos del proceso actualizados:', currentProcesoData);
        }
    }

    /**
     * Renderiza la estructura principal del módulo de Seguimiento, incluyendo las pestañas.
     */
    function render() {
        if (!moduleContainer) {
            console.error('Seguimiento: El contenedor del módulo no está definido.');
            return;
        }

        const procesoTitle = currentProcesoId ? `Editando Proceso: ${currentProcesoId}` : 'Nuevo Proceso';

        moduleContainer.innerHTML = `
            <h2><i class="bi bi-clipboard-data me-2"></i>Seguimiento de Proceso</h2>
            <h4 class="mb-4 text-muted">${procesoTitle}</h4>

            <ul class="nav nav-tabs" id="seguimientoTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="requerimiento-tab" data-bs-toggle="tab" data-bs-target="#requerimiento-pane" type="button" role="tab" aria-controls="requerimiento-pane" aria-selected="true" data-sub-module="requerimiento">Requerimiento</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="area-usuaria-tab" data-bs-toggle="tab" data-bs-target="#area-usuaria-pane" type="button" role="tab" aria-controls="area-usuaria-pane" aria-selected="false" data-sub-module="area-usuaria">Área Usuaria</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="segmentacion-tab" data-bs-toggle="tab" data-bs-target="#segmentacion-pane" type="button" role="tab" aria-controls="segmentacion-pane" aria-selected="false" data-sub-module="segmentacion">Segmentación</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="costos-tab" data-bs-toggle="tab" data-bs-target="#costos-pane" type="button" role="tab" aria-controls="costos-pane" aria-selected="false" data-sub-module="costos">Costos</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="estrategia-tab" data-bs-toggle="tab" data-bs-target="#estrategia-pane" type="button" role="tab" aria-controls="estrategia-pane" aria-selected="false" data-sub-module="estrategia">Estrategia</button>
                </li>
            </ul>
            <div class="tab-content mt-3" id="seguimientoTabContent">
                <div class="tab-pane fade show active" id="requerimiento-pane" role="tabpanel" aria-labelledby="requerimiento-tab"></div>
                <div class="tab-pane fade" id="area-usuaria-pane" role="tabpanel" aria-labelledby="area-usuaria-tab"></div>
                <div class="tab-pane fade" id="segmentacion-pane" role="tabpanel" aria-labelledby="segmentacion-tab"></div>
                <div class="tab-pane fade" id="costos-pane" role="tabpanel" aria-labelledby="costos-tab"></div>
                <div class="tab-pane fade" id="estrategia-pane" role="tabpanel" aria-labelledby="estrategia-tab"></div>
            </div>
            <div class="mt-4 text-end">
                <button class="btn btn-success me-2" id="saveProcesoBtn"><i class="bi bi-save me-2"></i>Guardar Proceso</button>
                <button class="btn btn-secondary" id="cancelProcesoBtn"><i class="bi bi-x-circle me-2"></i>Cancelar</button>
            </div>
        `;

        // Añadir event listeners a las pestañas para cargar el contenido de los sub-módulos
        const tabButtons = moduleContainer.querySelectorAll('#seguimientoTabs .nav-link');
        tabButtons.forEach(button => {
            button.addEventListener('shown.bs.tab', (event) => {
                const targetId = event.target.dataset.bsTarget.substring(1).replace('-pane', ''); // Obtiene 'requerimiento', etc.
                loadSubModule(targetId);
            });
        });

        // Event listener para el botón Guardar Proceso
        const saveProcesoBtn = moduleContainer.querySelector('#saveProcesoBtn');
        if (saveProcesoBtn) {
            saveProcesoBtn.addEventListener('click', () => {
                console.log('Seguimiento: Botón Guardar Proceso clickeado. Datos finales a guardar:', currentProcesoData);

                if (currentProcesoId && currentProcesoId !== 'nuevo') {
                    // Si ya existe, actualiza el proceso existente
                    window.appData.updateProceso(currentProcesoId, currentProcesoData);
                    alert(`Proceso ${currentProcesoId} actualizado exitosamente!`);
                } else {
                    // Si es nuevo, añade un nuevo proceso
                    const savedProceso = window.appData.addProceso(currentProcesoData);
                    alert('Nuevo proceso guardado exitosamente!');
                    currentProcesoId = savedProceso.id; // Asigna el ID generado
                    currentProcesoData.id = savedProceso.id; // Actualiza los datos del proceso
                }
                
                // Redirigir al dashboard después de guardar
                if (window.app && typeof window.app.loadModule === 'function') {
                    window.app.loadModule('dashboard');
                }
            });
        }

        // Event listener para el botón Cancelar
        const cancelProcesoBtn = moduleContainer.querySelector('#cancelProcesoBtn');
        if (cancelProcesoBtn) {
            cancelProcesoBtn.addEventListener('click', () => {
                console.log('Seguimiento: Botón Cancelar clickeado. Volviendo al dashboard.');
                if (window.app && typeof window.app.loadModule === 'function') {
                    window.app.loadModule('dashboard');
                }
            });
        }
    }

    /**
     * Carga el contenido de un sub-módulo en su panel correspondiente.
     * Pasa los datos relevantes del proceso al sub-módulo.
     * @param {string} subModuleName - El nombre del sub-módulo (ej. 'requerimiento').
     */
    function loadSubModule(subModuleName) {
        console.log(`Seguimiento: Intentando cargar sub-módulo: ${subModuleName}`);
        // Utiliza el id del panel que contiene el contenido (ej. #requerimiento-pane)
        const subModuleContainer = moduleContainer.querySelector(`#${subModuleName}-pane`); 

        if (!subModuleContainer) {
            console.error(`Seguimiento: No se encontró el contenedor para el sub-módulo: #${subModuleName}-pane`);
            return;
        }

        const subModule = subModules[subModuleName]; 

        if (subModule && typeof subModule.init === 'function') {
            console.log(`Seguimiento: Sub-módulo '${subModuleName}' encontrado y tiene método 'init'.`);
            // Pasamos los datos específicos de este sub-módulo al init
            const subModuleSpecificData = currentProcesoData ? currentProcesoData[subModuleName] : {};
            subModule.init(currentProcesoId, subModuleContainer, subModuleSpecificData); 
            console.log(`Seguimiento: Sub-módulo '${subModuleName}' cargado exitosamente.`);
        } else {
            console.error(`Seguimiento: El sub-módulo '${subModuleName}' no se encontró o no tiene un método 'init'.`);
            subModuleContainer.innerHTML = `<p class="alert alert-warning">Error: Contenido de ${subModuleName} no disponible. Verifique el archivo JS.</p>`;
        }
    }

    /**
     * Limpia los event listeners cuando el módulo Seguimiento deja de estar activo.
     */
    function cleanup() {
        if (window.eventHandler) {
            window.eventHandler.off('requerimientoSaved', handleRequerimientoSaved);
            window.eventHandler.off('areaUsuariaSaved', handleAreaUsuariaSaved);
            window.eventHandler.off('segmentacionSaved', handleSegmentacionSaved);
            window.eventHandler.off('costosSaved', handleCostosSaved);
            window.eventHandler.off('estrategiaSaved', handleEstrategiaSaved);
            console.log('Seguimiento: Listeners de eventos de submódulos limpiados.');
        }
    }

    return {
        init: init,
        cleanup: cleanup 
    };
})();

window.seguimientoModule = seguimientoModule;