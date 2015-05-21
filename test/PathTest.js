var PF        = require('..')
var scenarios = require('./PathTestScenarios');

/**
 * Path-finding tests for the path-finders.
 * @param {boolean} opt.optimal - Whether the finder is guaranteed to find the shortest path
 */
function pathTest(opt) {
    var name = opt.name,
        finder = opt.finder,
        optimal = opt.optimal,
        useCost = opt.useCost;
        

    describe(name, function() {
        var startX, startY, endX, endY, grid, expectedLength,
            width, height, matrix, costs, path, i, scen;

        var test = (function() {
            var testId = 0;

            return function(startX, startY, endX, endY, grid, expectedLength, expectedCostLength) {
                it('should solve maze '+ ++testId, function() {
                    path = finder.findPath(startX, startY, endX, endY, grid);
                    if (optimal) {
                      if (useCost && expectedCostLength !== undefined) {
                        path.length.should.equal(expectedCostLength);
                      } else {
                        path.length.should.equal(expectedLength);
                      }
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
            costs = useCost ? scen.costs : undefined;
            height = matrix.length;
            width = matrix[0].length;            
            grid = new PF.Grid(width, height, matrix, costs);

            test(
                scen.startX, scen.startY, 
                scen.endX, scen.endY, 
                grid, 
                scen.expectedLength,
                scen.expectedCostLength
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
    optimal: true,
    useCost: false
}, {
    name: 'AStar Cost',
    finder: new PF.AStarFinder(),
    optimal: true,
    useCost: true
}, {
    name: 'BreadthFirst',
    finder: new PF.BreadthFirstFinder(),
    optimal: true,
    useCost: false
}, {
    name: 'Dijkstra',
    finder: new PF.DijkstraFinder(),
    optimal: true,
    useCost: false
}, {
    name: 'Dijkstra Cost',
    finder: new PF.DijkstraFinder(),
    optimal: true,
    useCost: true
}, {
    name: 'BiBreadthFirst',
    finder: new PF.BiBreadthFirstFinder(),
    optimal: true,
    useCost: false
}, {
    name: 'BiDijkstra',
    finder: new PF.BiDijkstraFinder(),
    optimal: true,
    useCost: false
});

// finders NOT guaranteed to find the shortest path
pathTests({
    name: 'BiAStar',
    finder: new PF.BiAStarFinder(),
    optimal: false,
    useCost: false
}, {
    name: 'BestFirst',
    finder: new PF.BestFirstFinder(),
    optimal: false,
    useCost: false
}, {
    name: 'BiBestFirst',
    finder: new PF.BiBestFirstFinder(),
    optimal: false,
    useCost: false
}, {
    name: 'IDAStar',
    finder: new PF.IDAStarFinder(),
    optimal: false,
    useCost: false
}, {
    name: 'JPFMoveDiagonallyIfAtMostOneObstacle',
    finder: new PF.JumpPointFinder({
      diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle
    }),
    optimal: false,
    useCost: false
},  {
    name: 'JPFNeverMoveDiagonally',
    finder: new PF.JumpPointFinder({
      diagonalMovement: PF.DiagonalMovement.Never
    }),
    optimal: false,
    useCost: false
});
