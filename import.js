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
    console.log('closed')
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

    if (doc.palette)
        //shot colors
        db.saddAsync([id + ':' + 'colors', ...doc.palette.map(color => color.hex)])

    //inc shot counter
    db.incrAsync('shots')

    //inc view counter
    viewModel.count({
        shot_id: shot.id
    }, (err, count) => {
        console.log('views: ' + count)
        db.incrby('views', count)
    })

    //write shot
    fs.writeFile(`${config.dst}${id}${shot.ext}`, doc.data, function () {})
}