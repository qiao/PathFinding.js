PF.BaseFinder = function() {
    
};

PF.BaseFinder.prototype.init = function(startX, startY, endX, endY, grid) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.grid = grid;

    this.gridHeight = grid.numCols;
    this.gridWidth = grid.numRows;
};

PF.BaseFinder.prototype.isValidPos = function(x, y) {
    return this.grid.isValidPos(x, y);
};

PF.BaseFinder.prototype.setWalkable = function(x, y, walkable) {
    this.grid.setWalkable(x, y, walkable);
};

PF.BaseFinder.constructor = PF.BaseFinder;
