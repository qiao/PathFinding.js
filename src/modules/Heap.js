/**
 * @fileoverview A binary heap container.
 * Based on the `heapq` module in Python's standard library.
 */

/**
 * Binary heap container.
 * @constructor
 * @param {Function(a, b)->boolean} [compareFunc] A comparison function which 
 *     returns whether it's first argument is less than the second argument.
 *     If this argument is not provided, then the `<` operator will be used.
 */
PF.Heap = function(compareFunc) {
    /**
     * Comparison function.
     * @type Function(a, b)->boolean
     * @private
     */
    this._cmp = compareFunc || function(a, b) {return a < b;};

    /**
     * An array as a heap.
     * @type Array
     * @private
     */
    this._heap = [];
};


/**
 * Get the top(smallest) item from the heap.
 */
PF.Heap.prototype.top = function() {
    return this._heap[0];
};


/**
 * Get the size of the heap.
 * @return {integer} The number of items in the heap.
 */
PF.Heap.prototype.size = function() {
    return this._heap.length;
};


/**
 * Determine whether the heap is empty.
 * @return {boolean}
 */
PF.Heap.prototype.isEmpty = function() {
    return !this.size();
};


/**
 * Push an item onto the heap.
 */
PF.Heap.prototype.push = function(item) {
    var heap = this._heap;
        
    heap.push(item);
    this._siftDown(heap, 0, heap.length - 1);
};


/**
 * Pop the smallest item off the heap.
 */
PF.Heap.prototype.pop = function() {
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
 * Pop and return the current smallest value, and add the new item.
 *
 * This is more efficient than `pop()` followed by `push()`, and can be
 * more appropriate when using a fixed-size heap. Note that the value 
 * returned may be larger than the pushed item! That constrains reasonable
 * uses of this routine unless written as part of a conditional replacement.
 *
 *     {@code 
 *     if (item > heap.top()) {
 *         item = heap.replace(item);
 *     }
 */
PF.Heap.prototype.replace = function(item) {
    var returnItem = this._heap[0];
    this._heap[0] = item;
    this._siftUp(0);
    return returnItem;
};


/**
 * Sift down the possibly out-of-order value.
 * @param {integer} startPos Start index of the array as a heap.
 * @param {integer} pos Index of the leaf with possiblly out-of-order value.
 * @private
 */
PF.Heap.prototype._siftDown = function(startPos, pos) {
    var heap, cmp, newItem, parentPos, parent;

    heap = this._heap;
    cmp = this._cmp;
    newItem = heap[pos];

    // Follow the path to the root, moving parents down until finding a place
    // newItem fits.
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
 * @private
 */
PF.Heap.prototype._siftUp = function(pos) {
    var heap, cmp, endPos, startPos, newItem, childPos, rightPos;
    
    cmp = this._cmp;
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
};
