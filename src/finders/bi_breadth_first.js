var BaseFinder         = require('./base');
var BreadthFirstFinder = require('./breadth_first');

/**
 * Bi-directional Breadth-First-Search path finder.
 * @constructor
 * @extends BreadthFirstFinder
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
function BiBreadthFirstFinder(opt) {
    BreadthFirstFinder.call(this, opt);
};


BiBreadthFirstFinder.prototype = new BreadthFirstFinder();
BiBreadthFirstFinder.prototype.constructor = BiBreadthFirstFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
BiBreadthFirstFinder.prototype._find = function() {
    var pos,
        x, y,    // current x, y
        nx, ny,  // next x, y
        sx = this.startX, sy = this.startY,
        ex = this.endX, ey = this.endY,
        grid = this.grid,
        sourceOpenList = [],
        targetOpenList = [];


    this.sourceOpenList = sourceOpenList;
    this.targetOpenList = targetOpenList;

    // push the start and end pos into the queue
    sourceOpenList.push([sx, sy]);
    grid.setAttributeAt(sx, sy, 'opened', true);
    grid.setAttributeAt(sx, sy, 'by', 'source');

    targetOpenList.push([ex, ey]);
    grid.setAttributeAt(ex, ey, 'opened', true);
    grid.setAttributeAt(ex, ey, 'by', 'target');

    // while both the queues are not empty
    while (sourceOpenList.length && targetOpenList.length) {
        if (this._expandSource() || this._expandTarget()) {
            return this.path;
        }
    }

    // fail to find the path
    return [];
};


/**
 * Expand the source open list.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._expandSource = function() {
    return this._expand('source');
};


/**
 * Expand the target open list.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._expandTarget = function() {
    return this._expand('target');
};


/**
 * Expand one of the queues.
 * @param {string} which - Expand `source` or `target`.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._expand = function(which) {
    var pos, x, y, grid = this.grid;

    // take the front node from the queue
    pos = this[which + 'OpenList'].shift();
    x = pos[0]; 
    y = pos[1];
    grid.setAttributeAt(x, y, 'closed', true);
    grid.setAttributeAt(x, y, 'by', which);

    // inspect the adjacent positions
    return this._inspectSurround(x, y, which);
};


/**
 * Inspect the surrounding nodes of the given position
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} which - Inspection by 'source' or 'target'.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._inspectSurround = function(x, y, which) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        grid = this.grid,
        i, nx, ny;

    for (i = 0; i < 4; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            if (this._inspectNodeAt(nx, ny, x, y, which)) {
                return true;
            }
        }
    }
    return false;
};


/**
 * Inspect the surrounding nodes of the given position
 * (including the diagonal ones).
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} which - Inspection by 'source' or 'target'.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._inspectSurroundDiagonal = function(x, y, which) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        xDiagonalOffsets = BaseFinder.xDiagonalOffsets,
        yDiagonalOffsets = BaseFinder.yDiagonalOffsets,
        grid = this.grid,
        i, nx, ny, diagonalCan = [];

    for (i = 0; i < 4; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            if (this._inspectNodeAt(nx, ny, x, y, which)) {
                return true;
            }

            diagonalCan[i] = true;
            diagonalCan[(i + 1) % 4] = true;
        }
    }   

    // further inspect diagonal nodes
    for (i = 0; i < 4; ++i) {
        if (diagonalCan[i]) {
            nx = x + xDiagonalOffsets[i];
            ny = y + yDiagonalOffsets[i];
            if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
                if (this._inspectNodeAt(nx, ny, x, y, which)) {
                    return true;
                }
            }
        }
    }

    return false;
};


/**
 * Push the position into the open list if this position is not in the list.
 * Otherwise, if the position can be accessed with a lower cost from the given
 * parent position, then update its parent and cost
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 * @param {string} which - Inspection by 'source' or 'target'.
 * @return {boolean} Whether the path has been found.
 */
BiBreadthFirstFinder.prototype._inspectNodeAt = function(x, y, px, py, which) {
    var grid = this.grid,
        node = grid.getNodeAt(x, y);

    if (node.get('closed')) {
        return false;
    }
    if (node.get('opened')) {
        if (node.get('by') != which) {
            this.path = this._constructPath(x, y, px, py, which);
            return true;
        }
        return false;
    }
    this[which + 'OpenList'].push([x, y]);
    grid.setAttributeAt(x, y, 'opened', true);
    grid.setAttributeAt(x, y, 'parent', [px, py]);
    grid.setAttributeAt(x, y, 'by', which);
    return false;
};



/**
 * Construct the path according to the nodes' parents.
 * @protected
 * @param {number} x1 - X coordinate of one of the meeting nodes.
 * @param {number} y1 - Y coordinate of one of the meeting nodes.
 * @param {number} x2 - X coordinate of the other meeting node.
 * @param {number} y2 - Y coordinate of the other meeting node.
 * @param {string} which - Construction initiated by `source` or `target`.
 * @return {Array.<Array.<number>>} The path, including
 *     both start and end positions.
 */
BiBreadthFirstFinder.prototype._constructPath = function(x1, y1, x2, y2, which) {
    var x, y, sx, sy, ex, ey, grid, sourcePath, targetPath;

    sx = this.startX;
    sy = this.startY;
    ex = this.endX;
    ey = this.endY;
    grid = this.grid;

    if (which == 'source') {
        sourcePath = [[x2, y2]];
        targetPath = [[x1, y1]];
    } else {
        sourcePath = [[x1, y1]];
        targetPath = [[x2, y2]];
    }

    for (;;) {
        x = sourcePath[0][0];
        y = sourcePath[0][1];
        if (x == sx && y == sy) {
            break;
        }
        sourcePath.unshift(grid.getAttributeAt(x, y, 'parent'));
    }
    for (;;) {
        x = targetPath[0][0];
        y = targetPath[0][1];
        if (x == ex && y == ey) {
            break;
        }
        targetPath.unshift(grid.getAttributeAt(x, y, 'parent'));
    }
    targetPath.reverse();

    return sourcePath.concat(targetPath);
};

module.exports = BiBreadthFirstFinder;
