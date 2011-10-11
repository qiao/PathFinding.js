/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends PF.BiAStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 */
PF.BiDijkstraFinder = function(allowDiagonal) {
    PF.BiAStarFinder.call(this, allowDiagonal, function(dx, dy) {
        return 0;
    })
};

PF.BiDijkstraFinder.prototype = new PF.BiAStarFinder();

PF.BiDijkstraFinder.prototype.constructor = PF.BiDijkstraFinder;
