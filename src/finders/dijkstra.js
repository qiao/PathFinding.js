var AStarFinder = require('./astar').AStarFinder;

/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {object} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
function DijkstraFinder(opt) {
    AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
};

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;

exports.DijkstraFinder = DijkstraFinder;
