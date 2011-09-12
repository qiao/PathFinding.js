/**
 * A* path-finder.
 * @constructor
 * @extends PF.BaseFinder
 */
PF.AStarFinder = function() {
    PF.BaseFinder.call(this);
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
 * Find and return the path.
 * @override
 * @return {Array.<[integer, integer]>} The path, including both start and 
 *     end positions.
 */
PF.AStarFinder.prototype.findPath = function() {
        
};
