var Node = require('./node');

/**
 * The Grid class, which serves as the encapsulation of the layout of the 
 * nodes on the map.
 * @constructor
 * @param {number} width Number of columns of the grid.
 * @param {number} height Number of rows of the grid.
 * @param {Array.<Array.<(number|boolean)>>} [matrix] - A 0-1 matrix 
 *     representing the walkable status of the nodes(0 or false for walkable). 
 *     If the matrix is not supplied, all the nodes will be walkable.
 */
function Grid(width, height, matrix) {
    /**
     * The number of columns of the grid.
     * @type number
     */
    this.width = width;
    /**
     * The number of rows of the grid.
     * @type number
     */
    this.height = height;

    this._buildGrid(matrix);
};

/**
 * Build the grids.
 * @private
 * @param {Array.<Array.<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes. 
 * @see Grid
 */
Grid.prototype._buildGrid = function(matrix) {
    var i, j, 
        width = this.width,
        height = this.height,
        nodes = [], 
        row;

    for (i = 0; i < height; ++i) {
        nodes.push([]); // push is faster than assignment via indexing
        row = nodes[i]; 
        for (j = 0; j < width; ++j) {
            row.push(new Node(j, i));
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
 * Get the node at the given position.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {Node}
 */
Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};


/**
 * Determine whether the node on the given position is walkable.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */
Grid.prototype.isWalkableAt = function(x, y) {
    return this.getNodeAt(x, y).get('walkable');
};


/**
 * Set whether the node on the given position is walkable.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */
Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.getNodeAt(x, y).set('walkable', walkable);
};


/**
 * Determine whether the given position is inside the grid.
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @return {boolean} Whether the position is inside.
 */
Grid.prototype.isInside = function(x, y) {
    return x >= 0 && x < this.width &&
           y >= 0 && y < this.height;
};

/**
 * Generic setter of the attribute at the given position.
 * Note: This method gets the same result as:
 *     {@code node = grid.getNodeAt(x, y);
 *            node[attr] = value;}
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} attr - The name of attribute to set.
 * @param {*} value - The value of attribute.
 */
Grid.prototype.setAttributeAt = function(x, y, attr, value) {
    this.getNodeAt(x, y).set(attr, value);
};

/**
 * Generic getter of the attribute at the given position.
 * Note: This method gets the same result as:
 *     {@code node = grid.getNodeAt(x, y);
 *            return node[attr];}
 * @param {number} x - The x coordinate of the position.
 * @param {number} y - The y coordinate of the position.
 * @param {string} attr - The name of attribute to get.
 * @return The value of the attribute.
 */
Grid.prototype.getAttributeAt = function(x, y, attr) {
    return this.getNodeAt(x, y).get(attr);
};


/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */
Grid.prototype.clone = function() {
    var i, j,

        width = this.width,
        height = this.height,
        thisNodes = this.nodes,

        newGrid = new Grid(width, height),
        newNodes = [], 
        row;

    for (i = 0; i < height; ++i) {
        newNodes.push([]);
        row = newNodes[i];
        for (j = 0; j < width; ++j) {
            row.push(thisNodes[i][j].clone());
        }
    }

    newGrid.nodes = newNodes;

    return newGrid;
};

module.exports = Grid;
