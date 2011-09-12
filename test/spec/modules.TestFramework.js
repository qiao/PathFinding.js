/**
 * A test framework for the path-finders.
 * @param {String} finderName The name of the finder to test(the name should
 *     be without the `Finder` suffix).
 *     example: testFinder('AStar') will test modules/AStar.js and the class
 *     name will be AStarFinder.
 */
function testFinder(finderName) {
    describe('modules/' + finderName + '.js', function() {
        var finderClass, baseFinder, startX, startY, endX, endY, grid, 
            width, height, matrix,

            finderForEach = function(f) {
                for (var i = 0; i < height; ++i) {
                    for (var j = 0; j < width; ++j) {
                        f.call(baseFinder, j, i);
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
            baseFinder = new finderClass;
            baseFinder.init(startX, startY, endX, endY, grid);
        });

        it('should be generated', function() {
            expect(typeof baseFinder).toBe('object');
        });

        it('should have correct size', function() {
            expect(baseFinder.gridWidth).toBe(width);
            expect(baseFinder.gridHeight).toBe(height);

            var grid = baseFinder.grid;
            expect(grid.numCols).toBe(width);
            expect(grid.numRows).toBe(height);
        });

        it('should correctly set and query walkable status', function() {
            finderForEach(function(x, y) {
                this.setWalkable(x, y, false);
            });
            finderForEach(function(x, y) {
                expect(this.isWalkable(x, y)).toBeFalsy();
            });
            finderForEach(function(x, y) {
                this.setWalkable(x, y, true);
            });
            finderForEach(function(x, y) {
                expect(this.isWalkable(x, y)).toBeTruthy();
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
            expect(baseFinder.constructor).toBe(finderClass);
        });
    });
}
