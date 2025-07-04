// js/modules/costos.js

const costosModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;
    let costosData = {};

    function init(procesoId, containerElement, initialData = {}) {
        console.log('Costos: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement, 'Initial Data:', initialData);
        currentProcesoId = procesoId;
        moduleContainer = containerElement;
        costosData = { ...initialData };
        render();
    }

    function render() {
        if (!moduleContainer) {
            console.error('Costos: El contenedor del módulo no está definido.');
            return;
        }
        moduleContainer.innerHTML = `
            <h4>Gestión de Costos</h4>
            <p class="text-muted">${currentProcesoId && currentProcesoId !== 'nuevo' ? 'Proceso: ' + currentProcesoId : 'Creando nuevo proceso.'}</p>
            <form id="costosForm">
                <div class="mb-3">
                    <label for="presupuestoEstimado" class="form-label">Presupuesto Estimado</label>
                    <input type="number" step="0.01" class="form-control" id="presupuestoEstimado" value="${costosData.presupuestoEstimado || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="moneda" class="form-label">Moneda</label>
                    <select class="form-select" id="moneda">
                        <option value="PEN" ${costosData.moneda === 'PEN' ? 'selected' : ''}>PEN (Soles)</option>
                        <option value="USD" ${costosData.moneda === 'USD' ? 'selected' : ''}>USD (Dólares)</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="fechaAprobacion" class="form-label">Fecha de Aprobación</label>
                    <input type="date" class="form-control" id="fechaAprobacion" value="${costosData.fechaAprobacion || ''}">
                </div>
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Guardar Costos</button>
            </form>
        `;

        const costosForm = moduleContainer.querySelector('#costosForm');
        if (costosForm) {
            costosForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveCostos();
            });
        }
    }

    function saveCostos() {
        const presupuestoEstimado = parseFloat(moduleContainer.querySelector('#presupuestoEstimado').value);
        const moneda = moduleContainer.querySelector('#moneda').value;
        const fechaAprobacion = moduleContainer.querySelector('#fechaAprobacion').value;

        if (isNaN(presupuestoEstimado) || presupuestoEstimado <= 0) {
            alert('El presupuesto estimado debe ser un número positivo.');
            return;
        }

        costosData = {
            presupuestoEstimado: presupuestoEstimado,
            moneda: moneda,
            fechaAprobacion: fechaAprobacion
        };

        console.log('Costos: Datos guardados internamente:', costosData);
        alert('Datos de costos guardados.');

        if (window.eventHandler) {
            window.eventHandler.trigger('costosSaved', { 
                module: 'costos', 
                procesoId: currentProcesoId, 
                data: costosData 
            });
        }
    }

    return {
        init: init,
        getData: () => ({ ...costosData })
    };
})();

window.costosModule = costosModule;