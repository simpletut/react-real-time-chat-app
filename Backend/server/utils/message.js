var moment = require('moment');

var generateMessage = (from, room, text) => {
    return {
        from,
        room,
        text,
        createdDate: moment().valueOf()
    }
};

var generateLocationMessage = (from, room, lat, lon) => {
    return {
        from,
        room,
        url: `https://www.google.com/maps?q=${lat},${lon}`,
        createdDate: moment().valueOf()
    }
}

module.exports = {generateMessage, generateLocationMessage};