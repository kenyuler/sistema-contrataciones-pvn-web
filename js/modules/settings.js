// js/modules/settings.js

const settingsModule = (() => {
    let moduleContainer = null;

    function init(procesoId, containerElement) {
        console.log('Settings: init() llamado. ContainerElement:', containerElement);
        moduleContainer = containerElement;
        render();
    }

    function render() {
        if (!moduleContainer) {
            console.error('Settings: El contenedor del módulo no está definido.');
            return;
        }

        const currentConfig = window.appData.getConfig().settings; // Obtener configuración actual

        moduleContainer.innerHTML = `
            <h2><i class="bi bi-gear me-2"></i>Configuración de la Aplicación</h2>
            <form id="settingsForm">
                <div class="mb-3">
                    <label for="appTitleInput" class="form-label">Título de la Aplicación</label>
                    <input type="text" class="form-control" id="appTitleInput" value="${currentConfig.appTitle || ''}">
                </div>
                <div class="mb-3">
                    <label for="itemsPerPageInput" class="form-label">Elementos por página (tablas)</label>
                    <input type="number" class="form-control" id="itemsPerPageInput" value="${currentConfig.itemsPerPage || 10}" min="1">
                </div>
                <div class="mb-3">
                    <label for="dateFormatInput" class="form-label">Formato de Fecha</label>
                    <input type="text" class="form-control" id="dateFormatInput" value="${currentConfig.dateFormat || 'DD/MM/YYYY'}">
                    <small class="form-text text-muted">Ejemplo: DD/MM/YYYY, YYYY-MM-DD</small>
                </div>
                <div class="form-check mb-3">
                    <input class="form-check-input" type="checkbox" id="enableNotificationsCheckbox" ${currentConfig.enableNotifications ? 'checked' : ''}>
                    <label class="form-check-label" for="enableNotificationsCheckbox">
                        Habilitar Notificaciones
                    </label>
                </div>
                <button type="submit" class="btn btn-success"><i class="bi bi-save me-2"></i>Guardar Configuración</button>
                <button type="button" class="btn btn-secondary ms-2" id="resetSettingsBtn"><i class="bi bi-arrow-counterclockwise me-2"></i>Restablecer Valores</button>
            </form>
        `;

        const settingsForm = moduleContainer.querySelector('#settingsForm');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                saveSettings();
            });
        }

        const resetSettingsBtn = moduleContainer.querySelector('#resetSettingsBtn');
        if (resetSettingsBtn) {
            resetSettingsBtn.addEventListener('click', () => {
                resetSettings();
            });
        }
    }

    /**
     * Guarda la configuración de la aplicación.
     */
    function saveSettings() {
        const newAppTitle = moduleContainer.querySelector('#appTitleInput').value;
        const newItemsPerPage = parseInt(moduleContainer.querySelector('#itemsPerPageInput').value, 10);
        const newDateFormat = moduleContainer.querySelector('#dateFormatInput').value;
        const newEnableNotifications = moduleContainer.querySelector('#enableNotificationsCheckbox').checked;

        const updatedSettings = {
            appTitle: newAppTitle,
            itemsPerPage: newItemsPerPage,
            dateFormat: newDateFormat,
            enableNotifications: newEnableNotifications
        };

        window.appData.updateConfig({ settings: updatedSettings });
        console.log('Settings: Configuración guardada.');
        
        alert('Configuración guardada exitosamente.');

        if (window.app && typeof window.app.updateAppTitleAndNavbar === 'function') {
            window.app.updateAppTitleAndNavbar();
        }
    }

    /**
     * Restablece la configuración a los valores por defecto.
     */
    function resetSettings() {
        if (confirm('¿Está seguro de que desea restablecer la configuración a los valores predeterminados?')) {
            const defaultSettings = window.appData.getDefaultSettings(); // Obtener la configuración por defecto
            window.appData.updateConfig({ settings: defaultSettings });
            console.log('Settings: Configuración restablecida a valores por defecto.');
            alert('Configuración restablecida exitosamente.');
            render(); // Volver a renderizar para mostrar los valores por defecto
            
            if (window.app && typeof window.app.updateAppTitleAndNavbar === 'function') {
                window.app.updateAppTitleAndNavbar();
            }
        }
    }

    return {
        init: init
    };
})();

window.settingsModule = settingsModule;