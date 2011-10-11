/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends PF.BiAStarFinder
 * @param {boolean} allowDiagonal - Whether diagonal movement is allowed.
 * @param {function(number, number): number} [heuristic] - Heuristic function
 *     being used to estimate the distance(defaults to manhattan).
 */
PF.BiBestFirstFinder = function(allowDiagonal, heuristic) {
    PF.BiAStarFinder.call(this, allowDiagonal, heuristic);

    var orig = this.heuristic;
    this.heuristic = function(dx, dy) {
        return orig(dx, dy) * 1000000;
    };
};

PF.BiBestFirstFinder.prototype = new PF.BiAStarFinder();

PF.BiBestFirstFinder.prototype.constructor = PF.BiBestFirstFinder;
