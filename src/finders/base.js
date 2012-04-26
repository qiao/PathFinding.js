/**
 * Base class for path-finders.
 * This class SHOULD NOT be directly instantiated, as it does not provide 
 * any path-finding algorithms or methods and is intended to be extended 
 * by all the other path-finder classes.
 * @constructor
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
function BaseFinder(opt) {
    this.startX = null;
    this.startY = null;
    this.endX = null;
    this.endY = null;
    this.grid = null;

    this.gridHeight = null;
    this.gridWidth = null;

    this.allowDiagonal = opt && opt.allowDiagonal;
    if (this.allowDiagonal) {
        /**
         * sub-classes should implement both _inspectSurround 
         * and _inspectSurroundDiagonal
         */
        if (this._inspectSurroundDiagonal !== undefined) {
            this._inspectSurround = this._inspectSurroundDiagonal;
        }
    }
};


/**
 * Determine whether the given postition is inside the grid.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} Whether it is inside.
 */
BaseFinder.prototype.isInsideGrid = function(x, y) {
    // delegates to grid.
    return this.grid.isInside(x, y);
};


/**
 * Set the walkable attribute of the given position on the grid.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
BaseFinder.prototype.setWalkableAt = function(x, y, walkable) {
    // delegates to grid.
    this.grid.setWalkableAt(x, y, walkable);
};


/**
 * Determine whether the given position on the grid is walkable.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} Whether it is walkable.
 */
BaseFinder.prototype.isWalkableAt = function(x, y) {
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
BaseFinder.prototype.setAttributeAt = function(x, y, attr, value) {
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
BaseFinder.prototype.getAttributeAt = function(x, y, attr) {
    // delegates to grid.
    return this.grid.getAttributeAt(x, y, attr);
};


/**
 * Constructor of each BaseFinder instance.
 */
BaseFinder.prototype.constructor = BaseFinder;


/**
 * Find and return the the path.
 * @param {number} startX - The x coordinate of the start position.
 * @param {number} startY - The y coordinate of the start position.
 * @param {number} endX - The x coordinate of the end position.
 * @param {number} endY - The y coordinate of the end position.
 * @param {Grid} grid - The grid holding the nodes' status.
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
BaseFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.grid = grid;

    this.gridWidth = grid.width;
    this.gridHeight = grid.height;

    return this._find();
};


/**
 * Construct the path according to the nodes' parents.
 * @protected
 * @return {Array.<Array.<number>>} The path, including
 *     both start and end positions.
 */
BaseFinder.prototype._constructPath = function() {
    var sx = this.startX, sy = this.startY,
        x, y,
        grid = this.grid,
        path = [[this.endX, this.endY]];

    for (;;) {
        x = path[0][0];
        y = path[0][1];
        if (x == sx && y == sy) {
            return path;
        }
        path.unshift(grid.getAttributeAt(x, y, 'parent'));
    }

    // it should never reach here.
    return [];
};


/**
 * Path-finding procedure.
 * Note: this method is intended to be overriden by sub-classes.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
BaseFinder.prototype._find = function() {
    throw new Error('Sub-classes must implement this method');
};



//     offsets          diagonalOffsets:      
//  +---+---+---+        +---+---+---+
//  |   | 3 |   |        | 0 |   | 3 | 
//  +---+---+---+        +---+---+---+
//  | 0 |   | 2 |        |   |   |   |
//  +---+---+---+        +---+---+---+
//  |   | 1 |   |        | 1 |   | 2 |
//  +---+---+---+        +---+---+---+
// 
// if offsets[i] is valid, then
// diagonalOffsets[i] and 
// diagonalOffsets[(i + 1) % 4] is valid.
BaseFinder.xOffsets = [-1, 0, 1, 0];
BaseFinder.yOffsets = [0, 1, 0, -1];
BaseFinder.xDiagonalOffsets = [-1, -1, 1, 1]; 
BaseFinder.yDiagonalOffsets = [-1, 1, 1, -1];

module.exports = BaseFinder;
