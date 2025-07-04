// js/modules/settings.js

const settingsModule = (() => {
    let moduleContainer = null; // Variable para almacenar el contenedor HTML

    /**
     * Renderiza la interfaz de usuario del módulo de configuración.
     */
    function render() {
        // Validación crítica: Asegurarse de que el contenedor existe antes de intentar manipularlo
        if (!moduleContainer) {
            console.error('Settings: moduleContainer es null o undefined en render(). El módulo no se inicializó correctamente.');
            return; // Salir de la función si no hay un contenedor válido
        }

        // Validación: Asegurarse de que appData está disponible
        if (typeof appData === 'undefined') {
            console.error('Settings: appData no está definido. No se puede cargar la configuración.');
            moduleContainer.innerHTML = '<p class="alert alert-danger">Error: Datos de configuración no disponibles. Por favor, recarga la página.</p>';
            return;
        }

        const currentConfig = appData.getConfig(); // Obtener la configuración actual

        // HTML para el módulo de configuración
        moduleContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0 text-primary">Configuración de la Aplicación</h2>
            </div>
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Ajustes Generales</h5>
                </div>
                <div class="card-body">
                    <form id="settings-form">
                        <div class="mb-3">
                            <label for="appTitle" class="form-label">Título de la Aplicación</label>
                            <input type="text" class="form-control" id="appTitle" placeholder="Ej: Sistema de Contrataciones" value="${currentConfig.settings.appTitle || ''}">
                        </div>
                        <hr>
                        <h5>Listas Personalizables</h5>
                        <p class="text-muted">Edita los valores separados por comas para cada tipo de lista.</p>

                        <div class="mb-3">
                            <label for="tiposContratacion" class="form-label">Tipos de Contratación</label>
                            <textarea class="form-control" id="tiposContratacion" rows="3">${currentConfig.lists.tiposContratacion.join(', ')}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="estadosProceso" class="form-label">Estados de Proceso</label>
                            <textarea class="form-control" id="estadosProceso" rows="3">${currentConfig.lists.estadosProceso.join(', ')}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="tiposRequerimiento" class="form-label">Tipos de Requerimiento</label>
                            <textarea class="form-control" id="tiposRequerimiento" rows="3">${currentConfig.lists.tiposRequerimiento.join(', ')}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="monedas" class="form-label">Monedas</label>
                            <textarea class="form-control" id="monedas" rows="3">${currentConfig.lists.monedas.join(', ')}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="areasResponsables" class="form-label">Áreas Responsables</label>
                            <textarea class="form-control" id="areasResponsables" rows="3">${currentConfig.lists.areasResponsables.join(', ')}</textarea>
                        </div>
                        <div class="mb-3">
                            <label for="normasAplicables" class="form-label">Normas Aplicables</label>
                            <textarea class="form-control" id="normasAplicables" rows="3">${currentConfig.lists.normasAplicables.join(', ')}</textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary"><i class="bi bi-save me-2"></i>Guardar Configuración</button>
                    </form>
                </div>
            </div>
        `;
        setupEventListeners(); // Configurar los listeners después de que el HTML ha sido renderizado
    }

    /**
     * Configura los event listeners para los elementos del formulario de configuración.
     */
    function setupEventListeners() {
        if (!moduleContainer) return;

        const form = moduleContainer.querySelector('#settings-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault(); // Prevenir el envío del formulario por defecto
                console.log('Settings: Guardando configuración...');

                // Recolectar los nuevos valores del formulario
                const newConfig = {
                    settings: {
                        appTitle: document.getElementById('appTitle').value // Obtener el título
                    },
                    lists: {
                        tiposContratacion: document.getElementById('tiposContratacion').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                        estadosProceso: document.getElementById('estadosProceso').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                        tiposRequerimiento: document.getElementById('tiposRequerimiento').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                        monedas: document.getElementById('monedas').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                        areasResponsables: document.getElementById('areasResponsables').value.split(',').map(item => item.trim()).filter(item => item !== ''),
                        normasAplicables: document.getElementById('normasAplicables').value.split(',').map(item => item.trim()).filter(item => item !== '')
                    }
                };

                // Actualizar la configuración en appData
                if (typeof appData !== 'undefined' && typeof appData.updateConfig === 'function') {
                    appData.updateConfig(newConfig);
                    alert('Configuración guardada exitosamente!');
                    // Opcional: recargar el dashboard o settings para aplicar los cambios visualmente
                    if (typeof app !== 'undefined' && typeof app.loadModule === 'function') {
                        app.loadModule('dashboard'); // Vuelve al dashboard después de guardar
                    } else {
                        console.error('Settings: app.loadModule no está disponible para recargar el dashboard.');
                    }
                } else {
                    console.error('Settings: appData o appData.updateConfig no están disponibles.');
                    alert('Error al guardar la configuración: Datos de la aplicación no disponibles.');
                }
            });
        }
    }

    return {
        /**
         * Inicializa el módulo de configuración.
         * @param {string|null} id - ID del proceso (no utilizado en settings, pero parte de la firma esperada).
         * @param {HTMLElement} containerElement - El elemento DOM donde el módulo debe renderizar su contenido.
         */
        init: (id, containerElement) => {
            moduleContainer = containerElement; // Asignar el contenedor proporcionado por app.js
            console.log('Settings: init() llamado. ContainerElement:', containerElement);
            
            // Verificación explícita del contenedor después de la asignación
            if (!moduleContainer) {
                console.error('Settings: Error - containerElement es null o undefined al inicializar el módulo. No se puede renderizar.');
                return; // No intentar renderizar si el contenedor no es válido
            }
            render(); // Llamar a render para mostrar la UI
        }
    };
})();
