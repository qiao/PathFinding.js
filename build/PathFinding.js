var PF = PF || {};
PF.Node = function(x, y) {
    this.x = x;
    this.y = y;
    this.walkable = true;
    this.parent = null;
};
PF.Grid = function(numRows, numCols, matrix) {
    this.numRows = numRows;
    this.numCols = numCols;

    this._buildGrid(matrix);
};


PF.Grid.prototype._buildGrid = function(matrix) {
    var i, j, 
        nodes = [], 
        rowNodes;

    for (i = 0; i < numCols; ++i) {
        nodes.push([]);  // push is faster than assignment via indexing
        for (j = 0; j < numRows; ++j) {
            nodes[i].push(new PF.Node(j, i));
        }            
    }


    if (matrix === undefined) {
        return;
    }

    for (i = 0; i < numCols; ++i) {
        for (j = 0; j < numRows; ++j) {
            if (matrix[i][j]) { 
                // 0, false, null, undefined will be walkable
                // while others will be un-walkable
                nodes[i][j].walkable = false;
            }
        }
    }

    this.nodes = nodes;
};
PF.BaseFinder = function() {
    
};

PF.BaseFinder.prototype = {
    constructor: PF.BaseFinder,

    init: function(startX, startY, endX, endY, grid) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.grid = grid;

        this.gridHeight = grid.length;
        this.gridWidth = grid[0].length;
    },

    isValidPos: function(x, y) {
        return x >= 0 && x < this.gridWidth &&
               y >= 0 && y < this.gridHeight;
    },

    setWalkable: function(x, y, walkable) {
        this.grid[y][x].walkable = walkable;
    },
};
