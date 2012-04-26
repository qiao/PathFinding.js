var BaseFinder  = require('./base');
var AStarFinder = require('./astar');
var Heap        = require('../core/heap');

/**
 * Bi-directional A* path-finder.
 * @constructor
 * @extends AStarFinder
 * @requires Heap
 * @requires Heuristic
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
function BiAStarFinder(opt) {
    AStarFinder.call(this, opt);
};


BiAStarFinder.prototype = new AStarFinder();
BiAStarFinder.prototype.constructor = BiAStarFinder;


/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
BiAStarFinder.prototype._find = function() {
    var x, y,    // current x, y
        sx = this.startX,
        sy = this.startY,
        ex = this.endX,
        ey = this.endY,
        grid = this.grid,
        node,

        heapCmpFunc = function(posA, posB) {
            var fa = grid.getAttributeAt(posA[0], posA[1], 'f'),
                fb = grid.getAttributeAt(posB[0], posB[1], 'f');
            if (fa != fb) {
                return fa < fb;
            } else {
                return grid.getAttributeAt(posA[0], posA[1], 'h') < 
                       grid.getAttributeAt(posB[0], posB[1], 'h');
            }
        },

        sourceOpenList = new Heap(heapCmpFunc),
        targetOpenList = new Heap(heapCmpFunc);

    this.sourceOpenList = sourceOpenList;
    this.targetOpenList = targetOpenList;

    // push the start node into the source open list
    // set the `g` and `f` value of the start node to be 0
    sourceOpenList.push([sx, sy]);
    node = grid.getNodeAt(sx, sy);
    node.set('g', 0);
    node.set('f', 0);
    node.set('opened', true);
    node.set('by', 'source');

    // push the start node into the target open list
    // set the `g` and `f` value of the end node to be 0
    targetOpenList.push([ex, ey]);
    node = grid.getNodeAt(ex, ey);
    node.set('g', 0);
    node.set('f', 0);
    node.set('opened', true);
    node.set('by', 'target');

    // while both open lists are not empty
    while (!(sourceOpenList.isEmpty() ||
             targetOpenList.isEmpty())) {

        if (this._expandSource() || this._expandTarget()) {
            return this.path;
        };
    }

    // path not found
    return [];
};

/**
 * Expand the source open list.
 * @return {boolean} Whether the path has been found.
 */
BiAStarFinder.prototype._expandSource = function() {
    return this._expand('source');
};


/**
 * Expand the target open list.
 * @return {boolean} Whether the path has been found.
 */
BiAStarFinder.prototype._expandTarget = function() {
    return this._expand('target');
};


/**
 * Expand one of the queues.
 * @param {string} which - Expand `source` or `target`.
 * @return {boolean} Whether the path has been found.
 */
BiAStarFinder.prototype._expand = function(which) {
    var pos, x, y, grid;

    grid = this.grid;
    pos = this[which + 'OpenList'].pop();
    x = pos[0];
    y = pos[1];
    grid.setAttributeAt(x, y, 'closed', true);
    grid.setAttributeAt(x, y, 'by', which);

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
BiAStarFinder.prototype._inspectSurround = function(x, y, which) {
    var xOffsets = BaseFinder.xOffsets,
        yOffsets = BaseFinder.yOffsets,
        grid = this.grid,
        i, nx, ny;

    for (i = 0; i < 4; ++i) {
        nx = x + xOffsets[i];
        ny = y + yOffsets[i];

        if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
            if (this._inspectNodeAt(nx, ny, x, y, false, which)) {
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
BiAStarFinder.prototype._inspectSurroundDiagonal = function(x, y, which) {
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
            if (this._inspectNodeAt(nx, ny, x, y, false, which)) {
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
                if (this._inspectNodeAt(nx, ny, x, y, true, which)) {
                    return true;
                };
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
 * @param {boolean} isDiagonal - Whether [x, y] and [px, py] is diagonal 
 * @param {string} which - Inspection by 'source' or 'target'.
 * @return {boolean} Whether the path has been found.
 */
BiAStarFinder.prototype._inspectNodeAt = function(x, y, px, py, isDiagonal, which) {
    var grid = this.grid,
        openList = this[which + 'OpenList'],
        node = grid.getNodeAt(x, y);

    if (node.get('closed')) {
        return false;
    }

    if (node.get('opened')) {
        // if this node is opened by the other expansion queue.
        // then a path is found
        if (node.get('by') != which) {
            this.pathFound = true;
            this.path = this._constructPath(x, y, px, py, which);
            return true;
        }
        if (this._tryUpdate(x, y, px, py, isDiagonal, which)) {
            openList.heapify();
        }
    } else {
        node.set('opened', true);
        node.set('by', which);
        this._tryUpdate(x, y, px, py, isDiagonal, which);
        openList.push([x, y]);
    }
    return false;
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
 * @param {string} which - Inspection by 'source' or 'target'.
 * @return {boolean} Whether this position's info has been updated.
 */
BiAStarFinder.prototype._tryUpdate = function(x, y, px, py, isDiagonal, which) {
    var grid = this.grid,
        pNode = grid.getNodeAt(px, py), // parent node
        ng = pNode.get('g') + (isDiagonal ? 1.4142 : 1), // next `g` value
        node = grid.getNodeAt(x, y);

    if (node.get('g') === undefined || ng < node.get('g')) {
        node.set('parent', [px, py]);
        node.set('g', ng);
        node.set('h', this._calculateH(x, y, which));
        node.set('f', node.get('g') + node.get('h'));
        return true;
    }
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
BiAStarFinder.prototype._constructPath = function(x1, y1, x2, y2, which) {
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


/**
 * Calculate the `h` value of a given position.
 * @protected
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} which - Inspection by `source` or `target`.
 * @return {number} The heuristic value.
 */
BiAStarFinder.prototype._calculateH = function(x, y, which) {
    if (which == 'source') {
        var dx = Math.abs(x - this.endX),
            dy = Math.abs(y - this.endY);
        return this.heuristic(dx, dy);
    } else {
        var dx = Math.abs(x - this.startX),
            dy = Math.abs(y - this.startY);
        return this.heuristic(dx, dy);
    }
};

module.exports = BiAStarFinder;
