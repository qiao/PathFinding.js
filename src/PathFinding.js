module.exports = {
    'Heap'                 : require('heap'),
    'Node'                 : require('./core/Node'),
    'Grid'                 : require('./core/Grid'),
    'Util'                 : require('./core/Util'),
    'Heuristic'            : require('./core/Heuristic'),
    'AStarFinder'          : require('./finders/AStarFinder'),
    'BestFirstFinder'      : require('./finders/BestFirstFinder'),
    'BreadthFirstFinder'   : require('./finders/BreadthFirstFinder'),
    'DijkstraFinder'       : require('./finders/DijkstraFinder'),
    'BiAStarFinder'        : require('./finders/BiAStarFinder'),
    'BiBestFirstFinder'    : require('./finders/BiBestFirstFinder'),
    'BiBreadthFirstFinder' : require('./finders/BiBreadthFirstFinder'),
    'BiDijkstraFinder'     : require('./finders/BiDijkstraFinder'),
    'JumpPointFinder'      : require('./finders/JumpPointFinder'),
    'IDAStarFinder'        : require('./finders/IDAStarFinder')
};
