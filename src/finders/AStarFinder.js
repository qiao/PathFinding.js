var Heap       = require('../core/Heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');

/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @extends BaseFinder
 * @requires Heap
 * @requires Heuristic
 * @param {boolean} opt - 
 *     opt.allowDiagonal: Whether diagonal movement is allowed.
 *     [opt.heuristic]: Heuristic function being used to estimate the distance
 *     (defaults to manhattan).
 */
function AStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
}

/**
 * Find and return the the path.
 * @protected
 * @return {Array.<[number, number]>} The path, including both start and 
 *     end positions.
 */
AStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f < nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        allowDiagonal = this.allowDiagonal,
        node, neighbors, neighbor, i, l,
        abs = Math.abs, SQRT2 = Math.SQRT2;

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.isEmpty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, allowDiagonal);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];
            // get the distance between current node and the neighbor
            dx = abs(neighbor.x - node.x);
            dy = abs(neighbor.y - node.y);

            // calculate the next g score
            ng = node.g + ((dx === 1 && dy === 1) ? SQRT2 : 1);

            if (neighbor.closed) {
                continue;
            }

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {

                neighbor.g = ng;
                neighbor.h = neighbor.h || heuristic(dx, dy);
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to 
                    // update its position in the open list
                    openList.heapify();
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = AStarFinder;
