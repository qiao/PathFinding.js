var BaseFinder = require('./base');
var Heuristic  = require('../core/heuristic');
var Heap       = require('../core/heap');

/**
 * A* path-finder.
 * @constructor
 * @extends BaseFinder
 * @requires Heap
 * @requires Heuristic
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
function AStarFinder(opt) {
    opt = opt || {};
    BaseFinder.call(this, opt);
    this.heuristic = opt.heuristic || Heuristic.manhattan;
};


/**
 * Extends the BaseFinder
 */
AStarFinder.prototype = new BaseFinder();


/**
 * The constructor of the instance.
 */
AStarFinder.prototype.constructor = AStarFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
AStarFinder.prototype._find = function() {
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

        // inspect the surrounding positions
        this._inspectSurround(x, y);

    }

    // fail to find the path
    return [];
};


/**
 * Inspect the surrounding nodes of the given position
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 */
AStarFinder.prototype._inspectSurround = function(x, y) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        grid = this.grid,
        i, nx, ny;

    for (i = 0; i < 4; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            this._inspectNodeAt(nx, ny, x, y, false);
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
AStarFinder.prototype._inspectSurroundDiagonal = function(x, y) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        xDiagonalOffsets = BaseFinder.xDiagonalOffsets,
        yDiagonalOffsets = BaseFinder.yDiagonalOffsets,
        grid = this.grid,
        i, nx, ny, diagonalCan = [];
        

    for (i = 0; i < xOffsets.length; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            this._inspectNodeAt(nx, ny, x, y, false);

            diagonalCan[i] = true;
            diagonalCan[(i + 1) % 4] = true;
        }
    }   

    // further inspect diagonal nodes
    for (i = 0; i < diagonalCan.length; ++i) {
        if (diagonalCan[i]) {
            nx = x + xDiagonalOffsets[i];
            ny = y + yDiagonalOffsets[i];
            if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
                this._inspectNodeAt(nx, ny, x, y, true);
            }
        }
    }
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
 * @param {boolean} isDiagonal - Whether [x, y] and [px, py] is diagonal 
 */
AStarFinder.prototype._inspectNodeAt = function(x, y, px, py, isDiagonal) {
    var grid = this.grid,
        openList = this.openList,
        node = grid.getNodeAt(x, y);

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
AStarFinder.prototype._tryUpdate = function(x, y, px, py, isDiagonal) {
    var grid = this.grid,
        pNode = grid.getNodeAt(px, py), // parent node
        ng = pNode.get('g') + (isDiagonal ? 1.4142 : 1), // next `g` value
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
AStarFinder.prototype._calculateH = function(x, y) {
    var dx = Math.abs(x - this.endX),
        dy = Math.abs(y - this.endY);
    return this.heuristic(dx, dy);
};

module.exports = AStarFinder;
