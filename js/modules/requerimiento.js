// js/modules/requerimiento.js

const requerimientoModule = (() => {
    let currentProcesoId = null;
    let moduleContainer = null;
    let requerimientoData = {}; // Para almacenar los datos del requerimiento de ESTE proceso

    /**
     * Inicializa el módulo de Requerimiento.
     * @param {string|null} procesoId - El ID del proceso actual.
     * @param {HTMLElement} containerElement - El elemento HTML donde se renderizará el contenido.
     * @param {object} initialData - Los datos iniciales específicos del requerimiento para este proceso.
     */
    function init(procesoId, containerElement, initialData = {}) {
        console.log('Requerimiento: init() llamado. Proceso ID:', procesoId, 'ContainerElement:', containerElement, 'Initial Data:', initialData);
        currentProcesoId = procesoId;
        moduleContainer = containerElement;
        requerimientoData = { ...initialData }; // Carga los datos existentes

        render();
    }

    /**
     * Renderiza el contenido HTML del módulo de Requerimiento.
     */
    function render() {
        if (!moduleContainer) {
            console.error('Requerimiento: El contenedor del módulo no está definido.');
            return;
        }

        moduleContainer.innerHTML = `
            <h4>Detalles del Requerimiento</h4>
            <p class="text-muted">${currentProcesoId && currentProcesoId !== 'nuevo' ? 'Editando proceso: ' + currentProcesoId : 'Creando nuevo requerimiento.'}</p>
            <form id="requerimientoForm">
                <div class="mb-3">
                    <label for="reqNombre" class="form-label">Nombre del Requerimiento</label>
                    <input type="text" class="form-control" id="reqNombre" value="${requerimientoData.nombre || ''}" required>
                </div>
                <div class="mb-3">
                    <label for="reqDescripcion" class="form-label">Descripción</label>
                    <textarea class="form-control" id="reqDescripcion" rows="3">${requerimientoData.descripcion || ''}</textarea>
                </div>
                <div class="mb-3">
                    <label for="reqFecha" class="form-label">Fecha Límite</label>
                    <input type="date" class="form-control" id="reqFecha" value="${requerimientoData.fechaLimite || ''}">
                </div>
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-circle me-2"></i>Guardar Requerimiento</button>
            </form>
        `;

        const requerimientoForm = moduleContainer.querySelector('#requerimientoForm');
        if (requerimientoForm) {
            requerimientoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveRequerimiento();
            });
        }
    }

    /**
     * Guarda los datos del formulario de Requerimiento y notifica al padre.
     */
    function saveRequerimiento() {
        const nombre = moduleContainer.querySelector('#reqNombre').value;
        const descripcion = moduleContainer.querySelector('#reqDescripcion').value;
        const fechaLimite = moduleContainer.querySelector('#reqFecha').value;

        // Validaciones básicas
        if (!nombre.trim()) {
            alert('El nombre del requerimiento es obligatorio.');
            return;
        }

        requerimientoData = {
            nombre: nombre,
            descripcion: descripcion,
            fechaLimite: fechaLimite
        };

        console.log('Requerimiento: Datos guardados internamente:', requerimientoData);
        alert('Datos de requerimiento guardados.');

        // ¡IMPORTANTE! Dispara un evento para notificar al módulo padre (seguimiento)
        // que los datos de requerimiento han sido actualizados.
        if (window.eventHandler) {
            window.eventHandler.trigger('requerimientoSaved', { 
                module: 'requerimiento', 
                procesoId: currentProcesoId, 
                data: requerimientoData 
            });
        }
    }

    return {
        init: init,
        getData: () => ({ ...requerimientoData }) // Método para obtener los datos actuales del módulo
    };
})();

window.requerimientoModule = requerimientoModule;