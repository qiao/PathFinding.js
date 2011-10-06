/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends PF.AStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 */
PF.BestFirstFinder = function(allowDiagonal, heuristic) {
    PF.AStarFinder.call(this, allowDiagonal, heuristic);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

PF.BestFirstFinder.prototype = new PF.AStarFinder();

PF.BestFirstFinder.prototype.constructor = PF.BestFirstFinder;
