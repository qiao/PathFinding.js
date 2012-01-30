var BiAStarFinder = require('./bi_astar').BiAStarFinder;

/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
BiDijkstraFinder = function(opt) {
    BiAStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
};

BiDijkstraFinder.prototype = new BiAStarFinder();
BiDijkstraFinder.prototype.constructor = BiDijkstraFinder;

exports.BiDijkstraFinder = BiDijkstraFinder;
