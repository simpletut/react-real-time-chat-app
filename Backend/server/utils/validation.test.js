var {isRealString} = require('./validation');

describe('isRealString', () => {
    it('Should return true', () => {
        var string = 'Joe';
        var result = isRealString(string);
        expect(result).toBe(true);
    })
    it('Should return false', () => {
        var string = '     ';
        var result = isRealString(string);
        expect(result).toBe(false);
    })
});
