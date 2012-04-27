/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array.<Array.<number>>} the path
 */
function backtrace(node) {
    var path = [[node.x, node.y]];
    while (node.parent) {
        node = node.parent;
        path.push([node.x, node.y]);
    }
    return path.reverse();
};
exports.backtrace = backtrace;

/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node} 
 */
function biBacktrace(nodeA, nodeB) {
    var pathA = backtrace(nodeA),
        pathB = backtrace(nodeB);
    return pathA.concat(pathB.reverse());
};
exports.biBacktrace = biBacktrace;

exports.smoothenPath = (function() {
    /**
     * Get the slope-intercept representation of a line passing
     * through the given two coordinates.
     * @private
     * @param {[number, number]} coord1
     * @param {[number, number]} coord2
     * @return {object} A hash containing the slope and intercept of the line
     */
    function getLineEquation(coord1, coord2) {
        var x1 = coord1[0],
            y1 = coord1[1],
            x2 = coord2[0],
            y2 = coord2[1],

            k = (y2 - y1) / (x2 - x1);
            b = y1 - k * x1;

        return {
            slope: k,
            intercept: b
        };
    }

    /**
     * Determine whether the line passing through coord1 and coord2 intersects
     * with an unwalkable node in the grid.
     * @private
     * @param {[number, number]} coord1
     * @param {[number, number]} coord2
     * @param {PF.Grid} grid
     * @return {boolean}
     */
    function intersects(coord1, coord2, grid) {
        var tmp, line, k, b, x, y;

        // make sure that coord1 is beneath coord2
        if (coord1[1] > coord2[1]) {
            tmp = coord1;
            coord1 = coord2;
            coord2 = tmp;
        }

        // get line 
        line = getLineEquation(coord1, coord2);
        k = line.slope;
        b = line.intercept;


        // handle vertical line
        if (slope == Infinity) {
            x = coord1[0];
            // enumerate y indices on the line
            for (y = coord1[1]; y < coord2[1]; ++y) {
                if (!grid.isWalkableAt(x, y)) {
                    return true;
                }
            }
            return false;
        }

        // enumerate y indices on the line
        for (y = coord1[1]; y < coord2[1]; ++y) {
            x = ~~(y / k - b + 0.5);
            if (!grid.isWalkableAt(x, y)) {
                return true;
            }
        }

        // make sure that coord1 is to the left of coord2
        if (coord1[0] > coord2[0]) {
            tmp = coord1;
            coord1 = coord2;
            coord2 = tmp;
        }

        // enumerate x indices on the line
        for (x = coord1[0]; x < coord2[0]; ++x) {
            y = ~~(k * x + b + 0.5);
            if (!grid.isWalkableAt(x, y)) {
                return true;
            }
        }
        return false;
    };

})();

