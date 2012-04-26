var Grid      = require('../src/core/grid');
var testCases = require('./path_test_cases');

/**
 * Path-finding tests for the path-finders.
 * @param {boolean} strict - Whether the finder is guaranteed to find the shortest path
 */
function pathTest(name, finder, strict) {
    describe(name, function() {
        var startX, startY, endX, endY, grid, expectedLength,
            width, height, matrix, path;

        var test = (function() {
            var testId = 0;

            return function(startX, startY, endX, endY, grid, expectedLength) {
                it('should solve maze '+ ++testId, function() {
                    path = finder.findPath(startX, startY, endX, endY, grid);
                    if (strict) {
                        path.length.should.equal(expectedLength);
                    } else {
                        path[0].should.eql([startX, startY]);
                        path[path.length - 1].should.eql([endX, endY]);
                    }
                });
            };
        })();

        // Load all the test cases and test against the finder.
        for (var i = 0, tc; tc = testCases[i]; ++i) {
            var matrix = tc.matrix,
                height = matrix.length,
                width = matrix[0].length,

                grid = new Grid(width, height, matrix);

            test(tc.startX, tc.startY, tc.endX, tc.endY, grid, tc.expectedLength);
        }
    });
};


var STRICT = true;
var NON_STRICT = false;

// strict path tests.
var AStarFinder          = require('../src/finders/astar.js');
var BreadthFirstFinder   = require('../src/finders/breadth_first');
var DijkstraFinder       = require('../src/finders/dijkstra');
var BiBreadthFirstFinder = require('../src/finders/bi_breadth_first');
var BiDijkstraFinder     = require('../src/finders/bi_dijkstra');

pathTest('AStar', new AStarFinder(), STRICT);
pathTest('BreadthFirst', new BreadthFirstFinder(), STRICT);
pathTest('Dijkstra', new DijkstraFinder(), STRICT);
pathTest('BiBreadthFirst', new BiBreadthFirstFinder(), STRICT);
pathTest('BiDijkstra', new BiDijkstraFinder(), STRICT);

// non strict tests.
var BestFirstFinder        = require('../src/finders/best_first.js');
var BiBestFirstFinder      = require('../src/finders/bi_best_first.js');
var BiAStarFinder          = require('../src/finders/bi_astar.js');
var JumpPointFinder      = require('../src/finders/jump_point');

pathTest('BestFirst', new BestFirstFinder(), NON_STRICT);
pathTest('BiBestFirst', new BiBestFirstFinder(), NON_STRICT);
pathTest('BiAStar', new BiAStarFinder(), NON_STRICT);
pathTest('JumpPoint', new JumpPointFinder(), NON_STRICT);
