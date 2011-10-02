/**
 * Breadth-First-Search path finder.
 * @constructor
 * @extends PF.BaseFinder
 */
PF.BreadthFirstFinder = function() {
    PF.BaseFinder.call(this);
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
 * @private
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
PF.BreadthFirstFinder.prototype.find = function() {
    var openList = [],
        pos,
        x, y,    // current x, y
        nx, ny,  // next x, y
        sx = this.startX, sy = this.startY,
        ex = this.endX, ey = this.endY,
        grid = this.grid,

        xOffsets = [-1, 0, 0, 1],
        yOffsets = [0, -1, 1, 0];

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

        // enumerate the adjacent positions
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
 * Push the position into the open list if this position is not in the list.
 * Otherwise, if the position can be accessed with a lower cost from the given
 * parent position, then update its parent and cost
 * @private
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
}


/**
 * Construct the path according to the nodes' parents.
 * @private
 * @return {Array.<Array.<number>>} The path, including
 *     both start and end positions.
 */
PF.BreadthFirstFinder.prototype._constructPath = function() {
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
