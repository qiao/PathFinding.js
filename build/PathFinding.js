/**
 * @namespace PF 
 */
var PF = PF || {};
/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {integer} x The x coordinate of the node on the grid.
 * @param {integer} x The y coordinate of the node on the grid.
 */
PF.Node = function(x, y) {
    /**
     * The x coordinate of the node on the grid.
     * @type integer
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type integer
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = true;
    /**
     * This node's parent node. 
     * @type Array.<integer, integer>
     * This variable will be used to construct the path after the search is done.
     */
    this.parent = null;
};
/**
 * The Grid class, which serves as the encapsulation of the layout of the 
 * nodes on the map.
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
 * Get the node at the given position.
 * @param {integer} x The x coordinate of the node.
 * @param {integer} y The y coordinate of the node.
 * @return {PF.Node}
 */
PF.Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[y][x];
};


/**
 * Determine whether the node on the given position is walkable.
 * @param {integer} x The x coordinate of the node.
 * @param {integer} y The y coordinate of the node.
 * @return {boolean} The walkability of the node.
 */
PF.Grid.prototype.isWalkableAt = function(x, y) {
    return this.getNodeAt(x, y).walkable;
};


/**
 * Set the walkability of the node on the given position.
 * @param {integer} x The x coordinate of the node.
 * @param {integer} y The y coordinate of the node.
 */
PF.Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.getNodeAt(x, y).walkable = walkable;
};


/**
 * Determine whether the given position is inside the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether the position is inside.
 */
PF.Grid.prototype.isInside = function(x, y) {
    return x >= 0 && x < this.width &&
           y >= 0 && y < this.height;
};

/**
 * Generic setter of the attribute at the given position.
 * *Note*: This method gets the same result as:
 *     {@code node = grid.getNodeAt(x, y);
 *            node[attr] = value;}
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to set.
 * @param {object} value The value of attribute.
 */
PF.Grid.prototype.setAttributeAt = function(x, y, attr, value) {
    this.getNodeAt(x, y)[attr] = value;
};

/**
 * Generic getter of the attribute at the given position.
 * *Note*: This method gets the same result as:
 *     {@code node = grid.getNodeAt(x, y);
 *            return node[attr];}
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to get.
 * @return {object} The value of the attribute.
 */
PF.Grid.prototype.getAttributeAt = function(x, y, attr) {
    return this.getNodeAt(x, y)[attr];
};
/**
 * A base class for path-finders.
 * This class *SHOULD NOT* be directly instantiated, as it does not provide 
 * any path-finding algorithms or methods and is intended to be extended 
 * by all the other path-finder classes.
 *
 * *Note*: The constructor does *NOT* receive any arguments for instantiation.
 *     All the parameters should be passed in in the {@code init} method.
 *     Therefore, you only need to instantiate this class once, and call
 *     the {@code init} method each time you start a new path-finding.
 * @constructor
 */
PF.BaseFinder = function() {
    this.startX = null; // avoids to be garbage collected
    this.startY = null;
    this.endX = null;
    this.endY = null;
    this.grid = null;

    this.gridHeight = null;
    this.gridWidth = null;
};

/**
 * Initiate the path-finder by providing the coordinates and the grid.
 * @param {integer} startX The x coordinate of the start position.
 * @param {integer} startY The y coordinate of the start position.
 * @param {integer} endX The x coordinate of the end position.
 * @param {integer} endY The y coordinate of the end position.
 */
PF.BaseFinder.prototype.init = function(startX, startY, endX, endY, grid) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.grid = grid;

    this.gridWidth = grid.width;
    this.gridHeight = grid.height;
};

/**
 * Determine whether the given postition is inside the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether it is inside.
 */
PF.BaseFinder.prototype.isInsideGrid = function(x, y) {
    // delegates to grid.
    return this.grid.isInside(x, y);
};

/**
 * Set the walkable attribute of the given position on the grid.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 */
PF.BaseFinder.prototype.setWalkableAt = function(x, y, walkable) {
    // delegates to grid.
    this.grid.setWalkableAt(x, y, walkable);
};

/**
 * Determine whether the given position on the grid is walkable.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @return {boolean} Whether it is walkable.
 */
PF.BaseFinder.prototype.isWalkableAt = function(x, y) {
    // delegates to grid.
    return this.grid.isWalkableAt(x, y);
};

/**
 * Generic setter of the attribute at the given position.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to set.
 * @param {object} value The value of attribute.
 */
PF.BaseFinder.prototype.setAttributeAt = function(x, y, attr, value) {
    // delegates to grid.
    this.grid.setAttributeAt(x, y, attr, value);
};

/**
 * Generic getter of the attribute at the given position.
 * @param {integer} x The x coordinate of the position.
 * @param {integer} y The y coordinate of the position.
 * @param {string} attr The name of attribute to get.
 * @return {object} The value of the attribute.
 */
PF.BaseFinder.prototype.getAttributeAt = function(x, y, attr) {
    // delegates to grid.
    return this.grid.getAttributeAt(x, y, attr);
};

/**
 * The constructor of each BaseFinder instance.
 */
PF.BaseFinder.prototype.constructor = PF.BaseFinder;

/**
 * Find and return the the path.
 * *NOTE*: This method is intended to be overriden by sub-classes.
 * @return {Array.<[integer, integer]>} The path, including both start and 
 *     end positions.
 */
PF.BaseFinder.prototype.findPath = function() {
    throw new Error('Not Implemented Error: ' + 
        'Sub-classes must implement this method');
};
/**
 * @fileoverview A binary heap container.
 * Based on the `heapq` module in Python's standard library.
 */

/**
 * Binary heap container.
 * @constructor
 * @param {function(*, *): boolean} [cmpFunc] A comparison function which 
 *     returns whether it's first argument is less than the second argument.
 *     If this argument is not provided, then the `<` operator will be used.
 */
PF.Heap = function(cmpFunc) {
    /**
     * Comparison function.
     * @type {function(*, *): boolean}
     * @private
     */
    this._cmp = cmpFunc || function(a, b) {return a < b;};

    /**
     * An array as a heap.
     * @type {Array.<*>}
     * @private
     */
    this._heap = [];
};


/**
 * Get the top(smallest) item from the heap.
 */
PF.Heap.prototype.top = function() {
    return this._heap[0];
};


/**
 * Get the size of the heap.
 * @return {number} The number of items in the heap.
 */
PF.Heap.prototype.size = function() {
    return this._heap.length;
};


/**
 * Determine whether the heap is empty.
 * @return {boolean}
 */
PF.Heap.prototype.isEmpty = function() {
    return !this.size();
};


/**
 * Push an item onto the heap.
 */
PF.Heap.prototype.push = function(item) {
    this._heap.push(item);
    this._siftDown(0, this._heap.length - 1);
};


/**
 * Pop the smallest item off the heap.
 */
PF.Heap.prototype.pop = function() {
    var heap, lastItem, returnItem;
    
    heap= this._heap;
    lastItem = heap.pop();

    if (heap.length) {
        returnItem = heap[0];
        heap[0] = lastItem;
        this._siftUp(0);
    } else {
        returnItem = lastItem;
    }
    return returnItem;
};


/**
 * Pop and return the current smallest value, and add the new item.
 *
 * This is more efficient than `pop()` followed by `push()`, and can be
 * more appropriate when using a fixed-size heap. Note that the value 
 * returned may be larger than the pushed item! That constrains reasonable
 * uses of this routine unless written as part of a conditional replacement:
 *
 * {@code 
 *     if (item > heap.top()) {
 *         item = heap.replace(item);
 *     }
 * }
 */
PF.Heap.prototype.replace = function(item) {
    var returnItem = this._heap[0];
    this._heap[0] = item;
    this._siftUp(0);
    return returnItem;
};


/**
 * Fast version of a push followed by a pop.
 */
PF.Heap.prototype.pushpop = function(item) {
    var heap = this._heap, t;
    
    if (heap.length && this._cmp(heap[0], item)) {
        t = heap[0];
        heap[0] = item;
        item = t;
        this._siftUp(0);
    }
    return item;
};


/**
 * Sift down the possibly out-of-order value.
 * @param {number} startPos Start index of the array as a heap.
 * @param {number} pos Index of the leaf with possiblly out-of-order value.
 * @private
 */
PF.Heap.prototype._siftDown = function(startPos, pos) {
    var heap, cmp, newItem, parentPos, parent;

    heap = this._heap;
    cmp = this._cmp;

    newItem = heap[pos];

    // Follow the path to the root, moving parents down until finding a place
    // newItem fits.
    while (pos > startPos) {
        parentPos = (pos - 1) >> 1;
        parent = heap[parentPos];
        if (cmp(newItem, parent)) {
            heap[pos] = parent;
            pos = parentPos;
            continue;
        }
        break;
    }
    heap[pos] = newItem;
};


/**
 * Sift up the possibly out-of-order value.
 * @param {number} pos Index of leaf with possibly out-of-order value.
 * @private
 */
PF.Heap.prototype._siftUp = function(pos) {
    var heap, cmp, endPos, startPos, newItem, childPos, rightPos;
    
    cmp = this._cmp;
    heap = this._heap;

    endPos = heap.length;
    startPos = pos;
    newItem = heap[pos];

    // Bubble up the smaller child until hitting a leaf.
    childPos = 2 * pos + 1; // leftmost child position
    while (childPos < endPos) {
        // Set childPos to index of smaller child. 
        rightPos = childPos + 1;
        if (rightPos < endPos && !cmp(heap[childPos], heap[rightPos])) {
            childPos = rightPos;
        }
        // Move the smaller child up.
        heap[pos] = heap[childPos];
        pos = childPos;
        childPos = 2 * pos + 1;
    }
    // The leaf at pos is empty now. Put newItem here, and bubble it up
    // to its final resting place (by sifting its parent down).
    heap[pos] = newItem;
    this._siftDown(startPos, pos);
};
/**
 * A* path-finder.
 * @constructor
 * @extends PF.BaseFinder
 * @param {function(number, number): number} [heuristic] Heuristic function
 *     being used to estimate the distance(defaults to manhattan).
 *     Available heuristics:
 *         * PF.AStarFinder.manhattan
 *         * PF.AStarFinder.euclidean
 *         * PF.AStarFinder.chebyshev
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
 * Sets the constructor of the instances.
 */
PF.AStarFinder.prototype.constructor = PF.AStarFinder;


/**
 * @inheritDoc
 */
PF.AStarFinder.prototype.init = function(startX, startY, endX, endY, grid) {
    PF.BaseFinder.prototype.init.call(this, startX, startY, endX, endY, grid);

    var grid = this.grid;

    this.openList = new PF.Heap(function(a, b) {
        return grid.getAttributeAt(a[0], a[1], 'f') < 
               grid.getAttributeAt(b[0], b[1], 'f');
    });
};


/**
 * @inheritDoc
 */
PF.AStarFinder.prototype.findPath = function() {
    var x, y,
        nx, ny, 
        sx = this.startX,
        sy = this.startY,
        ex = this.endX,
        ey = this.endY,
        openList = this.openList,
        grid = this.grid,
        node;

        xOffsets = [-1, 0, 0, 1],
        yOffsets = [0, -1, 1, 0];
    
    // set the `g` and `f` value of the start node to be 0
    node = grid.getNodeAt(sx, sy);
    node.g = 0;
    node.f = 0;

    // push the start node into the open list
    openList.push([sx, sy]);
    node.opened = true;

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

    return [];
};


/**
 * Construct the path according to the nodes' parents.
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
 * @param {number} x The x coordinate of the position.
 * @param {number} y The y coordinate of the position.
 * @param {number} x The x coordinate of the parent position.
 * @param {number} y The y coordinate of the parent position.
 */
PF.AStarFinder.prototype._inspectNodeAt = function(x, y, px, py) {
    var grid = this.grid,
        openList = this.openList,
        node = grid.getNodeAt(x, y);

    if (node.closed) {
        return;
    }

    if (node.opened) {
        //
    } else {
        node.opened = true;
        openList.push([x, y]);
    }
    this._tryUpdate(x, y, px, py);
};


/**
 * Try to update the position's info with the given parent.
 * If this position can be accessed from the given parent with lower 
 * `g` cost, then this position's parent, `g` and `f` values will be updated.
 * @private
 * @param {number} x The x coordinate of the position.
 * @param {number} y The y coordinate of the position.
 * @param {number} x The x coordinate of the parent position.
 * @param {number} y The y coordinate of the parent position.
 * @return {boolean} Whether this position's info has been updated.
 */
PF.AStarFinder.prototype._tryUpdate = function(x, y, px, py) {
    var grid = this.grid,
        pNode = grid.getNodeAt(px, py), // parent node
        ng = pNode.g + 1; // next `g` value
        node = grid.getNodeAt(x, y);

    if (node.g === undefined || ng < node.g) {
        node.parent = [px, py];
        node.g = ng;
        node.h = this._calculateH(x, y);
        node.f = node.g + node.h;
        return true;
    }
    return false;
};


/**
 * Calculate the `h` value of a given position.
 * @param {number} x The x coordinate of the position.
 * @param {number} y The y coordinate of the position.
 * @return {number}
 */
PF.AStarFinder.prototype._calculateH = function(x, y) {
    var dx = Math.abs(x - this.endX),
        dy = Math.abs(y - this.endY);
    return this.heuristic(dx, dy);
};


/**
 * Manhattan distance.
 * {@code dx + dy}
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.manhattan = function(dx, dy) {
    return dx + dy;
};

/**
 * Euclidean distance.
 * {@code sqrt(dx * dx, dy * dy)}
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.euclidean = function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Chebyshev distance.
 * {@code max(dx, dy)}
 * Static method of PF.AStarFinder
 */
PF.AStarFinder.chebyshev = function(dx, dy) {
    return Math.max(dx, dy);
};
