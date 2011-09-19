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

        // Load all the test cases and test against the finder.
        for (var i = 0, tc; tc = testCases[i]; ++i) {
            var matrix = tc.matrix,
                height = matrix.length,
                width = matrix[0].length,

                grid = new PF.Grid(width, height, matrix);

            test(tc.startX, tc.startY, tc.endX, tc.endY, grid, tc.expectedLength);
        }
    });
}
