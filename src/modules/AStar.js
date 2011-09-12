/**
 * A* path-finder.
 * @constructor
 * @extends PF.BaseFinder
 * @param {Function(integer, integer)->integer} [heuristic] Heuristic function
 *     being used to estimate the distance(defaults to manhattan).
 *     Available heuristics:
 *         * PF.AStarFinder.manhattan
 *         * PF.AStarFinder.euclidean
 *         * PF.AStarFinder.chebyshev
 */
PF.AStarFinder = function(heuristic) {
    PF.BaseFinder.call(this);

    this.heuristic = heuristic || PF.AStarFinder.manhattan;
};

/**
 * @inheritDoc
 */
PF.AStarFinder.prototype.init = function(startX, startY, endX, endY, grid) {
    PF.BaseFinder.prototype.init.call(this, startX, startY, endX, endY, grid);

    this.openList = [];
    this.closeList = [];
};


/**
 * Extends the BaseFinder
 */
PF.AStarFinder.prototype = new PF.BaseFinder();

/**
 * Sets the constructor of the instances.
 */
PF.AStarFinder.prototype.constructor = PF.AStarFinder;


/**
 * @inheritDoc
 */
PF.AStarFinder.prototype.findPath = function() {
    // local references for performance
    var sx = this.startX,
        sy = this.startY,
        ex = this.endX,
        ey = this.endY,
        openList = this.openList,
        closeList = this.closeList,
        grid = this.grid;


};



/**
 * Manhattan distance.
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.manhattan = function(dx, dy) {
    return dx + dy;
};

/**
 * Euclidean distance.
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.euclidean = function(dx, dy) {
    return Math.floor(Math.sqrt(dx * dx + dy * dy));
};

/**
 * Chebyshev distance.
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.chebyshev = function(dx, dy) {
    return Math.max(dx, dy);
};
