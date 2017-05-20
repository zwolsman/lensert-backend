var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var viewSchema = new Schema({
    ip: {
        type: String,
        index: true
    },
    shot_id: {
        type: Schema.Types.ObjectId,
        ref: 'Shot',
        index: true
    }
});

viewSchema.index({
    ip: 1,
    shot_id: 1
}, {
    unique: true
});

module.exports = mongoose.model('Views', viewSchema);