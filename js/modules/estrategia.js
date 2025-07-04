// js/modules/estrategia.js

const estrategiaModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;
    let estrategiaData = {};

    function init(procesoId, containerElement, initialData = {}) {
        console.log('Estrategia: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement, 'Initial Data:', initialData);
        currentProcesoId = procesoId;
        moduleContainer = containerElement;
        estrategiaData = { ...initialData };
        render();
    }

    function render() {
        if (!moduleContainer) {
            console.error('Estrategia: El contenedor del módulo no está definido.');
            return;
        }
        moduleContainer.innerHTML = `
            <h4>Estrategia de Contratación</h4>
            <p class="text-muted">${currentProcesoId && currentProcesoId !== 'nuevo' ? 'Proceso: ' + currentProcesoId : 'Creando nuevo proceso.'}</p>
            <form id="estrategiaForm">
                <div class="mb-3">
                    <label for="tipoSeleccion" class="form-label">Tipo de Selección</label>
                    <select class="form-select" id="tipoSeleccion">
                        <option value="">Seleccione...</option>
                        <option value="licitacion" ${estrategiaData.tipoSeleccion === 'licitacion' ? 'selected' : ''}>Licitación Pública</option>
                        <option value="concurso" ${estrategiaData.tipoSeleccion === 'concurso' ? 'selected' : ''}>Concurso Público</option>
                        <option value="simplificada" ${estrategiaData.tipoSeleccion === 'simplificada' ? 'selected' : ''}>Adjudicación Simplificada</option>
                        <option value="directa" ${estrategiaData.tipoSeleccion === 'directa' ? 'selected' : ''}>Contratación Directa</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label for="plazoEjecucion" class="form-label">Plazo de Ejecución (días)</label>
                    <input type="number" class="form-control" id="plazoEjecucion" value="${estrategiaData.plazoEjecucion || ''}">
                </div>
                <div class="mb-3">
                    <label for="observaciones" class="form-label">Observaciones</label>
                    <textarea class="form-control" id="observaciones" rows="3">${estrategiaData.observaciones || ''}</textarea>
                </div>
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Guardar Estrategia</button>
            </form>
        `;

        const estrategiaForm = moduleContainer.querySelector('#estrategiaForm');
        if (estrategiaForm) {
            estrategiaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveEstrategia();
            });
        }
    }

    function saveEstrategia() {
        const tipoSeleccion = moduleContainer.querySelector('#tipoSeleccion').value;
        const plazoEjecucion = parseInt(moduleContainer.querySelector('#plazoEjecucion').value, 10);
        const observaciones = moduleContainer.querySelector('#observaciones').value;

        if (!tipoSeleccion.trim()) {
            alert('El tipo de selección es obligatorio.');
            return;
        }
        if (isNaN(plazoEjecucion) || plazoEjecucion < 0) {
            alert('El plazo de ejecución debe ser un número válido de días.');
            return;
        }

        estrategiaData = {
            tipoSeleccion: tipoSeleccion,
            plazoEjecucion: plazoEjecucion,
            observaciones: observaciones
        };

        console.log('Estrategia: Datos guardados internamente:', estrategiaData);
        alert('Datos de estrategia guardados.');

        if (window.eventHandler) {
            window.eventHandler.trigger('estrategiaSaved', { 
                module: 'estrategia', 
                procesoId: currentProcesoId, 
                data: estrategiaData 
            });
        }
    }

    return {
        init: init,
        getData: () => ({ ...estrategiaData })
    };
})();

window.estrategiaModule = estrategiaModule;