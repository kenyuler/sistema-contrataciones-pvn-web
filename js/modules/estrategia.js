// js/modules/estrategia.js

const estrategiaModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;

    function render() {
        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado para cargar Estrategia.</p>';
            return;
        }

        const data = proceso.estrategiaData || {};

        let html = `
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Módulo de Estrategia de Contratación para: <strong class="text-primary">${proceso.nombre}</strong></span>
                    <button class="btn btn-secondary btn-sm" id="back-to-process-detail">← Volver al Proceso</button>
                </div>
                <div class="card-body">
                    <form id="estrategia-form">
                        <h5 class="form-title mb-4">Detalles de la Estrategia de Contratación</h5>

                        <div class="mb-3">
                            <label for="metodoContratacion" class="form-label">Método de Contratación Sugerido:</label>
                            <select class="form-select" id="metodoContratacion">
                                <option value="">Seleccione Método</option>
                                <option value="Licitación Pública" ${data.metodoContratacion === 'Licitación Pública' ? 'selected' : ''}>Licitación Pública</option>
                                <option value="Concurso Público" ${data.metodoContratacion === 'Concurso Público' ? 'selected' : ''}>Concurso Público</option>
                                <option value="Adjudicación Simplificada" ${data.metodoContratacion === 'Adjudicación Simplificada' ? 'selected' : ''}>Adjudicación Simplificada</option>
                                <option value="Contratación Directa" ${data.metodoContratacion === 'Contratación Directa' ? 'selected' : ''}>Contratación Directa</option>
                                <option value="Selección de Consultores" ${data.metodoContratacion === 'Selección de Consultores' ? 'selected' : ''}>Selección de Consultores</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="plazoEjecucion" class="form-label">Plazo de Ejecución Estimado:</label>
                            <input type="text" class="form-control" id="plazoEjecucion" value="${data.plazoEjecucion || ''}" placeholder="Ej: 90 días, 6 meses">
                        </div>

                        <div class="mb-3">
                            <label for="garantiasRequeridas" class="form-label">Garantías Requeridas:</label>
                            <textarea class="form-control" id="garantiasRequeridas" rows="3" placeholder="Detalle las garantías (fiel cumplimiento, adelantos)...">${data.garantiasRequeridas || ''}</textarea>
                        </div>

                        <div class="mb-3">
                            <label for="observacionesEstrategia" class="form-label">Observaciones Adicionales de la Estrategia:</label>
                            <textarea class="form-control" id="observacionesEstrategia" rows="3" placeholder="Cualquier otra consideración relevante...">${data.observaciones || ''}</textarea>
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" id="save-estrategia-btn">Guardar Datos de Estrategia</button>
                    </form>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#estrategia-form').addEventListener('submit', saveEstrategia);
        
        moduleContainer.querySelector('#back-to-process-detail').addEventListener('click', () => {
            if (typeof app !== 'undefined' && app.loadModule) {
                app.loadModule('seguimiento', currentProcesoId);
            } else {
                console.error('app.loadModule no está disponible.');
            }
        });
    }

    function saveEstrategia(event) {
        event.preventDefault();

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Proceso no encontrado al intentar guardar datos de Estrategia.');
            return;
        }

        const updatedData = {
            metodoContratacion: document.getElementById('metodoContratacion').value,
            plazoEjecucion: document.getElementById('plazoEjecucion').value,
            garantiasRequeridas: document.getElementById('garantiasRequeridas').value,
            observaciones: document.getElementById('observacionesEstrategia').value
        };

        proceso.estrategiaData = updatedData;
        
        appData.updateProcess(proceso);

        alert('Datos de Estrategia guardados exitosamente.');
        console.log('Datos de Estrategia guardados:', proceso);
    }

    return {
        init: (procesoId, containerElement) => {
            currentProcesoId = procesoId;
            moduleContainer = containerElement;
            render();
        }
    };
})();