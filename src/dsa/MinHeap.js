/**
 * MinHeap Data Structure
 * Used for selecting words based on difficulty (lowest weight/difficulty first).
 */
export class MinHeap {
    constructor() {
        this.heap = [];
    }

    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    swap(i1, i2) {
        [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
    }

    // Insert element { word, difficulty }
    insert(element) {
        this.heap.push(element);
        this.heapifyUp();
    }

    heapifyUp() {
        let index = this.heap.length - 1;
        while (
            this.getParentIndex(index) >= 0 &&
            this.heap[this.getParentIndex(index)].difficulty > this.heap[index].difficulty
        ) {
            this.swap(this.getParentIndex(index), index);
            index = this.getParentIndex(index);
        }
    }

    // Remove and return the minimum element (lowest difficulty)
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown();
        return min;
    }

    heapifyDown() {
        let index = 0;
        while (this.getLeftChildIndex(index) < this.heap.length) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (
                this.getRightChildIndex(index) < this.heap.length &&
                this.heap[this.getRightChildIndex(index)].difficulty < this.heap[smallerChildIndex].difficulty
            ) {
                smallerChildIndex = this.getRightChildIndex(index);
            }

            if (this.heap[index].difficulty < this.heap[smallerChildIndex].difficulty) {
                break;
            }

            this.swap(index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    peek() {
        if (this.heap.length === 0) return null;
        return this.heap[0];
    }

    size() {
        return this.heap.length;
    }
}
