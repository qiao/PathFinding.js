/**
 * Path-finding tests for the path-finders.
 * @param {String} finderName The name of the finder to test(the name should
 *     be without the `Finder` suffix).
 *     example: testFinder('AStar') will test modules/AStar.js and the class
 *     name will be AStarFinder.
 */
function pathTest(finderName) {
    describe('Path-finding of modules/' + finderName + '.js', function() {
        var finderClass, finder, 
            startX, startY, endX, endY, grid, expectedLength,
            width, height, matrix,

        finderClass = PF[finderName + 'Finder'];

        var test = (function() {
            var testId = 0;

            return function(startX, startY, endX, endY, grid, expectedLength) {
                describe('test ' + ++testId, function() {
                    it('should solve it', function() {
                        finder = new finderClass;
                        finder.init(startX, startY, endX, endY, grid);
                        expect(finder.findPath().length).toBe(expectedLength)
                    });
                });
            };
        })();

        // test 1
        startX = 1;
        startY = 1;
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
        expectedLength = 9;
        height = matrix.length;
        width = matrix[0].length;
        grid = new PF.Grid(width, height, matrix);

        test(startX, startY, endX, endY, grid, expectedLength);

        // test 2
    });
}
