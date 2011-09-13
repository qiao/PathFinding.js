/**
 * Path-finding tests for the path-finders.
 * @param {String} finderName The name of the finder to test(the name should
 *     be without the `Finder` suffix).
 *     example: testFinder('AStar') will test modules/AStar.js and the class
 *     name will be AStarFinder.
 */
function pathTest(finderName) {
    describe('Path-finding of modules/' + finderName + '.js', function() {
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
    });
}
