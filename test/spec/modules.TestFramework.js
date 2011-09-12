/**
 * A test framework for the path-finders.
 * @param {String} finderName The name of the finder to test(the name should
 *     be without the `Finder` suffix).
 *     example: testFinder('AStar') will test modules/AStar.js and the class
 *     name will be AStarFinder.
 */
function testFinder(finderName) {
    describe('modules/' + finderName + '.js', function() {
        var finderClass, finder, startX, startY, endX, endY, grid, 
            width, height, matrix,

            enumPos = function(f) {
                for (var i = 0; i < height; ++i) {
                    for (var j = 0; j < width; ++j) {
                        f(j, i, finder);
                    }
                }
            };

        finderClass = PF[finderName + 'Finder'];
        
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
            finder = new finderClass;
            finder.init(startX, startY, endX, endY, grid);
        });

        it('should be generated', function() {
            expect(typeof finder).toBe('object');
        });

        it('should have correct size', function() {
            expect(finder.gridWidth).toBe(width);
            expect(finder.gridHeight).toBe(height);

            var grid = finder.grid;
            expect(grid.width).toBe(width);
            expect(grid.height).toBe(height);
        });

        it('should correctly set and query walkable status', function() {
            enumPos(function(x, y) {
                finder.setWalkableAt(x, y, false);
            });
            enumPos(function(x, y) {
                expect(finder.isWalkableAt(x, y)).toBeFalsy();
            });
            enumPos(function(x, y) {
                finder.setWalkableAt(x, y, true);
            });
            enumPos(function(x, y) {
                expect(finder.isWalkableAt(x, y)).toBeTruthy();
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
                expect(finder.isInsideGrid(v[0], v[1])).toBe(v[2]);
            });
        });

        it('should have correct constructor', function() {
            expect(finder.constructor).toBe(finderClass);
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
}
