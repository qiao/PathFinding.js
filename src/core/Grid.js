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
