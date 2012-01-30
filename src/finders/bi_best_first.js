var BiAStarFinder = require('./bi_astar').BiAStarFinder;

/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends PF.BiAStarFinder
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
BiBestFirstFinder = function(opt) {
    BiAStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

BiBestFirstFinder.prototype = new BiAStarFinder();
BiBestFirstFinder.prototype.constructor = BiBestFirstFinder;

exports.BiBestFirstFinder = BiBestFirstFinder;
