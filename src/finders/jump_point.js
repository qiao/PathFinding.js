var BaseFinder = require('./base');
var Heuristic  = require('../core/heuristic');
var Heap       = require('../core/heap');

/**
 * Path finder using the Jump Point Search algorithm
 * @constructor
 * @extends BaseFinder
 * @requires Heap
 * @requires Heuristic
 * @param {boolean} opt -
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
function JumpPointFinder(opt) {
    opt = opt || {};
    BaseFinder.call(this, opt);
    this.heuristic = opt.heuristic || Heuristic.manhattan;
}


/**
 * Extends the BaseFinder
 */
JumpPointFinder.prototype = new BaseFinder();


/**
 * The constructor of the instance.
 */
JumpPointFinder.prototype.constructor = JumpPointFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
JumpPointFinder.prototype._find = function() {
    var x, y,    // current x, y
        sx = this.startX,
        sy = this.startY,
        ex = this.endX,
        ey = this.endY,
        grid = this.grid,
        openList = new Heap(function(posA, posB) {
            var fa = grid.getAttributeAt(posA[0], posA[1], 'f'),
                fb = grid.getAttributeAt(posB[0], posB[1], 'f');
            if (fa != fb) {
                return fa < fb;
            } else {
                return grid.getAttributeAt(posA[0], posA[1], 'h') <
                       grid.getAttributeAt(posB[0], posB[1], 'h');
            }
        }),
        pos,
        node;

    this.openList = openList;

    // set the `g` and `f` value of the start node to be 0
    node = grid.getNodeAt(sx, sy);
    node.set('g', 0);
    node.set('f', 0);

    // push the start node into the open list
    openList.push([sx, sy]);
    node.set('opened', true);

    // while the open list is not empty
    while (!openList.isEmpty()) {
        // pop the position of node which has the minimum `f` value.
        pos = openList.pop();
        x = pos[0];
        y = pos[1];
        grid.setAttributeAt(x, y, 'closed', true);

        // if reached the end position, construct the path and return it
        if (x == ex && y == ey) {
            return this._constructPath();
        }

        this._identifySuccessors(x,y);
    }

    // fail to find the path
    return [];
};

/**
 * Identify successors for the given node. Runs a jump point search in the
 * direction of each available neighbor, adding any points found to the open
 * list.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
JumpPointFinder.prototype._identifySuccessors = function(x,y) {
    var neighbors = this._findNeighbors(x,y),
        jumpPoint, nx, ny, dx, dy, i;
    for(i = 0; i < neighbors.length; i++) {
        nx = neighbors[i][0];
        ny = neighbors[i][1];
        dx = nx-x;
        dy = ny-y;
        jumpPoint = this._jump(nx, ny, x, y);
        if (jumpPoint) {
            this._inspectNodeAt(jumpPoint[0], jumpPoint[1], x, y);
        }
    }
};

/**
 Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 * @return {Array.<[number, number]>} The x, y coordinate of the jump point
 *     found, or null if not found
 */
JumpPointFinder.prototype._jump = function(x,y,px,py) {
    var grid = this.grid,
        dx = x - px, dy = y - py, jx, jy;
    if (!this._isOpen(x,y)) {
        return null;
    }
    else if (x == this.endX && y == this.endY) {
        return [x,y];
    }

    // check for forced neighbors
    // along the diagonal
    if (dx !== 0 && dy !== 0) {
        if ((this._isOpen(x - dx, y + dy) && !this._isOpen(x - dx, y)) ||
            (this._isOpen(x + dx, y - dy) && !this._isOpen(x, y - dy))) {
            return [x,y];
        }
    }
    // horizontally/vertically
    else {
        if( dx !== 0 ) { // moving along x
            if((this._isOpen(x + dx, y + 1) && !this._isOpen(x, y + 1)) ||
               (this._isOpen(x + dx, y - 1) && !this._isOpen(x, y - 1))) {
                return [x,y];
            }
        }
        else {
            if((this._isOpen(x + 1, y + dy) && !this._isOpen(x + 1, y)) ||
               (this._isOpen(x - 1, y + dy) && !this._isOpen(x - 1, y))) {
                return [x,y];
            }
        }
    }

    // when moving diagonally, must check for vertical/horizontal jump points
    if (dx !== 0 && dy !== 0) {
        jx = this._jump(x + dx, y, x, y);
        jy = this._jump(x, y + dy, x, y);
        if (jx || jy) {
            return [x,y];
        }
    }

    // moving diagonally, must make sure one of the vertical/horizontal
    // neighbors is open to allow the path
    if (this._isOpen(x + dx, y) || this._isOpen(x, y + dy)) {
        return this._jump(x + dx, y + dy, x, y);
    }
    else {
        return null;
    }
};

/**
 * Check if a point on the grid is present and walkable.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} True if the point is available and walkable.
 */
JumpPointFinder.prototype._isOpen = function(x, y) {
    var grid = this.grid;
    return grid.isInside(x,y) && grid.isWalkableAt(x,y);
};

/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {Array.<[number, number]>} The neighbors found.
 */
JumpPointFinder.prototype._findNeighbors = function(x, y) {
    var grid = this.grid,
        node = grid.getNodeAt(x, y),
        parent = node.get('parent'),
        xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        xDiagonalOffsets = BaseFinder.xDiagonalOffsets,
        yDiagonalOffsets = BaseFinder.yDiagonalOffsets,
        i, nx, ny, dx, dy, px, py,
        neighbors = [];

    // directed pruning: can ignore most neighbors, unless forced.
    if (parent) {
        px = parent[0];
        py = parent[1];
        // get the normalized direction of travel
        dx = (x - px) / Math.max(Math.abs(x - px), 1);
        dy = (y - py) / Math.max(Math.abs(y - py), 1);

        // search diagonally
        if ( dx !== 0 && dy !== 0) {
            if (this._isOpen(x, y + dy)) {
                neighbors.push([x, y + dy]);
            }
            if (this._isOpen(x + dx, y)) {
                neighbors.push([x + dx, y]);
            }
            if (this._isOpen(x, y + dy) || this._isOpen(x + dx, y)) {
              neighbors.push([x + dx, y + dy]);
            }
            if (!this._isOpen(x - dx, y) && this._isOpen(x, y + dy)) {
                neighbors.push([x - dx, y + dy]);
            }
            if (!this._isOpen(x, y - dy) && this._isOpen(x + dx, y)) {
                neighbors.push([x + dx, y - dy]);
            }
        }
        // search horizontally/vertically
        else {
            if(dx === 0) {
                if (this._isOpen(x, y + dy)) {
                    if (this._isOpen(x, y + dy)) {
                        neighbors.push([x, y + dy]);
                    }
                    if (!this._isOpen(x + 1, y)) {
                        neighbors.push([x + 1, y + dy]);
                    }
                    if (!this._isOpen(x - 1, y)) {
                        neighbors.push([x - 1, y + dy]);
                    }
                }
            }
            else {
                if (this._isOpen(x + dx, y)) {
                    if (this._isOpen(x + dx, y)) {
                        neighbors.push([x + dx, y]);
                    }
                    if (!this._isOpen(x, y + 1)) {
                        neighbors.push([x + dx, y + 1]);
                    }
                    if (!this._isOpen(x, y - 1)) {
                        neighbors.push([x + dx, y - 1]);
                    }
                }
            }
        }
    }
    // return all open neighbors
    else {
        for (i = 0; i < xOffsets.length; ++i) {
            nx = x + xOffsets[i];
            ny = y + yOffsets[i];
            if (this._isOpen(nx,ny)) {
                neighbors.push([nx,ny]);
            }
            dx = xDiagonalOffsets[i];
            dy = yDiagonalOffsets[i];
            if (this._isOpen(x + dx, y + dy) &&
                (this._isOpen(x + dx, y) || this._isOpen(x, y + dy))) {
                neighbors.push([x + dx, y + dy]);
            }
        }
    }

    return neighbors;
};

/**
 * Push the position into the open list if this position is not in the list.
 * Otherwise, if the position can be accessed with a lower cost from the given
 * parent position, then update its parent and cost.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 */
JumpPointFinder.prototype._inspectNodeAt = function(x, y, px, py) {
    var grid = this.grid,
        openList = this.openList,
        node = grid.getNodeAt(x, y),
        isDiagonal = (px-x) !== 0 && (py-y) !== 0;
    if (node.get('closed')) {
        return;
    }
    if (node.get('opened')) {
        if (this._tryUpdate(x, y, px, py, isDiagonal)) {
            openList.heapify();
        }
    } else {
        node.set('opened', true);
        this._tryUpdate(x, y, px, py, isDiagonal);
        openList.push([x, y]);
    }
};


/**
 * Try to update the position's info with the given parent.
 * If this position can be accessed from the given parent with lower
 * `g` cost, then this position's parent, `g` and `f` values will be updated.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 * @param {boolean} isDiagonal - Whether [x, y] and [px, py] is diagonal
 * @return {boolean} Whether this position's info has been updated.
 */
JumpPointFinder.prototype._tryUpdate = function(x, y, px, py, isDiagonal) {
    var grid = this.grid,
        pNode = grid.getNodeAt(px, py), // parent node
        // include distance, as parent may not be immediately adjacent:
        d = Math.max(Math.abs(x-px), Math.abs(y-py)),
        ng = pNode.get('g') + (isDiagonal ? 1.4142 : 1) * d, // next `g` value
        node = grid.getNodeAt(x, y);

    if (node.get('g') === undefined || ng < node.get('g')) {
        node.set('parent', [px, py]);
        node.set('g', ng);
        node.set('h', this._calculateH(x, y));
        node.set('f', node.get('g') + node.get('h'));
        return true;
    }
    return false;
};


/**
 * Calculate the `h` value of a given position.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {number}
 */
JumpPointFinder.prototype._calculateH = function(x, y) {
    var dx = Math.abs(x - this.endX),
        dy = Math.abs(y - this.endY);
    return this.heuristic(dx, dy);
};

module.exports = JumpPointFinder;
