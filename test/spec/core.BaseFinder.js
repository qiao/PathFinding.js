describe('core/BaseFinder.js', function() {
    var baseFinder, startX, startY, endX, endY, grid, 
        width, height, matrix,

        enumPos = function(f) {
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    f(j, i);
                }
            }
        };
    
    beforeEach(function() {
        startX = 2;
        startY = 2;
        endX = 4;
        endY = 4;
        
        matrix = [
            [0, 0, 0, 0, 0],
            [1, 0, 1, 1, 0],
            [1, 0, 1, 0, 0],
            [0, 1, 0, 0, 0],
            [1, 0, 1, 1, 0],
            [0, 0, 1, 0, 0],
        ];
        height = matrix.length;
        width = matrix[0].length;
        grid = new PF.Grid(width, height, matrix);
        baseFinder = new PF.BaseFinder();
        baseFinder.init(startX, startY, endX, endY, grid);
    });

    it('should be generated', function() {
        expect(typeof baseFinder).toBe('object');
    });

    it('should have correct size', function() {
        expect(baseFinder.gridWidth).toBe(width);
        expect(baseFinder.gridHeight).toBe(height);

        var grid = baseFinder.grid;
        expect(grid.width).toBe(width);
        expect(grid.height).toBe(height);
    });

    it('should correctly set and query walkable status', function() {
        enumPos(function(x, y) {
            baseFinder.setWalkableAt(x, y, false);
        });
        enumPos(function(x, y) {
            expect(baseFinder.isWalkableAt(x, y)).toBeFalsy();
        });
        enumPos(function(x, y) {
            baseFinder.setWalkableAt(x, y, true);
        });
        enumPos(function(x, y) {
            expect(baseFinder.isWalkableAt(x, y)).toBeTruthy();
        });
    });

    it('should correctly return whether a position is inside', function() {
        var asserts = [
            [0, 0, true],
            [0, height - 1, true],
            [width - 1, 0, true],
            [width - 1, height - 1, true],
            [-1, -1, false],
            [0, -1, false],
            [-1, 0, false],
            [0, height, false],
            [width, 0, false],
            [width, height, false],
        ];
        
        asserts.forEach(function(v, i, a) {
            expect(baseFinder.isInsideGrid(v[0], v[1])).toBe(v[2]);
        });
    });

    it('should have correct constructor', function() {
        expect(baseFinder.constructor).toBe(PF.BaseFinder);
    });

    it('should be able to set and get arbitray attributes', function() {
        var attrs = {
            'a': 1,
            'b': 2,
            'c': 3,
            'd': 4,
            'e': 5,
        };

        enumPos(function(x, y) {
            for (var key in attrs) {
                grid.setAttributeAt(x, y, key, attrs[key]);
            }
        });

        enumPos(function(x, y) {
            for (var key in attrs) {
                expect(grid.getAttributeAt(x, y, key)).toBe(attrs[key]);
            }
        });
    });
});
