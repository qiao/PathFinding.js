/**
 * A base class for path-finders.
 * This class *SHOULD NOT* be directly instantiated, as it does not provide 
 * any path-finding algorithms or methods and is intended to be extended 
 * by all the other path-finder classes.
 *
 * *Note*: The constructor does *NOT* receive any arguments for instantiation.
 *     All the parameters should be passed in in the {@code init} method.
 *     Therefore, you only need to instantiate this class once, and call
 *     the {@code init} method each time you start a new path-finding.
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

    this.gridWidth = grid.width;
    this.gridHeight = grid.height;
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
PF.BaseFinder.prototype.setWalkableAt = function(x, y, walkable) {
    // delegates to grid.
    this.grid.setWalkableAt(x, y, walkable);
};

/**
 * Determine whether the given position on the grid is walkable.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether it is walkable.
 */
PF.BaseFinder.prototype.isWalkableAt = function(x, y) {
    // delegates to grid.
    return this.grid.isWalkableAt(x, y);
};

/**
 * Generic setter of the attribute at the given position.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to set.
 * @param {object} value The value of attribute.
 */
PF.BaseFinder.prototype.setAttributeAt = function(x, y, attr, value) {
    // delegates to grid.
    this.grid.setAttributeAt(x, y, attr, value);
};

/**
 * Generic getter of the attribute at the given position.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to get.
 * @return {object} The value of the attribute.
 */
PF.BaseFinder.prototype.getAttributeAt = function(x, y, attr) {
    // delegates to grid.
    return this.nodes[y][x][attr];
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
