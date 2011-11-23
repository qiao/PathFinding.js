/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends PF.AStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
PF.BestFirstFinder = function(opt) {
    PF.AStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

PF.BestFirstFinder.prototype = new PF.AStarFinder();

PF.BestFirstFinder.prototype.constructor = PF.BestFirstFinder;
