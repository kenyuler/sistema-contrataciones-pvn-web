// js/app.js

const app = (() => {
    let contentContainer = null;
    let appDataInstance = null;
    let currentModuleInstance = null; // Para guardar la instancia del módulo activo

    /**
     * Configura los event listeners para los enlaces de navegación principales.
     */
    function setupNavigationEvents() {
        const navLinks = document.querySelectorAll('.nav-link[data-module]');

        if (navLinks.length === 0) {
            console.warn('app: No se encontraron enlaces de navegación con la clase ".nav-link" y atributo "data-module". Verifique el HTML del navbar en index.html.');
            return;
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                navLinks.forEach(item => item.classList.remove('active'));
                e.currentTarget.classList.add('active');

                const moduleName = e.currentTarget.dataset.module;
                if (moduleName) {
                    console.log(`app: Navegación clickeada. Cargando módulo: ${moduleName}`);
                    loadModule(moduleName);
                } else {
                    console.warn('app: El enlace de navegación clickeado no tiene un atributo data-module válido.');
                }
            });
        });
    }

    /**
     * Carga un módulo dinámicamente en el contentContainer.
     * @param {string} moduleName - El nombre del módulo a cargar (ej. 'dashboard', 'seguimiento').
     * @param {string|null} currentProcesoId - ID del proceso si aplica (ej. para editar en seguimiento).
     */
    function loadModule(moduleName, currentProcesoId = null) {
        console.log(`app: Intentando cargar el módulo: ${moduleName}`);

        if (!contentContainer) {
            console.error('app: Error: contentContainer no está inicializado.');
            return;
        }

        // Si hay un módulo activo, llama a su método cleanup si existe
        if (currentModuleInstance && typeof currentModuleInstance.cleanup === 'function') {
            currentModuleInstance.cleanup();
            console.log(`app: Cleanup ejecutado para el módulo anterior.`);
        }

        const module = window[`${moduleName}Module`];

        if (module && typeof module.init === 'function') {
            console.log(`app: Módulo '${moduleName}' encontrado y tiene método init.`);

            contentContainer.innerHTML = `
                <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="ms-2">Cargando módulo ${moduleName}...</p>
                </div>
            `;

            module.init(currentProcesoId, contentContainer);
            currentModuleInstance = module; // Guarda la referencia al módulo recién cargado
            console.log(`app: Módulo '${moduleName}' cargado exitosamente.`);

        } else {
            console.error(`app: El módulo '${moduleName}' no se encontró o no tiene un método 'init'.`);
            contentContainer.innerHTML = `<p class="alert alert-danger">Error al cargar el módulo '${moduleName}'. Asegúrese de que el archivo del módulo esté cargado y exponga una función 'init'.</p>`;
        }
    }

    /**
     * Actualiza el título de la barra de navegación y el título del documento.
     */
    function updateAppTitleAndNavbar() {
        const config = appDataInstance.getConfig();
        const appTitle = config.settings.appTitle || 'Sistema de Contrataciones';

        document.title = appTitle;

        const navbarBrand = document.getElementById('app-navbar-title');
        if (navbarBrand) {
            navbarBrand.innerHTML = `<i class="bi bi-briefcase-fill me-2"></i>${appTitle}`;
        }
    }

    /**
     * Función de inicialización principal de la aplicación.
     * Es llamada cuando el DOM ha sido completamente cargado.
     */
    function init() {
        console.log('app: Iniciando aplicación.');

        contentContainer = document.getElementById('content-container');
        if (!contentContainer) {
            console.error('app: No se encontró el elemento #content-container. La aplicación no puede iniciarse.');
            return;
        }
        console.log('app: contentContainer inicializado en app.init():', contentContainer);

        if (typeof window.appData === 'undefined') {
            console.error('app: appData no está disponible. Asegúrese de que data.js se cargue ANTES de app.js.');
            return;
        }
        appDataInstance = window.appData;
        console.log('app: appData disponible.');

        setupNavigationEvents();
        console.log('app: Eventos de navegación configurados.');

        updateAppTitleAndNavbar();

        loadModule('dashboard');
    }

    return {
        init: init,
        loadModule: loadModule,
        updateAppTitleAndNavbar: updateAppTitleAndNavbar
    };
})();

window.app = app;