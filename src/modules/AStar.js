PF.AStarFinder = function AStarFinder(startX, startY, endX, endY, grid) {
    PF.BaseFinder.call(this, startX, startY, endX, endY, grid);
};

AStarFinder.prototype = new PF.BaseFinder();
AstarFinder.prototype.constructor = AstarFinder;

return AStarFinder;

