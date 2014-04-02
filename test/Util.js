var PF = require('..');

describe('Utility functions', function () {
    describe('interpolate', function () {
        it('should return the interpolated path', function () {
            PF.Util.interpolate(0, 1, 0, 4).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]);
        });
    });

    describe('expandPath', function () {
        it('should return an empty array given an empty array', function () {
            PF.Util.expandPath([]).should.eql([]);
        });

        it('should return the expanded path', function () {
            PF.Util.expandPath([
                [0, 1], [0, 4]
            ]).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]);

            PF.Util.expandPath([
                [0, 1], [0, 4], [2, 6]
            ]).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]
            ]);
        });
    });

    describe('compressPath', function () {
        it('should return the original path if it is too short to compress', function () {
            PF.Util.compressPath([]).should.eql([]);
        });

        it('should return a compressed path', function () {
            PF.Util.compressPath([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]).should.eql([
                [0, 1], [0, 4]
            ]);

            PF.Util.compressPath([
                [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]
            ]).should.eql([
                [0, 1], [0, 4], [2, 6]
            ]);
        });
    });

});
