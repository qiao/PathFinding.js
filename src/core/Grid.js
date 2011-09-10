PF.Grid = function(numRows, numCols, matrix) {
    var i, j, 
        nodes = [], 
        rowNodes;

    this.numRows = numRows;
    this.numCols = numCols;

    for (i = 0; i < numCols; ++i) {
        nodes.push([]);  // push is faster than assignment via indexing
        for (j = 0; j < numRows; ++j) {
            nodes[i].push(new PF.Node(j, i));
        }            
    }

    this.nodes = nodes;
};
