/**
 * Breadth-First-Search path finder.
 * @constructor
 * @extends PF.BaseFinder
 * @param {boolean} opt - opt.allowDiagonal: Whether diagonal movement is allowed.
 */
PF.BreadthFirstFinder = function(opt) {
    PF.BaseFinder.call(this, opt);
};


/**
 * Extends the base finder.
 */
PF.BreadthFirstFinder.prototype = new PF.BaseFinder();


/**
 * The constructor of the instance.
 */
PF.BreadthFirstFinder.prototype.constructor = PF.BreadthFirstFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
PF.BreadthFirstFinder.prototype._find = function() {
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
PF.BreadthFirstFinder.prototype._inspectNodeAt = function(x, y, px, py) {
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
PF.BreadthFirstFinder.prototype._inspectSurround = function(x, y) {
    var xOffsets = PF.BaseFinder.xOffsets,
        yOffsets = PF.BaseFinder.yOffsets,
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
PF.BreadthFirstFinder.prototype._inspectSurroundDiagonal = function(x, y) {
    var xOffsets = PF.BaseFinder.xOffsets,
        yOffsets = PF.BaseFinder.yOffsets,
        xDiagonalOffsets = PF.BaseFinder.xDiagonalOffsets,
        yDiagonalOffsets = PF.BaseFinder.yDiagonalOffsets,
        grid = this.grid,
        i, nx, ny, diagonalCan = [];

    for (i = 0; i < xOffsets.length; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            this._inspectNodeAt(nx, ny, x, y);

            diagonalCan.push(i);
        }
    }   

    // further inspect diagonal nodes
    for (i = 0; i < diagonalCan.length; ++i) {
        nx = x + xDiagonalOffsets[diagonalCan[i]];
        ny = y + yDiagonalOffsets[diagonalCan[i]];
        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            this._inspectNodeAt(nx, ny, x, y);
        }
    }
};
