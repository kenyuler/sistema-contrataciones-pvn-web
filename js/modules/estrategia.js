// js/modules/estrategia.js

const estrategiaModule = (() => {
    let moduleContainer = null;
    let currentProceso = null;

    function render() {
        if (!moduleContainer) {
            console.error('Estrategia: moduleContainer es null. No se puede renderizar.');
            return;
        }
        if (!currentProceso) {
            moduleContainer.innerHTML = '<p class="alert alert-warning">No se ha especificado un proceso para la estrategia.</p>';
            return;
        }

        const config = appData.getConfig();
        const tiposContratacionOptions = config.lists.tiposContratacion.map(tipo => `<option value="${tipo}" ${currentProceso.estrategia.tipoProcedimiento === tipo ? 'selected' : ''}>${tipo}</option>`).join('');
        // Asumiendo que 'modalidadSeleccion' podría usar los mismos tipos o tener una lista propia si se define.
        // Por ahora, usaremos tiposContratacion como ejemplo. Idealmente, tendrías otra lista en appData.
        const modalidadesSeleccionOptions = [
            'Licitación Pública',
            'Concurso Público',
            'Adjudicación Simplificada',
            'Selección de Consultores',
            'Contratación Directa',
            'Comparación de Precios',
            'Subasta Inversa Electrónica'
        ].map(modalidad => `<option value="${modalidad}" ${currentProceso.estrategia.modalidadSeleccion === modalidad ? 'selected' : ''}>${modalidad}</option>`).join('');


        // Generar filas para el cronograma
        const cronogramaRows = (currentProceso.estrategia.cronograma || []).map((item, index) => `
            <tr data-index="${index}">
                <td><input type="text" class="form-control cronograma-etapa" value="${item.etapa || ''}"></td>
                <td><input type="date" class="form-control cronograma-fecha" value="${item.fecha || ''}"></td>
                <td><button type="button" class="btn btn-danger btn-sm remove-cronograma-item"><i class="bi bi-x-circle"></i></button></td>
            </tr>
        `).join('');


        moduleContainer.innerHTML = `
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Estrategia de Contratación para ${currentProceso.nombre || 'Nuevo Proceso'}</h5>
                </div>
                <div class="card-body">
                    <form id="estrategia-form">
                        <div class="mb-3">
                            <label for="est-tipo-procedimiento" class="form-label">Tipo de Procedimiento</label>
                            <select class="form-select" id="est-tipo-procedimiento">
                                <option value="">Seleccione Tipo</option>
                                ${tiposContratacionOptions} 
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="est-modalidad-seleccion" class="form-label">Modalidad de Selección</label>
                            <select class="form-select" id="est-modalidad-seleccion">
                                <option value="">Seleccione Modalidad</option>
                                ${modalidadesSeleccionOptions}
                            </select>
                        </div>

                        <hr>
                        <h5>Cronograma</h5>
                        <div class="table-responsive mb-3">
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Etapa</th>
                                        <th>Fecha</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="cronograma-table-body">
                                    ${cronogramaRows}
                                </tbody>
                            </table>
                        </div>
                        <button type="button" class="btn btn-secondary mb-3" id="add-cronograma-item"><i class="bi bi-plus-circle me-2"></i>Añadir Etapa</button>

                        <div class="mb-3">
                            <label for="est-observaciones" class="form-label">Observaciones</label>
                            <textarea class="form-control" id="est-observaciones" rows="3">${currentProceso.estrategia.observaciones || ''}</textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Estrategia</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners();
    }

    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#estrategia-form');
        const cronogramaTableBody = moduleContainer.querySelector('#cronograma-table-body');
        const addCronogramaBtn = moduleContainer.querySelector('#add-cronograma-item');

        // Función para añadir una nueva fila al cronograma
        if (addCronogramaBtn && cronogramaTableBody) {
            addCronogramaBtn.addEventListener('click', () => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td><input type="text" class="form-control cronograma-etapa" value=""></td>
                    <td><input type="date" class="form-control cronograma-fecha" value=""></td>
                    <td><button type="button" class="btn btn-danger btn-sm remove-cronograma-item"><i class="bi bi-x-circle"></i></button></td>
                `;
                cronogramaTableBody.appendChild(newRow);
                setupRemoveCronogramaListeners(); // Re-aplicar listeners a los nuevos botones
            });
        }

        // Función para configurar listeners de eliminar en los elementos del cronograma
        function setupRemoveCronogramaListeners() {
            moduleContainer.querySelectorAll('.remove-cronograma-item').forEach(button => {
                button.onclick = (e) => { // Usar onclick para evitar añadir múltiples listeners
                    e.target.closest('tr').remove();
                };
            });
        }
        setupRemoveCronogramaListeners(); // Llamar al inicio para los items existentes

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Estrategia: Guardando datos de estrategia...');

                // Recolectar datos del cronograma
                const cronograma = [];
                moduleContainer.querySelectorAll('#cronograma-table-body tr').forEach(row => {
                    const etapa = row.querySelector('.cronograma-etapa').value;
                    const fecha = row.querySelector('.cronograma-fecha').value;
                    if (etapa && fecha) { // Solo añadir si ambos campos tienen valor
                        cronograma.push({ etapa, fecha });
                    }
                });

                const updatedProceso = {
                    ...currentProceso,
                    estrategia: {
                        tipoProcedimiento: document.getElementById('est-tipo-procedimiento').value,
                        modalidadSeleccion: document.getElementById('est-modalidad-seleccion').value,
                        cronograma: cronograma,
                        observaciones: document.getElementById('est-observaciones').value
                    }
                };
                
                if (typeof appData !== 'undefined' && typeof appData.updateProcess === 'function') {
                    appData.updateProcess(updatedProceso);
                    alert('Datos de estrategia guardados exitosamente!');
                    currentProceso = appData.getProcess(currentProceso.id); // Actualizar el currentProceso localmente
                } else {
                    console.error('Estrategia: appData o appData.updateProcess no están disponibles.');
                    alert('Hubo un error al guardar los datos de estrategia.');
                }
            });
        }
    }

    return {
        init: (procesoId, containerElement) => {
            moduleContainer = containerElement;
            if (typeof appData === 'undefined') {
                console.error('Estrategia: appData no está definido al inicializar.');
                if (moduleContainer) {
                    moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de la aplicación no disponibles.</p>';
                }
                return;
            }
            currentProceso = appData.getProcess(procesoId);
            if (!currentProceso) {
                console.error('Estrategia: Proceso no encontrado con ID:', procesoId);
                if (moduleContainer) {
                    moduleContainer.innerHTML = `<p class="alert alert-warning">Proceso con ID "${procesoId}" no encontrado para el módulo de Estrategia.</p>`;
                }
                return;
            }
            console.log('Estrategia: init() llamado para proceso:', currentProceso);
            render();
        }
    };
})();
