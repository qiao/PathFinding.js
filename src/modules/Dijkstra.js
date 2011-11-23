/**
 * Dijkstra path-finder.
 * @constructor
 * @extends PF.AStarFinder
 * @param {object} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
PF.DijkstraFinder = function(opt) {
    PF.AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
};

PF.DijkstraFinder.prototype = new PF.AStarFinder();

PF.DijkstraFinder.prototype.constructor = PF.DijkstraFinder;
