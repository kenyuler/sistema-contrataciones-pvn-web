// js/app.js

const app = (() => {
    // Referencia al contenedor principal donde se cargará el contenido de los módulos
    let contentContainer = null; // Inicializado a null aquí

    // Mapeo de módulos cargados (asegurándose de que las variables existan)
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

    // Configura los eventos para la navegación principal
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
        // También puedes añadir un listener al brand name para volver al dashboard
        document.getElementById('navbar-brand-name').addEventListener('click', (e) => {
            e.preventDefault();
            loadModule('dashboard');
        });
    }

    // Actualiza la clase 'active' en los enlaces de navegación
    function updateActiveNavLink(activeModule) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.getElementById(`nav-${activeModule}`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Carga dinámicamente el contenido de un módulo en el contenedor principal
    function loadModule(moduleName, currentProcesoId = null) {
        console.log(`app: Intentando cargar el módulo: ${moduleName}`);
        const module = modules[moduleName];

        // *** VERIFICACIÓN CRÍTICA DEL CONTENEDOR ***
        // Asegurarse de que contentContainer está inicializado ANTES de usarlo
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
            console.log(`app: Pasando contentContainer a ${moduleName}.init():`, contentContainer); // Línea de depuración
            module.init(currentProcesoId, contentContainer); 
            updateActiveNavLink(moduleName);
            console.log(`app: Módulo '${moduleName}' cargado exitosamente.`);
        } else {
            console.error(`app: El módulo '${moduleName}' no se encontró o no tiene un método 'init'.`);
            contentContainer.innerHTML = `<p class="alert alert-danger">Error: El módulo '${moduleName}' no se encontró o no tiene un método 'init'. Por favor, verifica la consola para más detalles.</p>`;
        }
    }

    // Método de inicialización de la aplicación
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


            // Asegúrate de que appData se cargue antes de cualquier módulo
            // (appData se inicializa en data.js que carga antes de app.js)
            if (typeof appData === 'undefined') {
                console.error('app: FATAL ERROR: appData no está definido. data.js no se cargó correctamente o en el orden adecuado.');
                alert('Error crítico: Los datos de la aplicación no están disponibles. Por favor, recarga la página.');
                return;
            }
            appData.load(); // Asegurarse de que los datos estén cargados
            console.log('app: appData cargada.');

            // Inicializar eventos de navegación
            setupNavigationEvents();
            console.log('app: Eventos de navegación configurados.');

            // Cargar el dashboard por defecto al iniciar la aplicación
            loadModule('dashboard'); 
        }
    };
})();