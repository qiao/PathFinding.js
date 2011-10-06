/**
 * Dijkstra path-finder.
 * @constructor
 * @extends PF.AStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 */
PF.DijkstraFinder = function(allowDiagonal) {
    PF.AStarFinder.call(this, allowDiagonal, function(dx, dy) {
        return 0;
    })
};

PF.DijkstraFinder.prototype = new PF.AStarFinder();

PF.DijkstraFinder.prototype.constructor = PF.DijkstraFinder;
