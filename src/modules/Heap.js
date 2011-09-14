/**
 * @fileoverview A binary heap container.
 * Ported from the `heapq` module in Python's standard library.
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
    var heap = this._heap,
        lastItem = heap.pop(),
        returnItem;

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
 * Sift down the heap
 * @param {integer} startPos Start index of the array as a heap.
 * @param {integer} pos Index of the leaf with possiblly out-of-order value.
 */
Heap.prototype._siftDown = function(startPos, pos) {
    var heap = this._heap,
        cmp = this._cmp;
        newItem = heap[pos],
        parentPos,
        parent;

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
