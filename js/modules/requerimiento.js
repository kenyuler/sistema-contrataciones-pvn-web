// js/modules/requerimiento.js

const requerimientoModule = (() => {
    let moduleContainer = null;
    let currentProceso = null; // Almacenará el objeto proceso actual

    /**
     * Renderiza el formulario de requerimiento para un proceso dado.
     */
    function render() {
        if (!moduleContainer) {
            console.error('Requerimiento: moduleContainer es null. No se puede renderizar.');
            return;
        }
        if (!currentProceso) {
            moduleContainer.innerHTML = '<p class="alert alert-warning">No se ha especificado un proceso para el requerimiento.</p>';
            return;
        }

        // Obtener datos de appData (listas)
        const config = appData.getConfig();
        const tiposRequerimientoOptions = config.lists.tiposRequerimiento.map(tipo => `<option value="${tipo}" ${currentProceso.requerimiento.tipoBienServicio === tipo ? 'selected' : ''}>${tipo}</option>`).join('');
        const normasAplicablesOptions = config.lists.normasAplicables.map(norma => `<option value="${norma}" ${currentProceso.requerimiento.normaAplicable === norma ? 'selected' : ''}>${norma}</option>`).join('');
        
        // Obtener la lista de áreas responsables
        const areasResponsablesOptions = config.lists.areasResponsables.map(area => `<option value="${area}" ${currentProceso.areaUsuaria.areaResponsable === area ? 'selected' : ''}>${area}</option>`).join('');

        // Extraer fechas para los campos de selección
        const fechaSolicitud = currentProceso.requerimiento.fechaSolicitud ? new Date(currentProceso.requerimiento.fechaSolicitud) : null;
        const fechaAprobacion = currentProceso.requerimiento.fechaAprobacion ? new Date(currentProceso.requerimiento.fechaAprobacion) : null;

        moduleContainer.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Requerimiento: ${currentProceso.nombre || 'Nuevo Proceso'}</h5>
                </div>
                <div class="card-body">
                    <form id="requerimiento-form">
                        <div class="mb-3">
                            <label for="req-nombre-proceso" class="form-label">Nombre del Proceso</label>
                            <input type="text" class="form-control" id="req-nombre-proceso" value="${currentProceso.nombre || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="req-objeto-contratacion" class="form-label">Objeto de Contratación</label>
                            <input type="text" class="form-control" id="req-objeto-contratacion" value="${currentProceso.tipoContratacion || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label for="req-area-usuaria" class="form-label">Área Usuaria</label>
                            <select class="form-select" id="req-area-usuaria" required>
                                <option value="">Seleccione Área</option>
                                ${areasResponsablesOptions}
                            </select>
                        </div>

                        <hr>
                        <h4>Detalles del Requerimiento</h4>
                        <div class="mb-3">
                            <label for="req-tipo-bien-servicio" class="form-label">Tipo de Bien/Servicio</label>
                            <select class="form-select" id="req-tipo-bien-servicio" required>
                                <option value="">Seleccione Tipo</option>
                                ${tiposRequerimientoOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="req-cantidad" class="form-label">Cantidad</label>
                            <input type="number" class="form-control" id="req-cantidad" value="${currentProceso.requerimiento.cantidad || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="req-unidad-medida" class="form-label">Unidad de Medida</label>
                            <input type="text" class="form-control" id="req-unidad-medida" value="${currentProceso.requerimiento.unidadMedida || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="req-justificacion" class="form-label">Justificación de la Necesidad</label>
                            <textarea class="form-control" id="req-justificacion" rows="3" required>${currentProceso.requerimiento.justificacion || ''}</textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="req-fecha-solicitud" class="form-label">Fecha de Solicitud</label>
                            <input type="date" class="form-control" id="req-fecha-solicitud" value="${fechaSolicitud ? fechaSolicitud.toISOString().split('T')[0] : ''}">
                        </div>
                        <div class="mb-3">
                            <label for="req-fecha-aprobacion" class="form-label">Fecha de Aprobación</label>
                            <input type="date" class="form-control" id="req-fecha-aprobacion" value="${fechaAprobacion ? fechaAprobacion.toISOString().split('T')[0] : ''}">
                        </div>
                        <div class="mb-3">
                            <label for="req-norma-aplicable" class="form-label">Norma Aplicable</label>
                            <select class="form-select" id="req-norma-aplicable">
                                <option value="">Seleccione Norma</option>
                                ${normasAplicablesOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="req-especificaciones-tecnicas" class="form-label">Especificaciones Técnicas</label>
                            <textarea class="form-control" id="req-especificaciones-tecnicas" rows="5">${currentProceso.requerimiento.especificacionesTecnicas || ''}</textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Requerimiento</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners();
    }

    /**
     * Configura los event listeners para el formulario de requerimiento.
     */
    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#requerimiento-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Requerimiento: Guardando datos del requerimiento...');

                const updatedProceso = {
                    ...currentProceso,
                    nombre: document.getElementById('req-nombre-proceso').value,
                    tipoContratacion: document.getElementById('req-objeto-contratacion').value,
                    areaUsuaria: {
                        ...currentProceso.areaUsuaria, // Mantener otros campos si existen
                        areaResponsable: document.getElementById('req-area-usuaria').value
                    },
                    requerimiento: {
                        tipoBienServicio: document.getElementById('req-tipo-bien-servicio').value,
                        cantidad: parseInt(document.getElementById('req-cantidad').value) || 0,
                        unidadMedida: document.getElementById('req-unidad-medida').value,
                        justificacion: document.getElementById('req-justificacion').value,
                        fechaSolicitud: document.getElementById('req-fecha-solicitud').value,
                        fechaAprobacion: document.getElementById('req-fecha-aprobacion').value,
                        normaAplicable: document.getElementById('req-norma-aplicable').value,
                        especificacionesTecnicas: document.getElementById('req-especificaciones-tecnicas').value
                    }
                };
                
                if (typeof appData !== 'undefined' && typeof appData.updateProcess === 'function') {
                    appData.updateProcess(updatedProceso);
                    alert('Datos de requerimiento guardados exitosamente!');
                    // Actualizar el currentProceso localmente para reflejar los cambios
                    currentProceso = appData.getProcess(currentProceso.id); 
                } else {
                    console.error('Requerimiento: appData o appData.updateProcess no están disponibles.');
                    alert('Hubo un error al guardar los datos del requerimiento.');
                }
            });
        }
    }

    return {
        /**
         * Inicializa el módulo de requerimiento.
         * @param {string} procesoId - El ID del proceso cuyo requerimiento se va a mostrar/editar.
         * @param {HTMLElement} containerElement - El contenedor DOM donde el módulo debe renderizarse.
         */
        init: (procesoId, containerElement) => {
            moduleContainer = containerElement;
            
            if (typeof appData === 'undefined') {
                console.error('Requerimiento: appData no está definido al inicializar.');
                if (moduleContainer) {
                    moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles.</p>';
                }
                return;
            }

            currentProceso = appData.getProcess(procesoId);
            
            if (!currentProceso) {
                console.error('Requerimiento: Proceso no encontrado con ID:', procesoId);
                if (moduleContainer) {
                    moduleContainer.innerHTML = `<p class="alert alert-warning">Proceso con ID "${procesoId}" no encontrado para el módulo de Requerimiento.</p>`;
                }
                return;
            }
            console.log('Requerimiento: init() llamado para proceso:', currentProceso);
            render();
        }
    };
})();
