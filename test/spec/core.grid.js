describe('core/Grid.js', function() {
    describe('generate without matrix', function() {
        var nCols, nRows, grid;

        beforeEach(function() {
            nCols = 10;
            nRows = 20;
            grid = new PF.Grid(nCols, nRows);
        });

        it('should be defined', function() {
            expect(grid).toBeDefined();
        });

        it('should have correct size', function() {
            expect(grid.numCols).toBe(nCols);
            expect(grid.numRows).toBe(nRows);

            expect(grid.nodes.length).toBe(nRows);
            for (var i = 0; i < nRows; ++i) {
                expect(grid.nodes[i].length).toBe(nCols); 
            }
        });

        it('should set all nodes\' walkable attribute', function() {
            for (var i = 0; i < nRows; ++i) {
                for (var j = 0; j < nCols; ++j) {
                    expect(grid.isWalkable(j, i)).toBeTruthy();
                }
            }
        });
    });

    describe('generate with matrix', function() {
        var matrix, grid, nCols, nRows;

        var gridForEach = function(f) {
            for (var y = 0; y < nRows; ++y) {
                for (var x = 0; x < nCols; ++x) {
                    f.call(grid, x, y)
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
            nRows = matrix.length;
            nCols = matrix[0].length;
            grid = new PF.Grid(nCols, nRows, matrix);
        });

        it('should be defined', function() {
            expect(grid).toBeDefined(); 
        });

        it('should have correct size', function() {
            expect(grid.numCols).toBe(nCols);
            expect(grid.numRows).toBe(nRows);

            expect(grid.nodes.length).toBe(nRows);
            for (var i = 0; i < nRows; ++i) {
                expect(grid.nodes[i].length).toBe(nCols); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            gridForEach(function(x, y) {
                if (matrix[y][x]) {
                    expect(this.isWalkable(x, y)).toBeFalsy();
                } else {
                    expect(this.isWalkable(x, y)).toBeTruthy();
                }
            });
        });

        it('should be able to set nodes\' walkable attribute', function() {
            gridForEach(function(x, y) {
                this.setWalkable(x, y, false); 
            });
            gridForEach(function(x, y) {
                expect(this.isWalkable(x, y)).toBeFalsy();
            })
            gridForEach(function(x, y) {
                this.setWalkable(x, y, true); 
            });
            gridForEach(function(x, y) {
                expect(this.isWalkable(x, y)).toBeTruthy();
            })
        });

        it('should return correct answer for position validity query', function() {
            var posTest = function(x, y, isValid) {
                expect(grid.isValidPos(x, y)).toBe(isValid);
            };

            var asserts = [
                [0, 0, true],
                [0, nRows - 1, true],
                [nCols - 1, 0, true],
                [nCols - 1, nRows - 1, true],
                [-1, -1, false],
                [0, -1, false],
                [-1, 0, false],
                [0, nRows, false],
                [nCols, 0, false],
                [nCols, nRows, false],
            ];
            
            asserts.forEach(function(v, i, a) {
                posTest(v[0], v[1], v[2]);
            });
        });
    });
});
