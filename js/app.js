// js/app.js

const app = (() => {
    // Referencia al contenedor principal donde se cargará el contenido de los módulos
    let contentContainer = null; 

    // Mapeo de módulos cargados. Se usa typeof para asegurar que el módulo ha sido cargado.
    const modules = {
        'dashboard': typeof dashboardModule !== 'undefined' ? dashboardModule : null,
        'seguimiento': typeof seguimientoModule !== 'undefined' ? seguimientoModule : null,
        'settings': typeof settingsModule !== 'undefined' ? settingsModule : null,
        'requerimiento': typeof requerimientoModule !== 'undefined' ? requerimientoModule : null,
        'area_usuaria': typeof areaUsuariaModule !== 'undefined' ? areaUsuariaModule : null,
        'segmentacion': typeof segmentacionModule !== 'undefined' ? segmentacionModule : null,
        'costos': typeof costosModule !== 'undefined' ? costosModule : null,
        'estrategia': typeof estrategiaModule !== 'undefined' ? estrategiaModule : null,
    };

    // Configura los eventos para la navegación principal de la barra superior
    function setupNavigationEvents() {
        document.getElementById('nav-dashboard').addEventListener('click', (e) => {
            e.preventDefault();
            loadModule('dashboard');
        });
        document.getElementById('nav-seguimiento').addEventListener('click', (e) => {
            e.preventDefault();
            loadModule('seguimiento');
        });
        document.getElementById('nav-settings').addEventListener('click', (e) => {
            e.preventDefault();
            loadModule('settings');
        });
        // Listener para el logo/nombre de la aplicación, para volver al dashboard
        document.getElementById('navbar-brand-name').addEventListener('click', (e) => {
            e.preventDefault();
            loadModule('dashboard');
        });
    }

    // Actualiza la clase 'active' en los enlaces de navegación para resaltar el módulo actual
    function updateActiveNavLink(activeModule) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.getElementById(`nav-${activeModule}`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    /**
     * Carga dinámicamente el contenido de un módulo en el contenedor principal.
     * @param {string} moduleName - El nombre del módulo a cargar (ej. 'dashboard', 'seguimiento').
     * @param {string|null} currentProcesoId - Opcional: El ID de un proceso si se está navegando a un detalle.
     */
    function loadModule(moduleName, currentProcesoId = null) {
        console.log(`app: Intentando cargar el módulo: ${moduleName}`);
        const module = modules[moduleName];

        // *** VERIFICACIÓN CRÍTICA DEL CONTENEDOR ***
        // Asegurarse de que contentContainer está inicializado ANTES de usarlo
        // Esto es una capa de seguridad si init() no lo obtuvo por alguna razón,
        // o si un módulo intenta cargarse antes de que el DOM esté listo.
        if (!contentContainer) {
            contentContainer = document.getElementById('content-container');
            if (!contentContainer) {
                console.error('app: FATAL ERROR: El elemento con id "content-container" no se encontró en el DOM. No se puede cargar el módulo.');
                alert('Error crítico: La interfaz de usuario no se pudo cargar. Por favor, recarga la página.');
                return;
            }
            console.log('app: contentContainer inicializado dentro de loadModule:', contentContainer);
        } else {
            console.log('app: contentContainer ya está inicializado:', contentContainer);
        }

        if (module && typeof module.init === 'function') {
            console.log(`app: Módulo '${moduleName}' encontrado y tiene método init.`);
            // Mostrar un spinner mientras se carga el módulo
            contentContainer.innerHTML = '<div class="d-flex justify-content-center align-items-center" style="min-height: 300px;"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
            
            // Llamar al método init del módulo, pasándole el ID del proceso si aplica y el contenedor
            console.log(`app: Pasando contentContainer a ${moduleName}.init():`, contentContainer); 
            module.init(currentProcesoId, contentContainer); // Pasamos el ID y el contenedor
            updateActiveNavLink(moduleName); // Actualizar la navegación
            console.log(`app: Módulo '${moduleName}' cargado exitosamente.`);
        } else {
            console.error(`app: El módulo '${moduleName}' no se encontró o no tiene un método 'init'.`);
            contentContainer.innerHTML = `<p class="alert alert-danger">Error: El módulo '${moduleName}' no se encontró o no tiene un método 'init'. Por favor, verifica la consola para más detalles.</p>`;
        }
    }

    // Método de inicialización de la aplicación principal
    return {
        init: () => {
            console.log('app: Iniciando aplicación.');
            
            // Obtener el contenedor principal una vez al inicio
            contentContainer = document.getElementById('content-container');
            if (!contentContainer) {
                console.error('app: FATAL ERROR: El elemento con id "content-container" no se encontró en el DOM. No se puede iniciar la aplicación.');
                alert('Error crítico: La interfaz de usuario no se pudo cargar. Por favor, recarga la página.');
                return;
            }
            console.log('app: contentContainer inicializado en app.init():', contentContainer);


            // Asegúrate de que appData se cargue y esté disponible.
            // data.js debe cargarse ANTES de app.js en index.html.
            if (typeof appData === 'undefined') {
                console.error('app: FATAL ERROR: appData no está definido. data.js no se cargó correctamente o en el orden adecuado.');
                alert('Error crítico: Los datos de la aplicación no están disponibles. Por favor, recarga la página.');
                return;
            }
            // appData.load() ya se llama dentro de data.js al inicializarse.
            // Una llamada explícita aquí asegura que los datos se carguen,
            // pero si data.js se ejecuta primero, ya debería haber sucedido.
            // appData.load(); // Descomentar si appData no carga los datos automáticamente
            console.log('app: appData disponible.');

            // Inicializar eventos de navegación
            setupNavigationEvents();
            console.log('app: Eventos de navegación configurados.');

            // Cargar el dashboard por defecto al iniciar la aplicación
            loadModule('dashboard'); 
        }
    };
})();
