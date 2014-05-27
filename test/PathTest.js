var PF        = require('..')
var scenarios = require('./PathTestScenarios');

/**
 * Path-finding tests for the path-finders.
 * @param {boolean} opt.optimal - Whether the finder is guaranteed to find the shortest path
 */
function pathTest(opt) {
    var name = opt.name,
        finder = opt.finder,
        optimal = opt.optimal;

    describe(name, function() {
        var startX, startY, endX, endY, grid, expectedLength,
            width, height, matrix, path, i, scen;

        var test = (function() {
            var testId = 0;

            return function(startX, startY, endX, endY, grid, expectedLength) {
                it('should solve maze '+ ++testId, function() {
                    path = finder.findPath(startX, startY, endX, endY, grid);
                    if (optimal) {
                        path.length.should.equal(expectedLength);
                    } else {
                        path[0].should.eql([startX, startY]);
                        path[path.length - 1].should.eql([endX, endY]);
                    }
                });
            };
        })();

        // Load all the scenarios and test against the finder.
        for (i = 0; i < scenarios.length; ++i) {
            scen = scenarios[i];

            matrix = scen.matrix;
            height = matrix.length;
            width = matrix[0].length;

            grid = new PF.Grid(width, height, matrix);

            test(
                scen.startX, scen.startY, 
                scen.endX, scen.endY, 
                grid, 
                scen.expectedLength
            );
        }
    });
}

function pathTests(tests) {
    for (i = 0; i < arguments.length; ++i) {
        pathTest(arguments[i]);
    }
}


// finders guaranteed to find the shortest path
pathTests({
    name: 'AStar',
    finder: new PF.AStarFinder(),
    optimal: true
}, {
    name: 'BreadthFirst',
    finder: new PF.BreadthFirstFinder(),
    optimal: true
}, {
    name: 'Dijkstra',
    finder: new PF.DijkstraFinder(),
    optimal: true
}, {
    name: 'BiBreadthFirst',
    finder: new PF.BiBreadthFirstFinder(),
    optimal: true
}, {
    name: 'BiDijkstra',
    finder: new PF.BiDijkstraFinder(),
    optimal: true
});

// finders NOT guaranteed to find the shortest path
pathTests({
    name: 'BiAStar',
    finder: new PF.BiAStarFinder(),
    optimal: false
}, {
    name: 'BestFirst',
    finder: new PF.BestFirstFinder(),
    optimal: false
}, {
    name: 'BiBestFirst',
    finder: new PF.BiBestFirstFinder(),
    optimal: false
}, {
    name: 'IDAStar',
    finder: new PF.IDAStarFinder(),
    optimal: false
}, {
    name: 'JumpPoint',
    finder: new PF.JumpPointFinder(),
    optimal: false
},  {
    name: 'OrthogonalJumpPoint',
    finder: new PF.OrthogonalJumpPointFinder(),
    optimal: false
});
