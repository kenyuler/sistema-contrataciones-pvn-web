// js/modules/segmentacion.js

const segmentacionModule = (() => {
    let moduleContainer = null;
    let currentProceso = null;

    function render() {
        if (!moduleContainer) {
            console.error('Segmentación: moduleContainer es null. No se puede renderizar.');
            return;
        }
        if (!currentProceso) {
            moduleContainer.innerHTML = '<p class="alert alert-warning">No se ha especificado un proceso para la segmentación.</p>';
            return;
        }

        moduleContainer.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Segmentación de Mercado para ${currentProceso.nombre || 'Nuevo Proceso'}</h5>
                </div>
                <div class="card-body">
                    <form id="segmentacion-form">
                        <div class="mb-3">
                            <label for="seg-mercado" class="form-label">Mercado</label>
                            <input type="text" class="form-control" id="seg-mercado" value="${currentProceso.segmentacion.mercado || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="seg-segmento" class="form-label">Segmento</label>
                            <input type="text" class="form-control" id="seg-segmento" value="${currentProceso.segmentacion.segmento || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="seg-proveedores-potenciales" class="form-label">Número de Proveedores Potenciales</label>
                            <input type="number" class="form-control" id="seg-proveedores-potenciales" value="${currentProceso.segmentacion.proveedoresPotenciales || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="seg-analisis-riesgos" class="form-label">Análisis de Riesgos</label>
                            <textarea class="form-control" id="seg-analisis-riesgos" rows="3">${currentProceso.segmentacion.analisisRiesgos || ''}</textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Segmentación</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners();
    }

    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#segmentacion-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Segmentación: Guardando datos de segmentación...');

                const updatedProceso = {
                    ...currentProceso,
                    segmentacion: {
                        mercado: document.getElementById('seg-mercado').value,
                        segmento: document.getElementById('seg-segmento').value,
                        proveedoresPotenciales: parseInt(document.getElementById('seg-proveedores-potenciales').value) || 0,
                        analisisRiesgos: document.getElementById('seg-analisis-riesgos').value
                    }
                };
                
                if (typeof appData !== 'undefined' && typeof appData.updateProcess === 'function') {
                    appData.updateProcess(updatedProceso);
                    alert('Datos de segmentación guardados exitosamente!');
                    currentProceso = appData.getProcess(currentProceso.id); // Actualizar el currentProceso localmente
                } else {
                    console.error('Segmentación: appData o appData.updateProcess no están disponibles.');
                    alert('Hubo un error al guardar los datos de segmentación.');
                }
            });
        }
    }

    return {
        init: (procesoId, containerElement) => {
            moduleContainer = containerElement;
            if (typeof appData === 'undefined') {
                console.error('Segmentación: appData no está definido al inicializar.');
                if (moduleContainer) {
                    moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles.</p>';
                }
                return;
            }
            currentProceso = appData.getProcess(procesoId);
            if (!currentProceso) {
                console.error('Segmentación: Proceso no encontrado con ID:', procesoId);
                if (moduleContainer) {
                    moduleContainer.innerHTML = `<p class="alert alert-warning">Proceso con ID "${procesoId}" no encontrado para el módulo de Segmentación.</p>`;
                }
                return;
            }
            console.log('Segmentación: init() llamado para proceso:', currentProceso);
            render();
        }
    };
})();
