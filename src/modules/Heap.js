/**
 * @fileoverview A binary heap container.
 * Based on the `heapq` module in Python's standard library.
 */

/**
 * Binary heap container
 * @constructor
 * @param {Function(a, b)->boolean} [compareFunc] A comparison function which 
 *     returns whether it's first argument is less than the second argument.
 */
PF.Heap = function(compareFunc) {
    /**
     * Comparison function
     * @type Function(a, b)->boolean
     * @private
     */
    this._cmp = compareFunc || function(a, b) {return a < b;};

    /**
     * An Array as the heap.
     * @type Array
     * @private
     */
    this._heap = [];
};


/**
 * Push an item onto the heap.
 */
Heap.prototype.push = function(item) {
    var heap = this._heap;
        
    heap.push(item);
    this._siftDown(heap, 0, heap.length - 1);
};

/**
 * Pop the smallest item off the heap.
 */
Heap.prototype.pop = function() {
    var heap, lastItem, returnItem;
    
    heap= this._heap;
    lastItem = heap.pop();

    if (heap.length) {
        returnItem = heap[0];
        heap[0] = lastItem;
        this._siftUp(0);
    } else {
        returnItem = lastItem;
    }
    return returnItem;
};

/**
 * Sift down the possibly out-of-order value.
 * @param {integer} startPos Start index of the array as a heap.
 * @param {integer} pos Index of the leaf with possiblly out-of-order value.
 * @private
 */
Heap.prototype._siftDown = function(startPos, pos) {
    var heap, cmp, newItem, parentPos, parent;

    heap = this._heap;
    cmp = this._cmp;
    newItem = heap[pos];

    while (pos > startPos) {
        parentPos = (pos - 1) >> 1;
        parent = heap[parentPos];
        if (cmp(newItem, parent)) {
            heap[pos] = parent;
            pos = parentPos;
            continue;
        }
        break;
    }
    heap[pos] = newItem;
};

/**
 * Sift up the possibly out-of-order value.
 * @param {integer} pos Index of leaf with possibly out-of-order value.
 */
Heap.prototype._siftUp = function(pos) {
    var heap, endPos, startPos, newItem, childPos, rightPos;
    
    heap = this._heap;
    endPos = heap.length;
    startPos = pos;
    newItem = heap[pos];

    // Bubble up the smaller child until hitting a leaf.
    childPos = 2 * pos + 1; // leftmost child position
    while (childPos < endPos) {
        // Set childPos to index of smaller child. 
        rightPos = childPos + 1;
        if (rightPos < endPos && !cmp(heap[childPos], heap[rightPos])) {
            childPos = rightPos;
        }
        heap[pos] = heap[childPos];
        pos = childPos;
        childPos = 2 * pos + 1;
    }
    // The leaf at pos is empty now. Put newItem here, and bubble it up
    // to its final resting place (by sifting its parent down).
    heap[pos] = newItem;
    this._siftDown(startPos, pos);
}
