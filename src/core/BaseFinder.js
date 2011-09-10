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
