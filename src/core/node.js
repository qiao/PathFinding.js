/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 *
 * Note: if you want to monitor how your algorithm works, it's better
 * to use the `set' and `get' methods when accessing the nodes' attriubtes
 * since it will be easier to add hooks.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 * @param {Node} [parent] - Parent of this node.
 */
function Node(x, y, walkable, parent) {
    /**
     * The x coordinate of the node on the grid.
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @type boolean
     */
    this.walkable = (walkable === undefined ? true : walkable);
    /**
     * This node's parent node. 
     * This variable will be used to construct the path after the search is done.
     * @type Node
     */
    this.parent = (parent === undefined ? null : parent);
};


Node.prototype.constructor = Node;

/**
 * Get a clone of this node.
 * @return {Node} Cloned node.
 */
Node.prototype.clone = function() {
    return new Node(this.x, this.y, this.walkable, this.parent);
};

module.exports = Node;
