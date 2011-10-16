/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
PF.Heuristic = {};

/**
 * Manhattan distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} dx + dy
 */
PF.Heuristic.manhattan = function(dx, dy) {
    return dx + dy;
};

/**
 * Euclidean distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} sqrt(dx * dx + dy * dy)
 */
PF.Heuristic.euclidean = function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Chebyshev distance.
 * @param {number} dx - Difference in x.
 * @param {number} dy - Difference in y.
 * @return {number} max(dx, dy)
 */
PF.Heuristic.chebyshev = function(dx, dy) {
    return Math.max(dx, dy);
};
