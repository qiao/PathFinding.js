/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends PF.BiAStarFinder
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
PF.BiBestFirstFinder = function(opt) {
    PF.BiAStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

PF.BiBestFirstFinder.prototype = new PF.BiAStarFinder();

PF.BiBestFirstFinder.prototype.constructor = PF.BiBestFirstFinder;
