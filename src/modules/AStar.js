/**
 * A* path-finder.
 * @constructor
 * @extends PF.BaseFinder
 * @requires PF.Heap
 * @param {function(number, number): number} [heuristic] - Heuristic function
 *     being used to estimate the distance(defaults to manhattan).
 * @example
 * var finder, path;
 * finder = PF.AStarFinder();
 * path = finder.findPath(...);
 *
 * // Available heuristics:
 * //     PF.AStarFinder.manhattan
 * //     PF.AStarFinder.euclidean
 * //     PF.AStarFinder.chebyshev 
 * //
 * // Sample Custom heuristic:
 * function(dx, dy) {
 *     return Math.min(dx, dy);
 * }
 */
PF.AStarFinder = function(heuristic) {
    PF.BaseFinder.call(this);

    this.heuristic = heuristic || PF.AStarFinder.manhattan;
};


/**
 * Extends the BaseFinder
 */
PF.AStarFinder.prototype = new PF.BaseFinder();


/**
 * The constructor of the instance.
 */
PF.AStarFinder.prototype.constructor = PF.AStarFinder;


/**
 * Find and return the the path.
 * @private
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
PF.AStarFinder.prototype.find = function() {
    var x, y,    // current x, y
        nx, ny,  // next x, y
        sx = this.startX,
        sy = this.startY,
        ex = this.endX,
        ey = this.endY,
        grid = this.grid,

        xOffsets = [-1, 0, 0, 1],
        yOffsets = [0, -1, 1, 0],

        openList = new PF.Heap(function(pos_a, pos_b) {
            var fa = grid.getAttributeAt(pos_a[0], pos_a[1], 'f'),
                fb = grid.getAttributeAt(pos_b[0], pos_b[1], 'f');
            if (fa != fb) {
                return fa < fb;
            } else {
                return grid.getAttributeAt(pos_a[0], pos_a[1], 'h') <
                       grid.getAttributeAt(pos_b[0], pos_b[1], 'h');
            }
        }),
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

        //XXX: debugline
        //console.log(grid.getAttributeAt(x, y, 'f'));

        // if reached the end position, construct the path and return it
        if (x == ex && y == ey) {
            return this._constructPath();
        }

        // enumerate the ajacent positions
        // TODO: make this procedure independent and switchable
        for (var i = 0; i < xOffsets.length; ++i) {
            nx = x + xOffsets[i];
            ny = y + yOffsets[i];

            if (grid.isInside(nx, ny) && grid.isWalkableAt(nx, ny)) {
                this._inspectNodeAt(nx, ny, x, y);
            }
        }
    }

    // fail to find the path
    return [];
};


/**
 * Construct the path according to the nodes' parents.
 * @private
 * @return {Array.<Array.<number>>} The path, including
 *     both start and end positions.
 */
PF.AStarFinder.prototype._constructPath = function() {
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
 * Push the position into the open list if this position is not in the list.
 * Otherwise, if the position can be accessed with a lower cost from the given
 * parent position, then update its parent and cost
 * @private
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 */
PF.AStarFinder.prototype._inspectNodeAt = function(x, y, px, py) {
    var grid = this.grid,
        openList = this.openList,
        node = grid.getNodeAt(x, y);

    if (node.get('closed')) {
        return;
    }

    if (node.get('opened')) {
        if (this._tryUpdate(x, y, px, py)) {
            openList.heapify();
        }
    } else {
        node.set('opened', true);
        this._tryUpdate(x, y, px, py);
        openList.push([x, y]);
    }
};


/**
 * Try to update the position's info with the given parent.
 * If this position can be accessed from the given parent with lower 
 * `g` cost, then this position's parent, `g` and `f` values will be updated.
 * @private
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {number} px - The x coordinate of the parent position.
 * @param {number} py - The y coordinate of the parent position.
 * @return {boolean} Whether this position's info has been updated.
 */
PF.AStarFinder.prototype._tryUpdate = function(x, y, px, py) {
    var grid = this.grid,
        pNode = grid.getNodeAt(px, py), // parent node
        ng = pNode.get('g') + 1; // next `g` value
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
 * @private
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {number}
 */
PF.AStarFinder.prototype._calculateH = function(x, y) {
    var dx = Math.abs(x - this.endX),
        dy = Math.abs(y - this.endY);
    return this.heuristic(dx, dy);
};


/**
 * Manhattan distance.
 * @description dx + dy
 */
PF.AStarFinder.manhattan = function(dx, dy) {
    return dx + dy;
};

/**
 * Euclidean distance.
 * @description sqrt(dx * dx, dy * dy)
 */
PF.AStarFinder.euclidean = function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Chebyshev distance.
 * @description max(dx, dy)
 */
PF.AStarFinder.chebyshev = function(dx, dy) {
    return Math.max(dx, dy);
};
