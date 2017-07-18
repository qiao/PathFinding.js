var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');

/**
 * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 * @param {number} opt.unitSize Size of the moving unit
 */
function AStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = opt.allowDiagonal;
    this.dontCrossCorners = opt.dontCrossCorners;
    this.heuristic = opt.heuristic || Heuristic.manhattan;
    this.weight = opt.weight || 1;
    this.diagonalMovement = opt.diagonalMovement;
    this.unitSize = opt.unitSize || 1;
    this.withClearance = this.unitSize !== 1;

    if (!this.diagonalMovement) {
        if (!this.allowDiagonal) {
            this.diagonalMovement = DiagonalMovement.Never;
        } else {
            if (this.dontCrossCorners) {
                this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
            } else {
                this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
            }
        }
    }

    // When diagonal movement is allowed the manhattan heuristic is not
    //admissible. It should be octile instead
    if (this.diagonalMovement === DiagonalMovement.Never) {
        this.heuristic = opt.heuristic || Heuristic.manhattan;
    } else {
        this.heuristic = opt.heuristic || Heuristic.octile;
    }
}

/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */
AStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        heuristic = this.heuristic,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, l, x, y, ng;


    if (this.withClearance) {
        this.calculateClearance(grid);
    }
    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // get neigbours of the current node
        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    if (!this.withClearance || neighbor.clearance >= this.unitSize) {
                        openList.push(neighbor);
                    }
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

/**
 * Generate the clearance grid.
 */
AStarFinder.prototype.calculateClearance = function(grid) {
    // Recursive from the bottom right
    for (var x = grid.width-1; x>=0; x--) {
        for(var y = grid.height - 1; y>=0; y--) {
            var n = grid.getNodeAt(x, y);
            this.annotateNode(n, grid);
        }
    }
};

/**
 * Annotate a node with clearance value.
 */
AStarFinder.prototype.annotateNode = function(n, grid) {
    if (!n.walkable) {
        return 0;
    }
    var x = n.x;
    var y = n.y;
    // On border
    if (x + 1 >= grid.width || y + 1 >= grid.height) {
        n.clearance = 1;
    } else {
        // Adjacent neighbours
        var adj1 = grid.getNodeAt(x+1, y+1);
        var adj2 = grid.getNodeAt(x+1,y);
        var adj3 = grid.getNodeAt(x,y+1);
        if (adj1 && adj2 && adj3) {
            n.clearance = Math.min(adj1.clearance, adj2.clearance, adj3.clearance) + 1;
        }
    }
};

/**
 * Get a grid with clearance values
 */
AStarFinder.prototype.getClearanceGrid = function(grid) {
  var clearance = new Array(grid.height).map(item => new Array(grid.width));
  var junk = [];
  for (var y = 0; y < grid.height; y++) {
    for (var x = 0; x < grid.width; x++) {
        clearance[y][x] = grid.getNodeAt(x, y).clearance;
    }
  }
  return clearance;
}


module.exports = AStarFinder;
