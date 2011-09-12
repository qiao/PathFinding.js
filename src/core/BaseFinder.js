/**
 * A base class for path-finders.
 * This class *SHOULD NOT* be directly instantiated, as it does not provide 
 * any path-finding algorithms or methods and is intended to be extended 
 * by all the other path-finder classes.
 *
 * *Note*: The constructor does *NOT* receive any arguments for instantiation.
 *     All the parameters should be passed in in the {@code init} method.
 *     Therefore, you only need to instantiate this class once, and call
 *     the {@code init} method each time you changed the coordinates or grid
 *     status for a new path-finding request.
 *
 * @constructor
 */
PF.BaseFinder = function() {
    this.startX = null; // avoids to be garbage collected
    this.startY = null;
    this.endX = null;
    this.endY = null;
    this.grid = null;

    this.gridHeight = null;
    this.gridWidth = null;
};

/**
 * Initiate the path-finder by providing the coordinates and the grid.
 * @param {integer} startX The x coordinate of the start position.
 * @param {integer} startY The y coordinate of the start position.
 * @param {integer} endX The x coordinate of the end position.
 * @param {integer} endY The y coordinate of the end position.
 */
PF.BaseFinder.prototype.init = function(startX, startY, endX, endY, grid) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.grid = grid;

    this.gridWidth = grid.numCols;
    this.gridHeight = grid.numRows;
};

/**
 * Determine whether the given postition is inside the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether it is inside.
 */
PF.BaseFinder.prototype.isInsideGrid = function(x, y) {
    // delegates to grid.
    return this.grid.isInside(x, y);
};

/**
 * Set the walkable attribute of the given position on the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 */
PF.BaseFinder.prototype.setWalkable = function(x, y, walkable) {
    // delegates to grid.
    this.grid.setWalkable(x, y, walkable);
};

/**
 * Determine whether the given position on the grid is walkable.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether it is walkable.
 */
PF.BaseFinder.prototype.isWalkable = function(x, y) {
    // delegates to grid.
    return this.grid.isWalkable(x, y);
};

/**
 * The constructor of each BaseFinder instance.
 */
PF.BaseFinder.prototype.constructor = PF.BaseFinder;

/**
 * Find and return the the path.
 * *NOTE*: This method is intended to be overriden by sub-classes.
 * @return {Array.<[integer, integer]>} The path, including both start and 
 *     end positions.
 */
PF.BaseFinder.prototype.findPath = function() {
    throw new Error('Not Implemented Error: ' + 
        'Sub-classes must implement this method');
};
