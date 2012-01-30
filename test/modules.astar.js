var AStarFinder = require('../src/modules/astar.js').AStarFinder;
var pathTest    = require('./path_test').pathTest;

pathTest('AStar', new AStarFinder());
