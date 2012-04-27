var BaseFinder = require('./base');

/**
 * Breadth-First-Search path finder.
 * @constructor
 * @extends BaseFinder
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
function BreadthFirstFinder(opt) {
    BaseFinder.call(this, opt);
};


/**
 * Extends the base finder.
 */
BreadthFirstFinder.prototype = new BaseFinder();


/**
 * The constructor of the instance.
 */
BreadthFirstFinder.prototype.constructor = BreadthFirstFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
BreadthFirstFinder.prototype._find = function() {
    var openList = [],
        pos,
        x, y,    // current x, y
        nx, ny,  // next x, y
        sx = this.startX, sy = this.startY,
        ex = this.endX, ey = this.endY,
        grid = this.grid;

    this.openList = openList;

    // push the start pos into the queue
    openList.push([sx, sy]);
    grid.setAttributeAt(sx, sy, 'opened', true);

    // while the queue is not empty
    while (openList.length) {
        // take the front node from the queue
        pos = openList.shift();
        x = pos[0]; 
        y = pos[1];
        grid.setAttributeAt(x, y, 'closed', true);

        if (x == ex && y == ey) {
            return this._constructPath();
        }

        // inspect the adjacent positions
        this._inspectSurround(x, y);
    }
    
    // fail to find the path
    return [];
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
 */
BreadthFirstFinder.prototype._inspectNodeAt = function(x, y, px, py) {
    var grid = this.grid,
        node = grid.getNodeAt(x, y);

    if (node.get('closed') || node.get('opened')) {
        return;
    }
    this.openList.push([x, y]);
    grid.setAttributeAt(x, y, 'opened', true);
    grid.setAttributeAt(x, y, 'parent', [px, py]);
};


/**
 * Inspect the surrounding nodes of the given position
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
BreadthFirstFinder.prototype._inspectSurround = function(x, y) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        grid = this.grid,
        i, nx, ny;

    for (i = 0; i < xOffsets.length; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            this._inspectNodeAt(nx, ny, x, y);
        }
    }
};


/**
 * Inspect the surrounding nodes of the given position
 * (including the diagonal ones).
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
BreadthFirstFinder.prototype._inspectSurroundDiagonal = function(x, y) {
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
            this._inspectNodeAt(nx, ny, x, y);

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
                this._inspectNodeAt(nx, ny, x, y);
            }
        }
    }
};

module.exports = BreadthFirstFinder;
