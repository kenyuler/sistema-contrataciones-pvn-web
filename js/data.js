// js/data.js

const appData = (() => {
    const LOCAL_STORAGE_KEY_PROCESOS = 'procesos_contratacion';
    const LOCAL_STORAGE_KEY_CONFIG = 'app_config';

    let procesos = []; // Array para almacenar los procesos de contratación
    let config = {};   // Objeto para almacenar la configuración de la aplicación

    // Configuración predeterminada de la aplicación
    const defaultConfig = {
        settings: {
            appTitle: 'Sistema de Contrataciones',
            itemsPerPage: 10,
            dateFormat: 'DD/MM/YYYY', // Formato de fecha por defecto
            enableNotifications: true
        }
    };

    /**
     * Carga los datos (procesos y configuración) del Local Storage.
     * Si no hay datos guardados, inicializa con valores por defecto.
     */
    function loadData() {
        try {
            const storedProcesos = localStorage.getItem(LOCAL_STORAGE_KEY_PROCESOS);
            if (storedProcesos) { 
                procesos = JSON.parse(storedProcesos);
                console.log('data: Datos cargados del Local Storage (procesos).');
            } else {
                procesos = []; // Inicializa vacío si no hay datos
            }

            const storedConfig = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
            if (storedConfig) {
                config = { ...defaultConfig, ...JSON.parse(storedConfig) };
                if (JSON.parse(storedConfig).settings && config.settings) {
                    config.settings = { ...defaultConfig.settings, ...JSON.parse(storedConfig).settings };
                }
                console.log('data: Configuración cargada del Local Storage:', config);
            } else {
                config = { ...defaultConfig }; // Usa la configuración por defecto
                console.log('data: Configuración inicializada con valores por defecto.');
            }

        } catch (e) {
            console.error('data: Error al cargar datos del Local Storage:', e);
            procesos = [];
            config = { ...defaultConfig };
        }
    }

    /**
     * Guarda los datos (procesos y configuración) en el Local Storage.
     */
    function saveData() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY_PROCESOS, JSON.stringify(procesos));
            localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
            console.log('data: Datos guardados en Local Storage.');
        } catch (e) {
            console.error('data: Error al guardar datos en Local Storage:', e);
        }
    }

    /**
     * Genera un ID único para un nuevo proceso.
     * @returns {string} Un ID único.
     */
    function generateUniqueId() {
        return 'PROC' + Date.now() + Math.floor(Math.random() * 1000);
    }

    // Cargar datos al inicializar el módulo
    loadData();

    // Retorna las funciones y datos que serán accesibles públicamente
    return {
        getProcesos: () => [...procesos],
        addProceso: (newProceso) => {
            const id = generateUniqueId();
            const now = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
            const procesoToAdd = { id, fechaCreacion: now, ...newProceso };
            procesos.push(procesoToAdd);
            saveData();
            console.log('data: Nuevo proceso añadido:', procesoToAdd);
            return procesoToAdd;
        },
        updateProceso: (id, updatedFields) => {
            const index = procesos.findIndex(p => p.id === id);
            if (index !== -1) {
                procesos[index] = { ...procesos[index], ...updatedFields };
                saveData();
                console.log('data: Proceso actualizado:', procesos[index]);
                return true;
            }
            console.warn(`data: No se encontró proceso con ID ${id} para actualizar.`);
            return false;
        },
        deleteProceso: (id) => {
            const initialLength = procesos.length;
            procesos = procesos.filter(p => p.id !== id);
            if (procesos.length < initialLength) {
                saveData();
                console.log(`data: Proceso con ID ${id} eliminado.`);
                return true;
            }
            console.warn(`data: No se encontró proceso con ID ${id} para eliminar.`);
            return false;
        },
        getConfig: () => ({ ...config }),
        updateConfig: (newConfig) => {
            config = { ...config, ...newConfig };
            if (newConfig.settings) {
                config.settings = { ...config.settings, ...newConfig.settings };
            }
            saveData();
            console.log('data: Configuración de la aplicación actualizada:', config);
        },
        getDefaultConfig: () => ({ ...defaultConfig }),
        getDefaultSettings: () => ({ ...defaultConfig.settings })
    };
})();

window.appData = appData;