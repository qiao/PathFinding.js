/**
 * @fileoverview A binary heap container.
 */

/**
 * Binary heap container
 * @constructor
 * @param {Function(a, b)->boolean} [compareFunc] A comparison function which 
 *     returns whether it's first argument is less than the second argument.
 */
PF.Heap = (function() {
    /**
     * Encapsulated heap.
     * @type Array
     * @private
     */
    var _heap;

    /**
     * Comparison function.
     * @type Function(a, b)->boolean
     * @private
     */
    var _cmp;
    
    /**
     * Binary heap container. 
     * @constructor
     * @param {Function(a, b)->boolean} [compareFunc] A comparison function which 
     *     returns whether it's first argument is less than the second argument.
     */
    function Heap(compareFunc) {
        _cmp = compareFunc || function(a, b) {return a < b;};
    }
    
})();
