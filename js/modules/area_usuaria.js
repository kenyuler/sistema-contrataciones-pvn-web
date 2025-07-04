// js/modules/area_usuaria.js

const areaUsuariaModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;

    function render() {
        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado para cargar Área Usuaria.</p>';
            return;
        }

        const data = proceso.areaUsuariaData || {};

        let html = `
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Módulo de Área Usuaria para: <strong class="text-primary">${proceso.nombre}</strong></span>
                    <button class="btn btn-secondary btn-sm" id="back-to-process-detail">← Volver al Proceso</button>
                </div>
                <div class="card-body">
                    <form id="area-usuaria-form">
                        <h5 class="form-title mb-4">Detalles de Área Usuaria</h5>

                        <div class="mb-3">
                            <label for="responsableArea" class="form-label">Responsable del Área Usuaria:</label>
                            <input type="text" class="form-control" id="responsableArea" value="${data.responsable || ''}" placeholder="Ej: Juan Pérez">
                        </div>

                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="fechaEntregaRqm" class="form-label">Fecha de Entrega del Requerimiento:</label>
                                <input type="date" class="form-control" id="fechaEntregaRqm" value="${data.fechaEntregaRqm || ''}">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="conformidadRqm" class="form-label">Conformidad del Requerimiento:</label>
                                <select class="form-select" id="conformidadRqm">
                                    <option value="">Seleccione</option>
                                    <option value="Conforme" ${data.conformidadRqm === 'Conforme' ? 'selected' : ''}>Conforme</option>
                                    <option value="No Conforme" ${data.conformidadRqm === 'No Conforme' ? 'selected' : ''}>No Conforme</option>
                                    <option value="Observado" ${data.conformidadRqm === 'Observado' ? 'selected' : ''}>Observado</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="observacionesArea" class="form-label">Observaciones del Área Usuaria:</label>
                            <textarea class="form-control" id="observacionesArea" rows="3" placeholder="Observaciones o comentarios...">${data.observaciones || ''}</textarea>
                        </div>
                        
                        <div class="mb-3">
                            <label for="fechaConformidad" class="form-label">Fecha de Conformidad del Requerimiento:</label>
                            <input type="date" class="form-control" id="fechaConformidad" value="${data.fechaConformidad || ''}">
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" id="save-area-usuaria-btn">Guardar Datos de Área Usuaria</button>
                    </form>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#area-usuaria-form').addEventListener('submit', saveAreaUsuaria);
        
        moduleContainer.querySelector('#back-to-process-detail').addEventListener('click', () => {
            if (typeof app !== 'undefined' && app.loadModule) {
                app.loadModule('seguimiento', currentProcesoId); // Volver al módulo de seguimiento y al detalle del proceso
            } else {
                console.error('app.loadModule no está disponible.');
            }
        });
    }

    function saveAreaUsuaria(event) {
        event.preventDefault();

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Proceso no encontrado al intentar guardar datos de Área Usuaria.');
            return;
        }

        const updatedData = {
            responsable: document.getElementById('responsableArea').value,
            fechaEntregaRqm: document.getElementById('fechaEntregaRqm').value,
            conformidadRqm: document.getElementById('conformidadRqm').value,
            observaciones: document.getElementById('observacionesArea').value,
            fechaConformidad: document.getElementById('fechaConformidad').value
        };

        proceso.areaUsuariaData = updatedData;
        
        appData.updateProcess(proceso);

        alert('Datos de Área Usuaria guardados exitosamente.');
        console.log('Datos de Área Usuaria guardados:', proceso);
    }

    return {
        init: (procesoId, containerElement) => {
            currentProcesoId = procesoId;
            moduleContainer = containerElement;
            render();
        }
    };
})();