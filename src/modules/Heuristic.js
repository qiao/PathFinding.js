/**
 * @module Heuristic A collection of heuristic functions.
 */
PF.Heuristic = {};

/**
 * Manhattan distance.
 * @description dx + dy
 */
PF.Heuristic.manhattan = function(dx, dy) {
    return dx + dy;
};

/**
 * Euclidean distance.
 * @description sqrt(dx * dx, dy * dy)
 */
PF.Heuristic.euclidean = function(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Chebyshev distance.
 * @description max(dx, dy)
 */
PF.Heuristic.chebyshev = function(dx, dy) {
    return Math.max(dx, dy);
};
