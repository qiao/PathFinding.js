PF.AStarFinder = (function() {

    function AStarFinder(startX, startY, endX, endY, grid) {
        PF.BaseFinder.call(this, startX, startY, endX, endY, grid);
    }

    AStarFinder.prototype = new PF.BaseFinder();
    AstarFinder.prototype.constructor = PF.AstarFinder;

    return AStarFinder;

})();
