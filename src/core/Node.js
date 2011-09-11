/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 */
PF.Node = function(x, y) {
    /**
     * The x coordinate of the node in grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node in grid.
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = true;
    /**
     * This node's parent node. 
     * This variable will be used to construct the path after the search is done.
     */
    this.parent = null;
};
