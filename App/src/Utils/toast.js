// Simple toast notification system
class ToastManager {
    constructor() {
        this.listeners = []
    }

    subscribe(listener) {
        this.listeners.push(listener)
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener)
        }
    }

    notify(message, type = 'info') {
        this.listeners.forEach(listener => listener({ message, type, id: Date.now() }))
    }

    success(message) {
        this.notify(message, 'success')
    }

    error(message) {
        this.notify(message, 'error')
    }

    info(message) {
        this.notify(message, 'info')
    }

    warning(message) {
        this.notify(message, 'warning')
    }
}

export const toast = new ToastManager()
