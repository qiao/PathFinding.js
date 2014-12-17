# Getting Started
This section explains the basic usage of PathFinding.js.

## Importing in Node.js
To import PathFinding.js in your file do:

```javascript
var PF = require('pathfinding');
```

## Including in Browser
To include PathFinding.js in your page, add a script tag to your page:

```html
<script type="text/javascript" src="path/to/pathfinding-browser.min.js"></script>
```

## Finding a Path
To find a path you need a grid first. Create a 5 by 7 grid:

```javascript
var grid = new PF.Grid(5, 7);
```
This will create a grid which is walkable all over.

![Screenshot](user-guide/images/5x7EmptyGrid.png)

In this grid, the green cell at the top left is [0, 0] and the orange cell at
the bottom right is [4, 6].

Now create an instance of a finder. There are many finders available in
PathFinding.js but use the famous A* for now:

```javascript
var finder = new PF.AStarFinder();
```

Now find the path from the green cell to the orange cell:

```javascript
var path = finder.findPath(0, 0, 4, 6, grid);
```

This will return the following path:

```javascript
[[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [4, 5], [4, 6]]
```

Which when plotted on the grid looks like:

![Screenshot](user-guide/images/5x7GridWithPath.png)