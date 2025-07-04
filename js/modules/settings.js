// js/modules/settings.js

const settingsModule = (() => {
    let moduleContainer = null;
    let currentTab = 'general'; // Para recordar la pestaña activa

    function render() {
        let html = `
            <div class="card mt-3">
                <div class="card-header bg-primary text-white">
                    <h3 class="mb-0">Configuración del Sistema</h3>
                </div>
                <div class="card-body">
                    <ul class="nav nav-tabs mb-3" id="settingsTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${currentTab === 'general' ? 'active' : ''}" id="general-tab" data-bs-toggle="tab" data-bs-target="#general" type="button" role="tab" aria-controls="general" aria-selected="${currentTab === 'general' ? 'true' : 'false'}">General</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${currentTab === 'tipos-contratacion' ? 'active' : ''}" id="tipos-contratacion-tab" data-bs-toggle="tab" data-bs-target="#tipos-contratacion" type="button" role="tab" aria-controls="tipos-contratacion" aria-selected="${currentTab === 'tipos-contratacion' ? 'true' : 'false'}">Tipos de Contratación</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${currentTab === 'estados-proceso' ? 'active' : ''}" id="estados-proceso-tab" data-bs-toggle="tab" data-bs-target="#estados-proceso" type="button" role="tab" aria-controls="estados-proceso" aria-selected="${currentTab === 'estados-proceso' ? 'true' : 'false'}">Estados del Proceso</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${currentTab === 'normas-aplicables' ? 'active' : ''}" id="normas-aplicables-tab" data-bs-toggle="tab" data-bs-target="#normas-aplicables" type="button" role="tab" aria-controls="normas-aplicables" aria-selected="${currentTab === 'normas-aplicables' ? 'true' : 'false'}">Normas Aplicables</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link ${currentTab === 'data-management' ? 'active' : ''}" id="data-management-tab" data-bs-toggle="tab" data-bs-target="#data-management" type="button" role="tab" aria-controls="data-management" aria-selected="${currentTab === 'data-management' ? 'true' : 'false'}">Gestión de Datos</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="settingsTabsContent">
                        <div class="tab-pane fade ${currentTab === 'general' ? 'show active' : ''}" id="general" role="tabpanel" aria-labelledby="general-tab">
                            <h5>Ajustes Generales</h5>
                            <div class="mb-3">
                                <label for="appName" class="form-label">Nombre de la Aplicación:</label>
                                <input type="text" class="form-control" id="appName" value="${appData.getConfig().appName || ''}">
                            </div>
                            <button class="btn btn-primary" id="saveGeneralSettings">Guardar Ajustes</button>
                        </div>

                        <div class="tab-pane fade ${currentTab === 'tipos-contratacion' ? 'show active' : ''}" id="tipos-contratacion" role="tabpanel" aria-labelledby="tipos-contratacion-tab">
                            <h5>Tipos de Contratación</h5>
                            <ul class="list-group mb-3" id="list-tipos-contratacion">
                                </ul>
                            <div class="input-group">
                                <input type="text" class="form-control" id="newTipoContratacion" placeholder="Nuevo tipo de contratación">
                                <button class="btn btn-outline-primary" type="button" id="addTipoContratacion">Agregar</button>
                            </div>
                        </div>

                        <div class="tab-pane fade ${currentTab === 'estados-proceso' ? 'show active' : ''}" id="estados-proceso" role="tabpanel" aria-labelledby="estados-proceso-tab">
                            <h5>Estados del Proceso</h5>
                            <ul class="list-group mb-3" id="list-estados-proceso">
                                </ul>
                            <div class="input-group">
                                <input type="text" class="form-control" id="newEstadoProceso" placeholder="Nuevo estado de proceso">
                                <button class="btn btn-outline-primary" type="button" id="addEstadoProceso">Agregar</button>
                            </div>
                        </div>

                        <div class="tab-pane fade ${currentTab === 'normas-aplicables' ? 'show active' : ''}" id="normas-aplicables" role="tabpanel" aria-labelledby="normas-aplicables-tab">
                            <h5>Normas Aplicables</h5>
                            <ul class="list-group mb-3" id="list-normas-aplicables">
                                </ul>
                            <div class="input-group">
                                <input type="text" class="form-control" id="newNormaAplicable" placeholder="Nueva norma aplicable">
                                <button class="btn btn-outline-primary" type="button" id="addNormaAplicable">Agregar</button>
                            </div>
                        </div>

                        <div class="tab-pane fade ${currentTab === 'data-management' ? 'show active' : ''}" id="data-management" role="tabpanel" aria-labelledby="data-management-tab">
                            <h5>Gestión de Datos</h5>
                            <div class="mb-3">
                                <button class="btn btn-warning" id="exportData">Exportar Datos (JSON)</button>
                                <input type="file" class="form-control mt-2" id="importDataFile" accept=".json">
                                <button class="btn btn-info mt-2" id="importData">Importar Datos (JSON)</button>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-danger" id="clearAllData">Borrar Todos los Datos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        moduleContainer.innerHTML = html;

        // Add event listeners for tab switching
        moduleContainer.querySelectorAll('.nav-link').forEach(tabButton => {
            tabButton.addEventListener('shown.bs.tab', function (event) {
                currentTab = event.target.id.replace('-tab', '');
                renderListItems(); // Re-render lists when tab changes
            });
        });

        // Initial render of list items for the active tab
        renderListItems();

        // General Settings
        moduleContainer.querySelector('#saveGeneralSettings').addEventListener('click', saveGeneralSettings);

        // List Management for Tipos de Contratacion
        moduleContainer.querySelector('#addTipoContratacion').addEventListener('click', () => addListItem('tiposContratacion', 'newTipoContratacion', 'list-tipos-contratacion'));
        moduleContainer.querySelector('#list-tipos-contratacion').addEventListener('click', (e) => removeListItem(e, 'tiposContratacion', 'list-tipos-contratacion'));

        // List Management for Estados del Proceso
        moduleContainer.querySelector('#addEstadoProceso').addEventListener('click', () => addListItem('estadosProceso', 'newEstadoProceso', 'list-estados-proceso'));
        moduleContainer.querySelector('#list-estados-proceso').addEventListener('click', (e) => removeListItem(e, 'estadosProceso', 'list-estados-proceso'));

        // List Management for Normas Aplicables
        moduleContainer.querySelector('#addNormaAplicable').addEventListener('click', () => addListItem('normasAplicables', 'newNormaAplicable', 'list-normas-aplicables'));
        moduleContainer.querySelector('#list-normas-aplicables').addEventListener('click', (e) => removeListItem(e, 'normasAplicables', 'list-normas-aplicables'));
        
        // Data Management
        moduleContainer.querySelector('#exportData').addEventListener('click', exportData);
        moduleContainer.querySelector('#importData').addEventListener('click', importData);
        moduleContainer.querySelector('#clearAllData').addEventListener('click', clearAllData);
    }

    function renderListItems() {
        renderList('tiposContratacion', 'list-tipos-contratacion');
        renderList('estadosProceso', 'list-estados-proceso');
        renderList('normasAplicables', 'list-normas-aplicables');
    }

    function renderList(listName, ulId) {
        const ulElement = moduleContainer.querySelector(`#${ulId}`);
        if (!ulElement) return;

        const items = appData.getConfig().lists[listName] || [];
        ulElement.innerHTML = '';
        if (items.length === 0) {
            ulElement.innerHTML = `<li class="list-group-item text-muted">No hay elementos en esta lista.</li>`;
            return;
        }
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                ${item}
                <button type="button" class="btn btn-danger btn-sm remove-item-btn" data-item="${item}">
                    <i class="bi bi-x"></i>
                </button>
            `;
            ulElement.appendChild(li);
        });
    }

    function addListItem(listName, inputId, ulId) {
        const inputElement = moduleContainer.querySelector(`#${inputId}`);
        const newItem = inputElement.value.trim();
        if (newItem) {
            appData.addConfigListItem(listName, newItem);
            inputElement.value = '';
            renderList(listName, ulId);
            alert('Elemento agregado.');
        } else {
            alert('Por favor, ingresa un valor.');
        }
    }

    function removeListItem(event, listName, ulId) {
        if (event.target.classList.contains('remove-item-btn') || event.target.closest('.remove-item-btn')) {
            const button = event.target.closest('.remove-item-btn');
            const itemToRemove = button.dataset.item;
            if (confirm(`¿Estás seguro de que quieres eliminar "${itemToRemove}" de la lista?`)) {
                appData.removeConfigListItem(listName, itemToRemove);
                renderList(listName, ulId);
                alert('Elemento eliminado.');
            }
        }
    }

    function saveGeneralSettings() {
        const appName = moduleContainer.querySelector('#appName').value;
        appData.setConfig({ appName: appName });
        if (typeof app !== 'undefined' && typeof app.updateNavBar === 'function') {
            app.updateNavBar(); // Actualizar el nombre en la barra de navegación
        }
        alert('Ajustes generales guardados.');
    }

    function exportData() {
        const data = appData.getAllData();
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sistema_contrataciones_data_${new Date().toISOString().slice(0,10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Datos exportados exitosamente.');
    }

    function importData() {
        const fileInput = moduleContainer.querySelector('#importDataFile');
        const file = fileInput.files[0];

        if (!file) {
            alert('Por favor, selecciona un archivo JSON para importar.');
            return;
        }

        if (!confirm('¿Estás seguro de que quieres importar datos? Esto SOBRESCRIBIRÁ tus datos actuales.')) {
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                const success = appData.importAllData(importedData);
                if (success) {
                    alert('Datos importados exitosamente. Recargando la aplicación...');
                    window.location.reload(); // Recargar la página para aplicar los nuevos datos
                } else {
                    alert('Error: La estructura del archivo JSON importado no es válida.');
                }
            } catch (error) {
                alert('Error al importar los datos: ' + error.message + '. Asegúrate de que el archivo es un JSON válido.');
                console.error('Error importing data:', error);
            }
        };
        reader.onerror = function(e) {
            alert('Error al leer el archivo.');
            console.error('File reading error:', e);
        };
        reader.readAsText(file);
    }

    function clearAllData() {
        if (confirm('¿Estás ABSOLUTAMENTE seguro de que quieres borrar TODOS los datos? Esta acción no se puede deshacer.')) {
            appData.clearAllData();
            alert('Todos los datos han sido borrados. La aplicación se recargará.');
            window.location.reload(); // Recargar la página
        }
    }

    return {
        init: (containerElement) => {
            moduleContainer = containerElement;
            render();
        }
    };
})();