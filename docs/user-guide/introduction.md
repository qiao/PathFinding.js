# Introduction

PathFinding.js is a javascript library to find paths on a 2D square grid. It
works in both node.js and browser environments.

```javascript
//Walkability matrix. Zero is walkable, One is not
var matrix = [
    [0, 0, 0, 1, 0],
    [1, 0, 0, 0, 1],
    [0, 0, 1, 0, 0],
];
var grid = new PF.Grid(matrix);
var finder = new PF.AStarFinder();
//Find path from (1, 2) to (4, 2)
var path = finder.findPath(1, 2, 4, 2, grid);
```

## Getting Help

If you stumble upon a bug or don't understand some feature of PathFinding.js,
open an issue in the 
[Issue Tracker](https://github.com/qiao/PathFinding.js/issues).

Browsing the [source](https://github.com/qiao/PathFinding.js) might also help.
A great visualization of the different pathfinding algorithms is available
[here](http://qiao.github.io/PathFinding.js/visual/).

## License

PathFinding.js is released under the 
[MIT License](http://opensource.org/licenses/mit-license.php).

(c) 2011-2012 Xueqiao Xu <xueqiaoxu@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
