/**
 * Queue Data Structure
 * Used for Hints and Chat messages.
 * FIFO (First In First Out)
 */
export class Queue {
    constructor() {
        this.items = [];
    }

    // Enqueue element
    enqueue(element) {
        this.items.push(element);
    }

    // Dequeue element
    dequeue() {
        if (this.isEmpty()) return null;
        return this.items.shift();
    }

    // Peek at the front element
    front() {
        if (this.isEmpty()) return null;
        return this.items[0];
    }

    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get size
    size() {
        return this.items.length;
    }

    // Get all items
    getAll() {
        return [...this.items];
    }
}
