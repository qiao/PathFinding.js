describe('modules/Heap.js', function() {
    /**
     * Generate a random array of integers.
     * @param {integer} size The length of the array.
     * @return {Array.<integer>}
     */
    var randomArray = function(size) {
        var a = [];
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
        var ret = [];
        array.forEach(function(v, i, a) {
            ret.push(v);
        });
        return ret;
    };

    
    /**
     * Return the sorted array using heap
     * Note: This method does not modify the original array.
     * @param {Array} array The array to sort.
     * @return {Array} The sorted array.
     */
    var heapSort1 = function(array) {
        var heap = new PF.Heap(),
            ret = [];
        array.forEach(function(v, i, a) {
            heap.push(v); 
        });
        while (!heap.isEmpty()) {
            ret.push(heap.pop());
        }
        return ret;
    };


    var heapSort2 = function(array) {
        var heap = new PF.Heap(),
            ret = [];

        heap.heap = array;
        heap.heapify();

        while (!heap.isEmpty()) {
            ret.push(heap.pop());
        }
        return ret;
    };


    /**
     * Compare whether two arrray are the same.
     * @param {Array} a Array a
     * @param {Array} b Array b
     * @return {boolean} 
     */
    var sameArray = function(a, b) {
        for (var i = 0, x, y; x = a[i], y = b[i]; i++) {
            if (x !== y) {
                return false;
            }
        }
        return true;
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


        if (!sameArray(a, b)) {
            console.log(a);
            console.log(b);
        }

        expect(sameArray(a, b)).toBeTruthy();
        expect(sameArray(a, c)).toBeTruthy();
    };

    var numTests = 10, size = 100;
    for (var i = 1; i <= numTests; ++i) {
        describe('test ' + i, function() {
            it('should sort out the array', function() {
                test(size);
            });
        }); 
    }
});
