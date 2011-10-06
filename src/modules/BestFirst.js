/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends PF.AStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 */
PF.BestFirstFinder = function(allowDiagonal) {
    PF.AStarFinder.call(this, allowDiagonal, function(dx, dy) {
        return Math.sqrt(dx * dx + dy * dy) * 1000000;
    })
};

PF.BestFirstFinder.prototype = new PF.AStarFinder();

PF.BestFirstFinder.prototype.constructor = PF.BestFirstFinder;
