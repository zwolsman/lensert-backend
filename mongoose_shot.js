var mongoose = require('mongoose');
var shortid = require('shortid');

var Schema = mongoose.Schema;

var shotSchema = new Schema({
    data: Buffer,

    mime: String,
    ext: String,
    size: Number,

    dominantColor: {
        hex: String,
        rgb: {
            r: Number,
            g: Number,
            b: Number
        }
    },
    palette: [{
        _id: false,
        hex: String,
        rgb: {
            r: Number,
            g: Number,
            b: Number
        }
    }],
    aid: {
        type: String,
        default: shortid.generate,
        index: true
    }
});

module.exports = mongoose.model("Shot", shotSchema);