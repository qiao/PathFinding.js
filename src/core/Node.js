/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {integer} x The x coordinate of the node on the grid.
 * @param {integer} x The y coordinate of the node on the grid.
 */
PF.Node = function(x, y) {
    /**
     * The x coordinate of the node on the grid.
     * @type integer
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type integer
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = true;
    /**
     * This node's parent node. 
     * @type PF.Node
     * This variable will be used to construct the path after the search is done.
     */
    this.parent = null;
};
