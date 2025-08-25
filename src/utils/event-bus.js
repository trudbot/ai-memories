// ...existing code...
class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, cb) {
        const set = this.events.get(event) || new Set();
        set.add(cb);
        this.events.set(event, set);
        return () => this.off(event, cb);
    }

    off(event, cb) {
        if (!this.events.has(event)) return;
        if (cb) {
            this.events.get(event).delete(cb);
        } else {
            this.events.delete(event);
        }
    }

    emit(event, payload) {
        const set = this.events.get(event);
        if (!set) return;
        for (const cb of Array.from(set)) {
            try { cb(payload); } catch (e) { /* swallow */ }
        }
    }

    once(event, cb) {
        const wrapper = (p) => {
            cb(p);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
}

export const emitter = new EventEmitter();

/**
 * 方便的全局调用方法
 * emitter.emit('full-loading:show', { message?: string, timeoutMs?: number })
 * emitter.emit('full-loading:hide')
 */
export function showFullLoading(message, timeoutMs) {
    emitter.emit('full-loading:show', { message });
    if (typeof timeoutMs === 'number' && timeoutMs > 0) {
        setTimeout(() => emitter.emit('full-loading:hide'), timeoutMs);
    }
}
export function hideFullLoading() {
    emitter.emit('full-loading:hide');
}
// ...existing code...