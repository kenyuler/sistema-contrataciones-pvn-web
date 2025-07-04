// js/modules/area_usuaria.js

const areaUsuariaModule = (() => {
    let moduleContainer = null;
    let currentProceso = null;

    function render() {
        if (!moduleContainer) {
            console.error('Area Usuaria: moduleContainer es null. No se puede renderizar.');
            return;
        }
        if (!currentProceso) {
            moduleContainer.innerHTML = '<p class="alert alert-warning">No se ha especificado un proceso para el área usuaria.</p>';
            return;
        }

        const config = appData.getConfig();
        const areasResponsablesOptions = config.lists.areasResponsables.map(area => `<option value="${area}" ${currentProceso.areaUsuaria.responsable === area ? 'selected' : ''}>${area}</option>`).join('');

        // Extraer fecha para el campo de selección
        const fechaEntregaROM = currentProceso.areaUsuaria.fechaEntregaROM ? new Date(currentProceso.areaUsuaria.fechaEntregaROM) : null;

        moduleContainer.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Datos de Área Usuaria para ${currentProceso.nombre || 'Nuevo Proceso'}</h5>
                </div>
                <div class="card-body">
                    <form id="area-usuaria-form">
                        <div class="mb-3">
                            <label for="au-responsable" class="form-label">Responsable del Área Usuaria</label>
                            <select class="form-select" id="au-responsable" required>
                                <option value="">Seleccione Responsable</option>
                                ${areasResponsablesOptions}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="au-fecha-entrega-rom" class="form-label">Fecha de Entrega de Requerimiento (ROM)</label>
                            <input type="date" class="form-control" id="au-fecha-entrega-rom" value="${fechaEntregaROM ? fechaEntregaROM.toISOString().split('T')[0] : ''}">
                        </div>
                        <div class="mb-3">
                            <label for="au-observaciones" class="form-label">Observaciones</label>
                            <textarea class="form-control" id="au-observaciones" rows="3">${currentProceso.areaUsuaria.observaciones || ''}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="au-conformidad-rom" class="form-label">Conformidad con ROM</label>
                            <select class="form-select" id="au-conformidad-rom">
                                <option value="">Seleccione</option>
                                <option value="Conforme" ${currentProceso.areaUsuaria.conformidadROM === 'Conforme' ? 'selected' : ''}>Conforme</option>
                                <option value="Pendiente" ${currentProceso.areaUsuaria.conformidadROM === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                                <option value="Observado" ${currentProceso.areaUsuaria.conformidadROM === 'Observado' ? 'selected' : ''}>Observado</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Área Usuaria</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners();
    }

    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#area-usuaria-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Area Usuaria: Guardando datos del área usuaria...');

                const updatedProceso = {
                    ...currentProceso,
                    areaUsuaria: {
                        responsable: document.getElementById('au-responsable').value,
                        fechaEntregaROM: document.getElementById('au-fecha-entrega-rom').value,
                        observaciones: document.getElementById('au-observaciones').value,
                        conformidadROM: document.getElementById('au-conformidad-rom').value
                    }
                };
                
                if (typeof appData !== 'undefined' && typeof appData.updateProcess === 'function') {
                    appData.updateProcess(updatedProceso);
                    alert('Datos de área usuaria guardados exitosamente!');
                    currentProceso = appData.getProcess(currentProceso.id); // Actualizar el currentProceso localmente
                } else {
                    console.error('Area Usuaria: appData o appData.updateProcess no están disponibles.');
                    alert('Hubo un error al guardar los datos del área usuaria.');
                }
            });
        }
    }

    return {
        init: (procesoId, containerElement) => {
            moduleContainer = containerElement;
            if (typeof appData === 'undefined') {
                console.error('Area Usuaria: appData no está definido al inicializar.');
                if (moduleContainer) {
                    moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles.</p>';
                }
                return;
            }
            currentProceso = appData.getProcess(procesoId);
            if (!currentProceso) {
                console.error('Area Usuaria: Proceso no encontrado con ID:', procesoId);
                if (moduleContainer) {
                    moduleContainer.innerHTML = `<p class="alert alert-warning">Proceso con ID "${procesoId}" no encontrado para el módulo de Área Usuaria.</p>`;
                }
                return;
            }
            console.log('Area Usuaria: init() llamado para proceso:', currentProceso);
            render();
        }
    };
})();
