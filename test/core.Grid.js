var Grid = require('..').Grid;

describe('Grid', function() {
    describe('generate without matrix', function() {
        var width, height, grid;

        beforeEach(function() {
            width = 10;
            height = 20;
            grid = new Grid(width, height);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should set all nodes\' walkable attribute', function() {
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    grid.isWalkableAt(j, i).should.be.true;
                }
            }
        });
    });

    describe('generate with matrix', function() {
        var matrix, grid, width, height;

        var enumPos = function(f, o) {
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    if (o) {
                        f.call(o, x, y, grid);
                    } else {
                        f(x, y, grid);
                    }
                }
            }
        };

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];
            height = matrix.length;
            width = matrix[0].length;
            grid = new Grid(width, height, matrix);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            enumPos(function(x, y, g) {
                if (matrix[y][x]) {
                    g.isWalkableAt(x, y).should.be.false;
                } else {
                    g.isWalkableAt(x, y).should.be.true;
                }
            });
        });

        it('should be able to set nodes\' walkable attribute', function() {
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, false); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.false;
            })
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, true); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.true;
            })
        });

        it('should return correct answer for position validity query', function() {
            var asserts = [
                [0, 0, true],
                [0, height - 1, true],
                [width - 1, 0, true],
                [width - 1, height - 1, true],
                [-1, -1, false],
                [0, -1, false],
                [-1, 0, false],
                [0, height, false],
                [width, 0, false],
                [width, height, false],
            ];
            
            asserts.forEach(function(v, i, a) {
                grid.isInside(v[0], v[1]).should.equal(v[2]);
            });
        });

        it('should return correct neighbors', function() {
            grid.getNeighbors(grid.nodes[1][0]).should.eql([ grid.nodes[2][0] ]);
            var cmp = function(a, b) {
                return a.x * 100 + a.y - b.x * 100 - b.y;
            };
            grid.getNeighbors(grid.nodes[0][2], true).sort(cmp).should.eql([
                grid.nodes[0][1], grid.nodes[1][2], grid.nodes[1][3]
            ].sort(cmp))
        });
    });
});
