describe('core/Grid.js', function() {
    describe('generate without matrix', function() {
        var nCols = 10,
            nRows = 20,
            grid = new PF.Grid(nCols, nRows); 

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
                    if (matrix[i][j]) {
                        expect(grid.isWalkable(j, i)).toBeFalsy();
                    } else {
                        expect(grid.isWalkable(j, i)).toBeTruthy();
                    }
                }
            }
        });
    });
});
