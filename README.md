PathFinding.js
==============
#### A comprehensive path-finding library in javascript. ####

## Introduction ##

The aim of this project is to provide a path-finding library that can be easily incorporated into web games. 

It comes along with an [online demo](http://qiao.github.com/PathFinding.js/visual) to show how the various algorithms execute.

## Usage ##

Download the [minified js file](http://qiao.github.com/PathFinding.js/build/PathFinding.min.js) and include it in your web page.

```html
<script type="text/javascript" src="./PathFinding.min.js"></script>
```

To build a grid-map of width 5 and height 3:

```javascript
var grid = new PF.Grid(5, 3); 
```

By default, all the nodes in the grid will be able to be walked through.
To set whether a node at a given coordinate is walkable or not, use the `setWalkableAt` method.

For example, to set the node at (0, 1) to be un-walkable, where 0 is the x coordinate (from left to right), and 
1 is the y coordinate (from up to down):

```javascript
grid.setWalkableAt(0, 1, false);
```

You may also pass in a matrix while instantiating the `PF.Grid` class.
It will initiate all the nodes in the grid with the same walkability indicated by the matrix.
0 for walkable while 1 for blocked.

```javascript
var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];
var grid = new PF.Grid(5, 3, matrix);
```

Currently there are eight path-finders bundled in this library, namely:

*  `AStarFinder`
*  `BreadthFirstFinder`
*  `BestFirstFinder`
*  `DijkstraFinder`
*  `BiAStarFinder`
*  `BiBestFirstFinder`
*  `BiDijkstraFinder`
*  `BiBreadthFirstFinder`

(The suffix `Bi` for the last four finders in the above list stands for the bi-directional searching strategy.)

To build a path-finder:

```javascript
var finder = new PF.AStarFinder();
```

To find a path from (1, 2) to (4, 2):

```javascript
var path = finder.findPath(1, 2, 4, 2, grid);
```

`path` will be an array of coordinates including both the start and end positions.

Note: `grid` will be modified in each path-finding, and will not be usable afterwards. If you want to use a single grid multiple times, create a clone for it before calling `findPath`.

```javascript
var grid_backup = grid.clone();
```

For a detailed API document, see http://qiao.github.com/PathFinding.js/doc


## License ##

This project is released under the [MIT License](http://www.opensource.org/licenses/mit-license.php) .
