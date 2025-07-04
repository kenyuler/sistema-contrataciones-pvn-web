// js/modules/area_usuaria.js

const areaUsuariaModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;
    let areaUsuariaData = {};

    function init(procesoId, containerElement, initialData = {}) {
        console.log('Area Usuaria: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement, 'Initial Data:', initialData);
        currentProcesoId = procesoId;
        moduleContainer = containerElement;
        areaUsuariaData = { ...initialData };
        render();
    }

    function render() {
        if (!moduleContainer) {
            console.error('Area Usuaria: El contenedor del módulo no está definido.');
            return;
        }
        moduleContainer.innerHTML = `
            <h4>Información del Área Usuaria</h4>
            <p class="text-muted">${currentProcesoId && currentProcesoId !== 'nuevo' ? 'Proceso: ' + currentProcesoId : 'Creando nuevo proceso.'}</p>
            <form id="areaUsuariaForm">
                <div class="mb-3">
                    <label for="areaNombre" class="form-label">Nombre del Área</label>
                    <input type="text" class="form-control" id="areaNombre" value="${areaUsuariaData.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="areaContacto" class="form-label">Persona de Contacto</label>
                    <input type="text" class="form-control" id="areaContacto" value="${areaUsuariaData.contacto || ''}">
                </div>
                <div class="mb-3">
                    <label for="areaEmail" class="form-label">Email de Contacto</label>
                    <input type="email" class="form-control" id="areaEmail" value="${areaUsuariaData.email || ''}">
                </div>
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Guardar Área Usuaria</button>
            </form>
        `;

        const areaUsuariaForm = moduleContainer.querySelector('#areaUsuariaForm');
        if (areaUsuariaForm) {
            areaUsuariaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveAreaUsuaria();
            });
        }
    }

    function saveAreaUsuaria() {
        const nombre = moduleContainer.querySelector('#areaNombre').value;
        const contacto = moduleContainer.querySelector('#areaContacto').value;
        const email = moduleContainer.querySelector('#areaEmail').value;

        if (!nombre.trim()) {
            alert('El nombre del área usuaria es obligatorio.');
            return;
        }

        areaUsuariaData = {
            nombre: nombre,
            contacto: contacto,
            email: email
        };

        console.log('Area Usuaria: Datos guardados internamente:', areaUsuariaData);
        alert('Datos de área usuaria guardados.');

        if (window.eventHandler) {
            window.eventHandler.trigger('areaUsuariaSaved', { 
                module: 'area-usuaria', 
                procesoId: currentProcesoId, 
                data: areaUsuariaData 
            });
        }
    }

    return {
        init: init,
        getData: () => ({ ...areaUsuariaData })
    };
})();

window.areaUsuariaModule = areaUsuariaModule;