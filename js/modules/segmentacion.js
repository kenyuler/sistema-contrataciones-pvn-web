// js/modules/segmentacion.js

const segmentacionModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;
    let segmentacionData = {};

    function init(procesoId, containerElement, initialData = {}) {
        console.log('Segmentacion: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement, 'Initial Data:', initialData);
        currentProcesoId = procesoId;
        moduleContainer = containerElement;
        segmentacionData = { ...initialData };
        render();
    }

    function render() {
        if (!moduleContainer) {
            console.error('Segmentacion: El contenedor del módulo no está definido.');
            return;
        }
        moduleContainer.innerHTML = `
            <h4>Segmentación de Contrato</h4>
            <p class="text-muted">${currentProcesoId && currentProcesoId !== 'nuevo' ? 'Proceso: ' + currentProcesoId : 'Creando nuevo proceso.'}</p>
            <form id="segmentacionForm">
                <div class="mb-3">
                    <label for="tipoContrato" class="form-label">Tipo de Contrato</label>
                    <select class="form-select" id="tipoContrato">
                        <option value="">Seleccione...</option>
                        <option value="bienes" ${segmentacionData.tipoContrato === 'bienes' ? 'selected' : ''}>Bienes</option>
                        <option value="servicios" ${segmentacionData.tipoContrato === 'servicios' ? 'selected' : ''}>Servicios</option>
                        <option value="obras" ${segmentacionData.tipoContrato === 'obras' ? 'selected' : ''}>Obras</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="modalidad" class="form-label">Modalidad</label>
                    <input type="text" class="form-control" id="modalidad" value="${segmentacionData.modalidad || ''}">
                </div>
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Guardar Segmentación</button>
            </form>
        `;

        const segmentacionForm = moduleContainer.querySelector('#segmentacionForm');
        if (segmentacionForm) {
            segmentacionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveSegmentacion();
            });
        }
    }

    function saveSegmentacion() {
        const tipoContrato = moduleContainer.querySelector('#tipoContrato').value;
        const modalidad = moduleContainer.querySelector('#modalidad').value;

        if (!tipoContrato.trim()) {
            alert('El tipo de contrato es obligatorio.');
            return;
        }

        segmentacionData = {
            tipoContrato: tipoContrato,
            modalidad: modalidad
        };

        console.log('Segmentacion: Datos guardados internamente:', segmentacionData);
        alert('Datos de segmentación guardados.');

        if (window.eventHandler) {
            window.eventHandler.trigger('segmentacionSaved', { 
                module: 'segmentacion', 
                procesoId: currentProcesoId, 
                data: segmentacionData 
            });
        }
    }

    return {
        init: init,
        getData: () => ({ ...segmentacionData })
    };
})();

window.segmentacionModule = segmentacionModule;