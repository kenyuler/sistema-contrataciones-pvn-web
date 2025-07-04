// js/event-handler.js

const eventHandler = (() => {
    const listeners = {}; // Almacena eventos y sus funciones de escucha

    /**
     * Registra una función para escuchar un evento específico.
     * @param {string} eventName - El nombre del evento a escuchar.
     * @param {function} callback - La función que se ejecutará cuando el evento sea disparado.
     */
    function on(eventName, callback) {
        if (!listeners[eventName]) {
            listeners[eventName] = [];
        }
        listeners[eventName].push(callback);
        console.log(`EventHandler: Listener registrado para "${eventName}"`);
    }

    /**
     * Dispara un evento, ejecutando todas las funciones de escucha registradas para ese evento.
     * @param {string} eventName - El nombre del evento a disparar.
     * @param {any} data - Los datos que se pasarán a las funciones de escucha.
     */
    function trigger(eventName, data) {
        if (listeners[eventName]) {
            console.log(`EventHandler: Disparando evento "${eventName}" con datos:`, data);
            listeners[eventName].forEach(callback => {
                try {
                    callback(data);
                } catch (e) {
                    console.error(`EventHandler: Error en el listener de "${eventName}":`, e);
                }
            });
        } else {
            console.warn(`EventHandler: No hay listeners registrados para el evento "${eventName}".`);
        }
    }

    /**
     * Elimina una función de escucha específica de un evento.
     * @param {string} eventName - El nombre del evento.
     * @param {function} callback - La función específica a eliminar.
     */
    function off(eventName, callback) {
        if (listeners[eventName]) {
            listeners[eventName] = listeners[eventName].filter(cb => cb !== callback);
            console.log(`EventHandler: Listener eliminado para "${eventName}".`);
        }
    }

    return {
        on: on,
        trigger: trigger,
        off: off
    };
})();

// Expone el manejador de eventos globalmente
window.eventHandler = eventHandler;