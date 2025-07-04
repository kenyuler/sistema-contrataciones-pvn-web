// js/data.js

const appData = (() => {
    const LOCAL_STORAGE_KEY = 'sistemaContratacionesData';
    const DEFAULT_CONFIG = {
        lists: {
            tiposContratacion: [
                'Bienes',
                'Servicios',
                'Consultoría',
                'Obras'
            ],
            estadosProceso: [
                'En Planificación',
                'En Ejecución',
                'Completado',
                'Cancelado',
                'Pendiente'
            ],
            tiposRequerimiento: [
                'Bienes',
                'Servicios',
                'Consultoría',
                'Obra',
                'Otros'
            ],
            monedas: [
                'PEN', // Sol peruano
                'USD'  // Dólar estadounidense
            ],
            areasResponsables: [
                'Área Usuaria',
                'Logística',
                'Presupuesto',
                'Asesoría Legal',
                'Comité de Selección',
                'Dirección Ejecutiva'
            ],
            normasAplicables: [
                'Ley de Contrataciones del Estado',
                'Directivas Internas',
                'Reglamento de Contrataciones',
                'Acuerdo Marco',
                'Otros'
            ]
        },
        settings: {
            appTitle: 'Sistema de Gestión de Contrataciones'
        }
    };

    let data = {
        procesos: [],
        config: DEFAULT_CONFIG
    };

    // Función para generar un ID único simple
    function generateUniqueId(prefix = 'PROC') {
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        return `${prefix}${timestamp}${random}`;
    }

    // Carga los datos del Local Storage
    function loadData() {
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                // Fusionar datos guardados con la configuración por defecto si es necesario
                data.procesos = parsedData.procesos || [];
                // Fusionar configuración para asegurar que las nuevas listas se añadan
                data.config = {
                    ...DEFAULT_CONFIG,
                    ...parsedData.config,
                    lists: {
                        ...DEFAULT_CONFIG.lists,
                        ...(parsedData.config ? parsedData.config.lists : {})
                    },
                    settings: {
                        ...DEFAULT_CONFIG.settings,
                        ...(parsedData.config ? parsedData.config.settings : {})
                    }
                };
                console.log('data: Datos cargados del Local Storage:', data);
            } else {
                console.log('data: No hay datos en Local Storage. Usando datos por defecto.');
                // Inicializar con un proceso de ejemplo si no hay datos
                if (data.procesos.length === 0) {
                    data.procesos.push({
                        id: generateUniqueId(),
                        nombre: 'Adquisición de Equipos de Cómputo',
                        estado: 'En Planificación',
                        tipoContratacion: 'Bienes',
                        fechaInicio: '2025-01-15',
                        descripcion: 'Adquisición de 50 laptops y 20 impresoras para el área administrativa.',
                        fechaFinEstimada: '2025-03-30',
                        currentModule: 'requerimiento', // Módulo activo por defecto al ver detalle
                        requerimiento: {
                            id: 1, // ID del requerimiento dentro del proceso
                            tipoBienServicio: 'Bienes',
                            cantidad: 50,
                            unidadMedida: 'Unidades',
                            justificacion: 'Renovación de equipos obsoletos.',
                            fechaSolicitud: '2024-12-01',
                            fechaAprobacion: '2024-12-15',
                            normaAplicable: 'Ley de Contrataciones del Estado',
                            especificacionesTecnicas: 'Laptop Core i7, 16GB RAM, 512GB SSD. Impresora láser multifuncional.'
                        },
                        areaUsuaria: {
                            responsable: 'Juan Pérez',
                            fechaEntregaROM: '2025-01-10',
                            observaciones: 'Pendiente de firma del gerente de área.',
                            conformidadROM: 'Conforme'
                        },
                        segmentacion: {
                            mercado: 'Nacional',
                            segmento: 'Hardware y TI',
                            proveedoresPotenciales: '5',
                            analisisRiesgos: 'Riesgo bajo de sobrecosto.'
                        },
                        costos: {
                            moneda: 'PEN',
                            presupuestoEstimado: 250000,
                            costoReal: 0,
                            fuenteFinanciamiento: 'Recursos Ordinarios'
                        },
                        estrategia: {
                            tipoProcedimiento: 'Licitación Pública',
                            modalidadSeleccion: 'Concurso Público',
                            cronograma: [
                                { etapa: 'Publicación Bases', fecha: '2025-02-01' },
                                { etapa: 'Presentación Propuestas', fecha: '2025-02-20' },
                                { etapa: 'Adjudicación', fecha: '2025-03-15' }
                            ],
                            observaciones: 'Se requiere aprobación de la OCI.'
                        }
                    });
                    data.procesos.push({
                        id: generateUniqueId(),
                        nombre: 'Servicio de Consultoría para Diseño Gráfico',
                        estado: 'En Ejecución',
                        tipoContratacion: 'Servicios',
                        fechaInicio: '2025-02-20',
                        descripcion: 'Contratación de un consultor externo para el rediseño de la imagen institucional.',
                        fechaFinEstimada: '2025-05-15',
                        currentModule: 'area_usuaria',
                        requerimiento: {
                            id: 2,
                            tipoBienServicio: 'Servicios',
                            cantidad: 1,
                            unidadMedida: 'Servicio',
                            justificacion: 'Modernización de la marca.',
                            fechaSolicitud: '2025-01-05',
                            fechaAprobacion: '2025-01-20',
                            normaAplicable: 'Directivas Internas',
                            especificacionesTecnicas: 'Diseño de logo, manual de marca, papelería.'
                        },
                        areaUsuaria: {
                            responsable: 'María López',
                            fechaEntregaROM: '2025-02-10',
                            observaciones: 'Revisión final en curso.',
                            conformidadROM: 'Pendiente'
                        },
                        segmentacion: { /* ... datos de ejemplo */ },
                        costos: { /* ... datos de ejemplo */ },
                        estrategia: { /* ... datos de ejemplo */ }
                    });
                }
            }
        } catch (e) {
            console.error('data: Error al cargar datos del Local Storage:', e);
            // Si hay un error al parsear, iniciar con valores por defecto
            data = { procesos: [], config: DEFAULT_CONFIG };
        }
    }

    // Guarda los datos en el Local Storage
    function saveData() {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
            console.log('data: Datos guardados en Local Storage:', data);
        } catch (e) {
            console.error('data: Error al guardar datos en Local Storage:', e);
            alert('No se pudieron guardar los datos. El almacenamiento local puede estar lleno o deshabilitado.');
        }
    }

    // Métodos para gestionar procesos
    function getProcesos() {
        return data.procesos;
    }

    function getProcess(id) {
        if (typeof id === 'string') {
            return data.procesos.find(p => p.id === id); 
        }
        // Si el ID es numérico, asume que es el índice para compatibilidad o testing
        return data.procesos[id];
    }

    function addProcess(newProcess) {
        newProcess.id = newProcess.id || generateUniqueId(); // Asegurar ID
        newProcess.nombre = newProcess.nombre || `Nuevo Proceso - ${newProcess.id}`; // Nombre por defecto
        newProcess.estado = newProcess.estado || 'Pendiente'; // Estado por defecto
        newProcess.fechaInicio = newProcess.fechaInicio || new Date().toISOString().split('T')[0]; // Fecha actual
        newProcess.currentModule = newProcess.currentModule || 'requerimiento'; // Módulo inicial al crear
        
        // Inicializar sub-objetos de módulos si no existen
        newProcess.requerimiento = newProcess.requerimiento || {};
        newProcess.areaUsuaria = newProcess.areaUsuaria || {};
        newProcess.segmentacion = newProcess.segmentacion || {};
        newProcess.costos = newProcess.costos || {};
        newProcess.estrategia = newProcess.estrategia || {};

        data.procesos.push(newProcess);
        saveData();
        console.log('data: Proceso añadido:', newProcess);
        return newProcess;
    }

    function createProcess() {
        // Crea un proceso vacío con un ID y lo añade
        const newProcess = {}; // Se inicializa vacío y addProcess se encarga de los defaults
        return addProcess(newProcess);
    }

    function updateProcess(updatedProcess) {
        const index = data.procesos.findIndex(p => p.id === updatedProcess.id);
        if (index !== -1) {
            data.procesos[index] = { ...data.procesos[index], ...updatedProcess };
            saveData();
            console.log('data: Proceso actualizado:', data.procesos[index]);
            return true;
        }
        console.warn('data: Intento de actualizar proceso no existente:', updatedProcess);
        return false;
    }

    function deleteProcess(id) {
        const initialLength = data.procesos.length;
        data.procesos = data.procesos.filter(p => p.id !== id);
        if (data.procesos.length < initialLength) {
            saveData();
            console.log('data: Proceso eliminado con ID:', id);
            return true;
        }
        console.warn('data: Intento de eliminar proceso no existente con ID:', id);
        return false;
    }

    // Métodos para gestionar la configuración
    function getConfig() {
        return data.config;
    }

    function updateConfig(newConfig) {
        data.config = {
            ...data.config,
            ...newConfig,
            lists: {
                ...data.config.lists,
                ...(newConfig.lists || {})
            },
            settings: {
                ...data.config.settings,
                ...(newConfig.settings || {})
            }
        };
        saveData();
        console.log('data: Configuración actualizada:', data.config);
    }

    // Cargar datos al inicializar el módulo
    loadData();

    return {
        load: loadData, // Exportar load para que app.js lo llame explícitamente si es necesario
        getProcesos,
        getProcess,
        addProcess,
        createProcess, // Exportar la función para crear un nuevo proceso vacío
        updateProcess,
        deleteProcess,
        getConfig,
        updateConfig
    };
})();
