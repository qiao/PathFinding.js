/**
 * The Grid class, which serves as the encapsulation of the nodes on the map.
 * @constructor
 * @param {integer} width Number of columns of the grid.
 * @param {integer} height Number of rows of the grid.
 * @param {Array.<Array.<integer|boolean>>} [matrix] A 0-1 matrix representing
 *     the walkable status of the nodes(0 or false for walkable). If the
 *     matrix is not supplied, all the nodes will be walkable.
 */
PF.Grid = function(width, height, matrix) {
    /**
     * The number of columns of the grid.
     * @type integer
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type integer
     */
    this.height = height;

    this.nodes = []; // avoids to be garbage collected
    
    this._buildGrid(matrix);
};

/**
 * Build the grids.
 * @private
 * @param {Array.<Array.<integer|boolean>>} [matrix] A 0-1 matrix representing
 *     the walkable status of the nodes. 
 * @see PF.Grid
 */
PF.Grid.prototype._buildGrid = function(matrix) {
    var i, j, 
        width = this.width,
        height = this.height,
        nodes = [], 
        row;

    for (i = 0; i < height; ++i) {
        nodes.push([]); // push is faster than assignment via indexing
        row = nodes[i]; 
        for (j = 0; j < width; ++j) {
            row.push(new PF.Node(j, i));
        }            
    }

    this.nodes = nodes;

    if (matrix === undefined) {
        return;
    }

    if (matrix.length != height || matrix[0].length != width) {
        throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < height; ++i) {
        for (j = 0; j < width; ++j) {
            if (matrix[i][j]) { 
                // 0, false, null will be walkable
                // while others will be un-walkable
                nodes[i][j].walkable = false;
            }
        }
    }
};


/**
 * Determine whether the node on the given position is walkable.
 * @param {integer} x The x coordinate of the node.
 * @param {integer} x The y coordinate of the node.
 * @return {boolean} The walkability of the node.
 */
PF.Grid.prototype.isWalkable = function(x, y) {
    return this.nodes[y][x].walkable;
};


/**
 * Set the walkability of the node on the given position.
 * @param {integer} x The x coordinate of the node.
 * @param {integer} x The y coordinate of the node.
 */
PF.Grid.prototype.setWalkable = function(x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


/**
 * Determine whether the given position is inside the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} x The y coordinate of the position.
 * @return {boolean} Whether the position is inside.
 */
PF.Grid.prototype.isInside = function(x, y) {
    return x >= 0 && x < this.width &&
           y >= 0 && y < this.height;
};

PF.Grid.prototype.setAttributeAt = function(x, y) {
    
};
