var AStarFinder = require('./astar').AStarFinder;

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
function BestFirstFinder(opt) {
    AStarFinder.call(this, opt);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

BestFirstFinder.prototype = new AStarFinder();
BestFirstFinder.prototype.constructor = BestFirstFinder;

exports.BestFirstFinder = BestFirstFinder;
