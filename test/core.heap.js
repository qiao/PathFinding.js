var Heap = require('../src/core/heap');

describe('Heap', function() {
    /**
     * Generate a random array of integers.
     * @param {integer} size The length of the array.
     * @return {Array.<integer>}
     */
    var randomArray = function(size) {
        var a = [], t;
        for (var i = 0; i < size; ++i) {
            t = parseInt(Math.random() * 100);
            a.push(t);
        }
        return a;
    };


    /**
     * Get a copy of an array
     * @param {Array} array The array to copy.
     * @return {Array}
     */
    var copyArray = function(array) {
        return JSON.parse(JSON.stringify(array));
    };

    
    /**
     * Return the sorted array using heap
     * Note: This method does not modify the original array.
     * @param {Array} array The array to sort.
     * @return {Array} The sorted array.
     */
    var heapSort1 = function(array) {
        var heap = new Heap(),
            ret = [];
        array.forEach(function(v) {
            heap.push(v); 
        });
        while (!heap.isEmpty()) {
            ret.push(heap.pop());
        }
        return ret;
    };


    var heapSort2 = function(array) {
        var heap = new Heap(),
            ret = [];

        heap._heap = array;
        heap.heapify();

        while (!heap.isEmpty()) {
            ret.push(heap.pop());
        }
        return ret;
    };

    var test = function(size) {
        var a, b, c;
        a = randomArray(size);
        b = copyArray(a);
        c = copyArray(a);

        a.sort(function(x, y) {
            return x - y;
        });
        b = heapSort1(b);
        c = heapSort2(c);

        a.should.eql(b);
        a.should.eql(c);
    };

    describe('heap sort', function() {
        var numTests = 10, size = 100;
        for (var i = 1; i <= numTests; ++i) {
            it('should sort array ' + i, function() {
                test(size);
            });
        }
    });
});
