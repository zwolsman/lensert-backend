const debug = require('debug')('lensert-server:import')
const mongoose = require('mongoose')
const bluebird = require('bluebird')
const fs = require('fs')

const db = require('./db')
const shotModel = require('./mongoose_shot')
const viewModel = require('./mongoose_view')

const config = require('./config')
mongoose.connect("mongodb://localhost:27017/shots")

let stream = shotModel.find().cursor()

stream.on('data', saveDoc).on('error', err => {
    console.log(err)
}).on('close', () => {
    debug('finished')
    process.exit(0);
})


function saveDoc(doc) {
    //shot id
    let id = doc.aid
    if (!id) {
        console.log('NO AID FOR DOCUMENT ' + doc.id)
        return
    }
    //shot meta data
    let shot = {
        ext: '.' + doc.ext,
        mime: doc.mime,
        size: doc.size,
        origin: '::1'
    }

    db.hmsetAsync(id, shot)

    if (doc.palette && doc.palette.length > 0)
        //shot colors
        db.saddAsync([id + ':' + 'colors', ...doc.palette.map(color => color.hex)])

    //inc shot counter
    db.incrAsync('shots')

    //inc view counter
    viewModel.count({
        shot_id: doc.id
    }, (err, count) => {
        db.incrby('views', count)
    })

    //write shot
    fs.writeFile(`${config.dst}${id}${shot.ext}`, doc.data, function () {})
}