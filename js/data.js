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
                            analisisRiesgos: 'R
