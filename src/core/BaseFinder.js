/**
 * A base class for path-finders.
 * This class SHOULD NOT be directly instantiated, as it does not provide 
 * any path-finding algorithms or methods and is intended to be extended 
 * by all the other path-finder classes.
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
 * @param {number} startX - The x coordinate of the start position.
 * @param {number} startY - The y coordinate of the start position.
 * @param {number} endX - The x coordinate of the end position.
 * @param {number} endY - The y coordinate of the end position.
 * @param {PF.Grid} grid - The grid holding the nodes' status.
 * @protected
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
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} Whether it is inside.
 */
PF.BaseFinder.prototype.isInsideGrid = function(x, y) {
    // delegates to grid.
    return this.grid.isInside(x, y);
};

/**
 * Set the walkable attribute of the given position on the grid.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
PF.BaseFinder.prototype.setWalkableAt = function(x, y, walkable) {
    // delegates to grid.
    this.grid.setWalkableAt(x, y, walkable);
};

/**
 * Determine whether the given position on the grid is walkable.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} Whether it is walkable.
 */
PF.BaseFinder.prototype.isWalkableAt = function(x, y) {
    // delegates to grid.
    return this.grid.isWalkableAt(x, y);
};

/**
 * Generic setter of the attribute at the given position.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} attr - The name of attribute to set.
 * @param {object} value - The value of attribute.
 */
PF.BaseFinder.prototype.setAttributeAt = function(x, y, attr, value) {
    // delegates to grid.
    this.grid.setAttributeAt(x, y, attr, value);
};

/**
 * Generic getter of the attribute at the given position.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} attr -The name of attribute to get.
 * @return {object} The value of the attribute.
 */
PF.BaseFinder.prototype.getAttributeAt = function(x, y, attr) {
    // delegates to grid.
    return this.grid.getAttributeAt(x, y, attr);
};

/**
 * Constructor of each BaseFinder instance.
 */
PF.BaseFinder.prototype.constructor = PF.BaseFinder;

/**
 * Find and return the the path.
 * NOTE: This method is intended to be overriden by sub-classes.
 * @param {number} startX - The x coordinate of the start position.
 * @param {number} startY - The y coordinate of the start position.
 * @param {number} endX - The x coordinate of the end position.
 * @param {number} endY - The y coordinate of the end position.
 * @param {PF.Grid} grid - The grid holding the nodes' status.
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
PF.BaseFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    throw new Error('Not Implemented Error: ' + 
        'Sub-classes must implement this method');
};
