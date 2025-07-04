// js/modules/requerimiento.js

const requerimientoModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;

    function render() {
        const proceso = appData.getProcess(currentProcesoId); // Usar getProcess para obtener el proceso
        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado para cargar requerimiento.</p>';
            return;
        }

        // Aseguramos que la propiedad requerimiento exista, si no, es un objeto vacío
        const data = proceso.requerimiento || {};

        let html = `
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Módulo de Requerimiento para: <strong class="text-primary">${proceso.nombre}</strong></span>
                    <button class="btn btn-secondary btn-sm" id="back-to-process-detail">← Volver al Proceso</button>
                </div>
                <div class="card-body">
                    <form id="requerimiento-form">
                        <h5 class="form-title mb-4">Detalles del Requerimiento</h5>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="tipoBienServicio" class="form-label">Tipo de Bien/Servicio:</label>
                                <input type="text" class="form-control" id="tipoBienServicio" value="${data.tipoBienServicio || ''}" placeholder="Ej: Laptops, Servicio de Consultoría">
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="cantidad" class="form-label">Cantidad:</label>
                                <input type="number" class="form-control" id="cantidad" value="${data.cantidad || ''}" placeholder="Ej: 10">
                            </div>
                            <div class="col-md-3 mb-3">
                                <label for="unidadMedida" class="form-label">Unidad de Medida:</label>
                                <input type="text" class="form-control" id="unidadMedida" value="${data.unidadMedida || ''}" placeholder="Ej: Unidades, Días">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="justificacion" class="form-label">Justificación de la Necesidad:</label>
                            <textarea class="form-control" id="justificacion" rows="3" placeholder="Describa la necesidad y su justificación...">${data.justificacion || ''}</textarea>
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="fechaSolicitud" class="form-label">Fecha de Solicitud:</label>
                                <input type="date" class="form-control" id="fechaSolicitud" value="${data.fechaSolicitud || ''}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="fechaAprobacion" class="form-label">Fecha de Aprobación:</label>
                                <input type="date" class="form-control" id="fechaAprobacion" value="${data.fechaAprobacion || ''}">
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="normaAplicable" class="form-label">Norma Aplicable:</label>
                            <select class="form-select" id="normaAplicable">
                                <option value="">Seleccione Norma</option>
                                ${appData.getConfig().lists.normasAplicables.map(norma => `<option value="${norma}" ${data.normaAplicable === norma ? 'selected' : ''}>${norma}</option>`).join('')}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="especificacionesTecnicas" class="form-label">Especificaciones Técnicas:</label>
                            <textarea class="form-control" id="especificacionesTecnicas" rows="4" placeholder="Detalle las especificaciones técnicas del bien o servicio...">${data.especificacionesTecnicas || ''}</textarea>
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" id="save-requerimiento-btn">Guardar Requerimiento</button>
                    </form>
                </div>
            </div>
        `;

        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#requerimiento-form').addEventListener('submit', saveRequerimiento);
        
        moduleContainer.querySelector('#back-to-process-detail').addEventListener('click', () => {
            // Se utiliza app.loadModule para volver al detalle del proceso en el módulo de seguimiento
            if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                app.loadModule('seguimiento', currentProcesoId);
            } else {
                console.error('app.loadModule no está disponible para volver a la vista del proceso.');
            }
        });
    }

    function saveRequerimiento(event) {
        event.preventDefault();

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Proceso no encontrado al intentar guardar requerimiento.');
            return;
        }

        const updatedData = {
            tipoBienServicio: document.getElementById('tipoBienServicio').value,
            cantidad: parseInt(document.getElementById('cantidad').value) || null,
            unidadMedida: document.getElementById('unidadMedida').value,
            justificacion: document.getElementById('justificacion').value,
            fechaSolicitud: document.getElementById('fechaSolicitud').value,
            fechaAprobacion: document.getElementById('fechaAprobacion').value,
            normaAplicable: document.getElementById('normaAplicable').value,
            especificacionesTecnicas: document.getElementById('especificacionesTecnicas').value
        };

        // Asignar el objeto de datos del módulo al proceso
        proceso.requerimiento = updatedData;
        
        // Usar updateProcess para guardar los cambios en el proceso completo
        appData.updateProcess(proceso);

        alert('Datos de Requerimiento guardados exitosamente.');
        console.log('Requerimiento guardado:', proceso);
    }

    return {
        init: (procesoId, containerElement) => {
            currentProcesoId = procesoId;
            moduleContainer = containerElement;
            render();
        }
    };
})();