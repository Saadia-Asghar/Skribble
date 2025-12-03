/**
 * Stack Data Structure
 * Used for Undo/Redo functionality in the drawing canvas.
 * LIFO (Last In First Out)
 */
export class Stack {
    constructor() {
        this.items = [];
    }

    // Push element to stack
    push(element) {
        this.items.push(element);
    }

    // Pop element from stack
    pop() {
        if (this.isEmpty()) return null;
        return this.items.pop();
    }

    // Peek at the top element
    peek() {
        if (this.isEmpty()) return null;
        return this.items[this.items.length - 1];
    }

    // Check if stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Get size of stack
    size() {
        return this.items.length;
    }

    // Clear stack
    clear() {
        this.items = [];
    }

    // Convert to array (for serialization if needed)
    toArray() {
        return [...this.items];
    }
}
