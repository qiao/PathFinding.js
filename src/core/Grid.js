PF.Grid = function(numCols, numRows, matrix) {
    this.numCols = numCols;
    this.numRows = numRows;
    
    this.nodes = null; // avoid being garbage collected

    this._buildGrid(matrix);
};


PF.Grid.prototype._buildGrid = function(matrix) {
    var i, j, 
        numCols = this.numCols,
        numRows = this.numRows,
        nodes = [], 
        row;

    for (i = 0; i < numRows; ++i) {
        nodes.push([]); // push is faster than assignment via indexing
        row = nodes[i]; 
        for (j = 0; j < numCols; ++j) {
            row.push(new PF.Node(j, i));
        }            
    }

    console.log(nodes);

    if (matrix === undefined) {
        return;
    }

    if (matrix.length != numRows || matrix[0].length != numCols) {
        throw new Error('Matrix size does not fit');
    }

    for (i = 0; i < numRows; ++i) {
        for (j = 0; j < numCols; ++j) {
            if (matrix[i][j]) { 
                // 0, false, null will be walkable
                // while others will be un-walkable
                nodes[i][j].walkable = false;
            }
        }
    }

    this.nodes = nodes;
};


PF.Grid.prototype.isWalkable = function(x, y) {
    return this.nodes[y][x].walkable;
};


PF.Grid.prototype.setWalkable = function(x, y, walkable) {
    this.nodes[y][x].walkable = walkable;
};


PF.Grid.prototype.isValidPos = function(x, y) {
    return x >= 0 && x < this.numCols &&
           y >= 0 && y < this.numRows;
};
