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
 */
PF.Node = function(x, y) {
    /**
     * The x coordinate of the node on the grid.
     * @private
     * @type number
     */
    this.x = x;
    /**
     * The y coordinate of the node on the grid.
     * @private
     * @type number
     */
    this.y = y;
    /**
     * Whether this node can be walked through.
     * @private
     * @type boolean
     */
    this.walkable = true;
    /**
     * This node's parent node. 
     * This variable will be used to construct the path after the search is done.
     * @private
     * @type Array.<number, number>
     */
    this.parent = null;
};


PF.Node.prototype.constructor = PF.Node;


/**
 * Generic setter of the attribute of the node.
 * @param {string} attr - Attribute name.
 * @param {*} value - Attribute value.
 */
PF.Node.prototype.set = function(attr, value) {
    this[attr] = value;
};


/**
 * Generic getter of the attribute of the node.
 * @param {string} attr - Attribute name
 * @return {*} The value of the attribute.
 */
PF.Node.prototype.get = function(attr) {
    return this[attr];
};
