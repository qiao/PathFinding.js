describe('modules/Heap.js', function() {
    var genRandomArray = function(size) {
        var a = [];
        for (var i = 0; j < size; ++i) {
            t = Math.random();
            a.push(t);
        }
    };

    var copyArray = function(array) {
        var ret;
        array.forEach(function(v, i, a) {
            ret.push(v);
        });
        return ret;
    };

    var heapSort = function(array) {
        var heap = new PF.Heap(),
            ret;
        array.forEach(function(v, i, a) {
            heap.push(v); 
        });
        while (!heap.isEmpty()) {
            ret.push(heap.pop());
        }
        return ret;
    };

    var sameSequence = function(a, b) {
        for (var i = 0, x, y; x = a[i], y = b[i]; i++) {
            if (x !== y) {
                return false;
            }
        }
        return true;
    };

    var test = function(size) {
        var a, b;
        for (var i = 0; i < times; ++i) {
            a = genRandomArray(size);
            b = copyArray(a);

            b.sort();
            a = heapSort(a);

            expect(sameSequence(a, b)).toBeTruthy();
        }
    };

    for (var i = 0; i < 5; ++i) {
        describe('test ' + i, function() {
            it('should sort out the array', function() {
                test(10);
            });
        }); 
    }
});
