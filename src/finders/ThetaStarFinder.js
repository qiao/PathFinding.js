var Heap       = require('heap');
var Util       = require('../core/Util');
var Heuristic  = require('../core/Heuristic');
var DiagonalMovement = require('../core/DiagonalMovement');
/**
 * Theta* path-finder.
 * @constructor
 * @param {object} opt
 */
function ThetaStarFinder(opt) {
    opt = opt || {};
    this.allowDiagonal = true;
    this.dontCrossCorners = true;
    this.heuristic = Heuristic.euclidean;
    this.weight = opt.weight || 1.1;
    this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
}

ThetaStarFinder.prototype.distance = function(startX, startY, endX, endY) {
    startX -= endX;
    startY -= endY;
    return Math.sqrt(startX * startX + startY * startY);
}

ThetaStarFinder.prototype.lineOfSight = function(startX, startY, endX, endY, grid) {
    var sx, sy, f, s0, s1,
        x0 = startX,
        y0 = startY,
        x1 = endX,
        y1 = endY,
        dx = x1 - x0,
        dy = y1 - y0;
    if (dx < 0) {
        dx = -dx;
        sx = -1;
    } else {
        sx = 1;
    }
    if (dy < 0) {
        dy = -dy;
        sy = -1;
    } else {
        sy = 1;
    }
    if (dx == 0) {
        for (y0 += sy; y0 != y1; y0 += sy) {
            if (!grid.isWalkableAt(x0, y0)) {
                return false;
            }
        }
        return true;
    }
    if (dy == 0) {
        for (x0 += sx; x0 != x1; x0 += sx) {
            if (!grid.isWalkableAt(x0, y0)) {
                return false;
            }
        }
        return true;
    }
    if (dx >= dy) {
        if (!grid.isWalkableAt(x0, y0 + sy) || !grid.isWalkableAt(x1, y1 - sy)) {
            return false;
        }
        for (s0 = y0, s1 = y1, f = dy; ;) {
            f += dy;
            if (f >= dx) {
                x0 += sx;
                y0 += sy;
                x1 -= sx;
                y1 -= sy;
                f -= dx;
            } else {
                x0 += sx;
                x1 -= sx;
            }
            if (x0 == x1 + sx) {
                break;
            }
            if (x0 == x1) {
                if (y0 == y1) {
                    if (!grid.isWalkableAt(x0, y0 - sy) || !grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x0, y0 + sy)) {
                        return false;
                    }
                } else {
                    if (!grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x1, y1)) {
                        return false;
                    }
                }
                break;
            }
            if (y0 != s0 && !grid.isWalkableAt(x0, y0 - sy)) {
                return false;
            }
            if (!grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x0, y0 + sy)) {
                return false;
            }
            if (y1 != s1 && !grid.isWalkableAt(x1, y1 + sy)) {
                return false;
            }
            if (!grid.isWalkableAt(x1, y1) || !grid.isWalkableAt(x1, y1 - sy)) {
                return false;
            }
        }
    }
    else {
        if (!grid.isWalkableAt(x0 + sx, y0) || !grid.isWalkableAt(x1 - sx, y1)) {
            return false;
        }
        for (s0 = x0, s1 = x1, f = dx; ;) {
            f += dx;
            if (f >= dy) {
                x0 += sx;
                y0 += sy;
                x1 -= sx;
                y1 -= sy;
                f -= dy;
            } else {
                y0 += sy;
                y1 -= sy;
            }
            if (y0 == y1 + sy) {
                break;
            }
            if (y0 == y1) {
                if (x0 == x1) {
                    if (!grid.isWalkableAt(x0 - sx, y0) || !grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x0 + sx, y0)) {
                        return false;
                    }
                } else {
                    if (!grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x1, y1)) {
                        return false;
                    }
                }
                break;
            }
            if (x0 != s0 && !grid.isWalkableAt(x0 - sx, y0)) {
                return false;
            }
            if (!grid.isWalkableAt(x0, y0) || !grid.isWalkableAt(x0 + sx, y0)) {
                return false;
            }
            if (x1 != s1 && !grid.isWalkableAt(x1 + sx, y1)) {
                return false;
            }
            if (!grid.isWalkableAt(x1, y1) || !grid.isWalkableAt(x1 - sx, y1)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * Find and return the the path.
 * @return {Array.<[number, number]>} The path, including both start and
 *     end positions.
 */
ThetaStarFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        startNode = grid.getNodeAt(startX, startY),
        endNode = grid.getNodeAt(endX, endY),
        distance = this.distance,
        lineOfSight = this.lineOfSight,
        diagonalMovement = this.diagonalMovement,
        weight = this.weight,
        node, neighbors, neighbor, i, l, x, y, ng;

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

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (node.parent && lineOfSight(x, y, node.parent.x, node.parent.y, grid)) {
                ng = node.parent.g + distance(x, y, node.parent.x, node.parent.y);
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.parent = node.parent;
                } else {
                    continue;
                }
            }
            else {
                ng = node.g + distance(x, y, node.x, node.y);
                if (!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng;
                    neighbor.parent = node;
                } else {
                    continue;
                }
            }
            neighbor.h = neighbor.h || weight * distance(x, y, endX, endY);
            neighbor.f = neighbor.g + neighbor.h;

            if (!neighbor.opened) {
                openList.push(neighbor);
                neighbor.opened = true;
            } else {
                // the neighbor can be reached with smaller cost.
                // Since its f value has been updated, we have to
                // update its position in the open list
                openList.updateItem(neighbor);
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
};

module.exports = ThetaStarFinder;
