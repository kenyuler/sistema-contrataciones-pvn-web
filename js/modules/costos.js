// js/modules/costos.js

const costosModule = (() => {
    let moduleContainer = null;
    let currentProceso = null;

    function render() {
        if (!moduleContainer) {
            console.error('Costos: moduleContainer es null. No se puede renderizar.');
            return;
        }
        if (!currentProceso) {
            moduleContainer.innerHTML = '<p class="alert alert-warning">No se ha especificado un proceso para los costos.</p>';
            return;
        }

        const config = appData.getConfig();
        const monedasOptions = config.lists.monedas.map(moneda => `<option value="${moneda}" ${currentProceso.costos.moneda === moneda ? 'selected' : ''}>${moneda}</option>`).join('');

        moduleContainer.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Gestión de Costos para ${currentProceso.nombre || 'Nuevo Proceso'}</h5>
                </div>
                <div class="card-body">
                    <form id="costos-form">
                        <div class="mb-3">
                            <label for="costo-moneda" class="form-label">Moneda</label>
                            <select class="form-select" id="costo-moneda">
                                <option value="">Seleccione Moneda</option>
                                ${monedasOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="costo-presupuesto-estimado" class="form-label">Presupuesto Estimado</label>
                            <input type="number" step="0.01" class="form-control" id="costo-presupuesto-estimado" value="${currentProceso.costos.presupuestoEstimado || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="costo-real" class="form-label">Costo Real</label>
                            <input type="number" step="0.01" class="form-control" id="costo-real" value="${currentProceso.costos.costoReal || ''}">
                        </div>
                        <div class="mb-3">
                            <label for="costo-fuente-financiamiento" class="form-label">Fuente de Financiamiento</label>
                            <input type="text" class="form-control" id="costo-fuente-financiamiento" value="${currentProceso.costos.fuenteFinanciamiento || ''}">
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Costos</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners();
    }

    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#costos-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Costos: Guardando datos de costos...');

                const updatedProceso = {
                    ...currentProceso,
                    costos: {
                        moneda: document.getElementById('costo-moneda').value,
                        presupuestoEstimado: parseFloat(document.getElementById('costo-presupuesto-estimado').value) || 0,
                        costoReal: parseFloat(document.getElementById('costo-real').value) || 0,
                        fuenteFinanciamiento: document.getElementById('costo-fuente-financiamiento').value
                    }
                };
                
                if (typeof appData !== 'undefined' && typeof appData.updateProcess === 'function') {
                    appData.updateProcess(updatedProceso);
                    alert('Datos de costos guardados exitosamente!');
                    currentProceso = appData.getProcess(currentProceso.id); // Actualizar el currentProceso localmente
                } else {
                    console.error('Costos: appData o appData.updateProcess no están disponibles.');
                    alert('Hubo un error al guardar los datos de costos.');
                }
            });
        }
    }

    return {
        init: (procesoId, containerElement) => {
            moduleContainer = containerElement;
            if (typeof appData === 'undefined') {
                console.error('Costos: appData no está definido al inicializar.');
                if (moduleContainer) {
                    moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles.</p>';
                }
                return;
            }
            currentProceso = appData.getProcess(procesoId);
            if (!currentProceso) {
                console.error('Costos: Proceso no encontrado con ID:', procesoId);
                if (moduleContainer) {
                    moduleContainer.innerHTML = `<p class="alert alert-warning">Proceso con ID "${procesoId}" no encontrado para el módulo de Costos.</p>`;
                }
                return;
            }
            console.log('Costos: init() llamado para proceso:', currentProceso);
            render();
        }
    };
})();
