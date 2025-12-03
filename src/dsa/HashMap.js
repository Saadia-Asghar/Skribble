/**
 * HashMap Data Structure
 * Wrapper around JavaScript's native Map for score keeping.
 */
export class HashMap {
    constructor() {
        this.map = new Map();
    }

    set(key, value) {
        this.map.set(key, value);
    }

    get(key) {
        return this.map.get(key);
    }

    has(key) {
        return this.map.has(key);
    }

    delete(key) {
        return this.map.delete(key);
    }

    clear() {
        this.map.clear();
    }

    size() {
        return this.map.size;
    }

    keys() {
        return Array.from(this.map.keys());
    }

    values() {
        return Array.from(this.map.values());
    }

    entries() {
        return Array.from(this.map.entries());
    }
}
