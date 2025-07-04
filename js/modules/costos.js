// js/modules/costos.js

const costosModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;

    function render() {
        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado para cargar Costos.</p>';
            return;
        }

        const data = proceso.costosData || {};

        let html = `
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Módulo de Costos y Presupuesto para: <strong class="text-primary">${proceso.nombre}</strong></span>
                    <button class="btn btn-secondary btn-sm" id="back-to-process-detail">← Volver al Proceso</button>
                </div>
                <div class="card-body">
                    <form id="costos-form">
                        <h5 class="form-title mb-4">Detalles de Costos y Presupuesto</h5>

                        <div class="mb-3">
                            <label for="valorEstimado" class="form-label">Valor Estimado (S/.):</label>
                            <input type="number" class="form-control" id="valorEstimado" step="0.01" value="${data.valorEstimado || ''}" placeholder="Ej: 150000.00">
                        </div>

                        <div class="mb-3">
                            <label for="fuenteFinanciamiento" class="form-label">Fuente de Financiamiento:</label>
                            <input type="text" class="form-control" id="fuenteFinanciamiento" value="${data.fuenteFinanciamiento || ''}" placeholder="Ej: Recursos Ordinarios, Endeudamiento">
                        </div>

                        <div class="mb-3">
                            <label for="disponibilidadPresupuestal" class="form-label">Disponibilidad Presupuestal:</label>
                            <select class="form-select" id="disponibilidadPresupuestal">
                                <option value="">Seleccione</option>
                                <option value="Sí" ${data.disponibilidadPresupuestal === 'Sí' ? 'selected' : ''}>Sí</option>
                                <option value="No" ${data.disponibilidadPresupuestal === 'No' ? 'selected' : ''}>No</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="sustentoCosto" class="form-label">Sustento del Costo Estimado:</label>
                            <textarea class="form-control" id="sustentoCosto" rows="3" placeholder="Metodología o documentos que sustentan el costo...">${data.sustentoCosto || ''}</textarea>
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" id="save-costos-btn">Guardar Datos de Costos</button>
                    </form>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#costos-form').addEventListener('submit', saveCostos);
        
        moduleContainer.querySelector('#back-to-process-detail').addEventListener('click', () => {
            if (typeof app !== 'undefined' && app.loadModule) {
                app.loadModule('seguimiento', currentProcesoId);
            } else {
                console.error('app.loadModule no está disponible.');
            }
        });
    }

    function saveCostos(event) {
        event.preventDefault();

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Proceso no encontrado al intentar guardar datos de Costos.');
            return;
        }

        const updatedData = {
            valorEstimado: parseFloat(document.getElementById('valorEstimado').value) || null,
            fuenteFinanciamiento: document.getElementById('fuenteFinanciamiento').value,
            disponibilidadPresupuestal: document.getElementById('disponibilidadPresupuestal').value,
            sustentoCosto: document.getElementById('sustentoCosto').value
        };

        proceso.costosData = updatedData;
        
        appData.updateProcess(proceso);

        alert('Datos de Costos guardados exitosamente.');
        console.log('Datos de Costos guardados:', proceso);
    }

    return {
        init: (procesoId, containerElement) => {
            currentProcesoId = procesoId;
            moduleContainer = containerElement;
            render();
        }
    };
})();