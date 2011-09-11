describe('core/Grid.js', function() {
    it('should generate a grid with undefined matrix', function() {
        var grid = new PF.Grid(10, 20);
        expect(grid).toBeDefined();
        expect(grid.numCols).toBe(10);
        expect(grid.numRows).toBe(20);
    });
    it('should generate a grid with custom matrix', function() {
        var matrix = [
            [1, 0, 0, 1],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [1, 0, 0, 1],
        ];
        var grid = new PF.Grid(4, 5, matrix);

        expect(grid).toBeDefined();
        expect(grid.numCols).toBe(4);
        expect(grid.numRows).toBe(5);

        for (var i = 0; i < 5; ++i) {
            for (var j = 0; j < 4; ++j) {
                if (matrix[i][j]) {
                    expect(grid.isWalkable(j, i)).toBeFalsy();
                }
            }
        }
    })
});
