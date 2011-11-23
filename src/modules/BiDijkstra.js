/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends PF.BiAStarFinder
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
PF.BiDijkstraFinder = function(opt) {
    PF.BiAStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
};

PF.BiDijkstraFinder.prototype = new PF.BiAStarFinder();

PF.BiDijkstraFinder.prototype.constructor = PF.BiDijkstraFinder;
