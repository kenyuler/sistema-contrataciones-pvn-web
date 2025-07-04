// js/modules/segmentacion.js

const segmentacionModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;

    function render() {
        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            moduleContainer.innerHTML = '<p class="alert alert-danger">Proceso no encontrado para cargar Segmentación.</p>';
            return;
        }

        const data = proceso.segmentacionData || {};

        let html = `
            <div class="card mt-3">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Módulo de Segmentación para: <strong class="text-primary">${proceso.nombre}</strong></span>
                    <button class="btn btn-secondary btn-sm" id="back-to-process-detail">← Volver al Proceso</button>
                </div>
                <div class="card-body">
                    <form id="segmentacion-form">
                        <h5 class="form-title mb-4">Detalles de Segmentación del Mercado</h5>

                        <div class="mb-3">
                            <label for="tipoSegmentacion" class="form-label">Tipo de Segmentación:</label>
                            <select class="form-select" id="tipoSegmentacion">
                                <option value="">Seleccione Tipo</option>
                                <option value="Mercado Nacional" ${data.tipoSegmentacion === 'Mercado Nacional' ? 'selected' : ''}>Mercado Nacional</option>
                                <option value="Mercado Internacional" ${data.tipoSegmentacion === 'Mercado Internacional' ? 'selected' : ''}>Mercado Internacional</option>
                                <option value="Monopolio Natural" ${data.tipoSegmentacion === 'Monopolio Natural' ? 'selected' : ''}>Monopolio Natural</option>
                                <option value="Proveedor Único" ${data.tipoSegmentacion === 'Proveedor Único' ? 'selected' : ''}>Proveedor Único</option>
                            </select>
                        </div>

                        <div class="mb-3">
                            <label for="analisisDemanda" class="form-label">Análisis de la Demanda:</label>
                            <textarea class="form-control" id="analisisDemanda" rows="3" placeholder="Descripción del análisis de la demanda...">${data.analisisDemanda || ''}</textarea>
                        </div>

                        <div class="mb-3">
                            <label for="analisisOferta" class="form-label">Análisis de la Oferta:</label>
                            <textarea class="form-control" id="analisisOferta" rows="3" placeholder="Descripción del análisis de la oferta...">${data.analisisOferta || ''}</textarea>
                        </div>

                        <div class="mb-3">
                            <label for="estudioMercado" class="form-label">Estudio de Mercado Realizado:</label>
                            <textarea class="form-control" id="estudioMercado" rows="3" placeholder="Resultados del estudio de mercado...">${data.estudioMercado || ''}</textarea>
                        </div>

                        <button type="submit" class="btn btn-primary mt-4" id="save-segmentacion-btn">Guardar Datos de Segmentación</button>
                    </form>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        moduleContainer.querySelector('#segmentacion-form').addEventListener('submit', saveSegmentacion);
        
        moduleContainer.querySelector('#back-to-process-detail').addEventListener('click', () => {
            if (typeof app !== 'undefined' && app.loadModule) {
                app.loadModule('seguimiento', currentProcesoId);
            } else {
                console.error('app.loadModule no está disponible.');
            }
        });
    }

    function saveSegmentacion(event) {
        event.preventDefault();

        const proceso = appData.getProcess(currentProcesoId);
        if (!proceso) {
            console.error('Proceso no encontrado al intentar guardar datos de Segmentación.');
            return;
        }

        const updatedData = {
            tipoSegmentacion: document.getElementById('tipoSegmentacion').value,
            analisisDemanda: document.getElementById('analisisDemanda').value,
            analisisOferta: document.getElementById('analisisOferta').value,
            estudioMercado: document.getElementById('estudioMercado').value
        };

        proceso.segmentacionData = updatedData;
        
        appData.updateProcess(proceso);

        alert('Datos de Segmentación guardados exitosamente.');
        console.log('Datos de Segmentación guardados:', proceso);
    }

    return {
        init: (procesoId, containerElement) => {
            currentProcesoId = procesoId;
            moduleContainer = containerElement;
            render();
        }
    };
})();