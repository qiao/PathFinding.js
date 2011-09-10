var PATH_FINDING = PATH_FINDING || {};
PATH_FINDING.BaseFinder = function(startX, startY, endX, endY, graph) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.graph = graph;
};
