module.exports = {
    'Node'                 : require('./core/node'),
    'Grid'                 : require('./core/grid'),
    'Heap'                 : require('./core/heap'),
    'Heuristic'            : require('./core/heuristic'),
    'BaseFinder'           : require('./finders/base'),
    'AStarFinder'          : require('./finders/astar'),
    'BestFirstFinder'      : require('./finders/best_first'),
    'BreadthFirstFinder'   : require('./finders/breadth_first'),
    'DijkstraFinder'       : require('./finders/dijkstra'),
    'BiAStarFinder'        : require('./finders/bi_astar'),
    'BiBestFirstFinder'    : require('./finders/bi_best_first'),
    'BiBreadthFirstFinder' : require('./finders/bi_breadth_first'),
    'BiDijkstraFinder'     : require('./finders/bi_dijkstra'),
    'JumpPointFinder'      : require('./finders/jump_point')
};
