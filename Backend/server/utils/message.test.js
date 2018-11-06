var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
    it('Should generate correct message object', () => {
        var from = 'Jen';
        var room = 'Node JS';
        var text = 'Some msg';
        var message = generateMessage(from, room, text);

        expect(typeof message.createdDate).toBe('number');
        expect(message).toMatchObject({from, text});
    })
});


describe('generateLocationMessage', () => {
    it('Should generate correct location object', () => {
        var from = 'John';
        var room = 'Node JS';
        var lat = 1;
        var long = 2;
        var url = 'https://www.google.com/maps?q=1,2';
        var res = generateLocationMessage(from, room, lat, long);

        expect(typeof res.createdDate).toBe('number');
        expect(res).toMatchObject({from, url});
    })
});