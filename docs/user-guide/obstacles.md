# Obstacles
A grid without any obstacles is boring. Let us create a grid with obstacles:

```javascript
var walkabilityMatrix = [[0, 0, 0, 0, 0],
                         [1, 1, 1, 1, 0],
                         [0, 0, 0, 0, 0],
                         [0, 1, 1, 1, 1],
                         [0, 0, 0, 0, 0],
                         [1, 1, 1, 1, 0],
                         [0, 0, 0, 0, 0]];
var grid = new PF.Grid(matrix);
```

The _walkabilityMatrix_ defines which cells are walkable and which have
obstacles. Ones are obstacles and zeroes are walkable. Alternatively, you can
also set the obstacles on the grid by calling the `setWalkableAt` function:

```javascript
var grid = new PF.Grid(5, 7);
grid.setWalkableAt(0, 1, false);
grid.setWalkableAt(1, 1, false);
grid.setWalkableAt(2, 1, false);
...
```

After setting the obstacles the grid should look like this.

![Screenshot](user-guide/images/5x7GridWithObstacles.png)

Let us find a path now.

```javascript
var finder = new PF.AStarFinder();
var path = finder.findPath(0, 0, 4, 6, grid);
```

PathFinding.js will find the following path:

![Screenshot](user-guide/images/5x7GridWithObstaclesAndPath.png)

Notice how the path moves diagonally where it can, thus making it shorter. This
may not be always desirable and you may want to create a path without any
diagonal movement. Read the next section to find out how to achieve that.
