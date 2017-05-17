//libs
const koaRouter = require('koa-router')
const shortid = require('shortid')
const multer = require('koa-multer')
const mime = require('mime-types')
const imageType = require('image-type')
const path = require('path')
const getColors = require('get-image-colors')

//debug
const debug = require('debug')('lensert-server:upload')
const chalk = require('chalk')

//db
const db = require('../db')

//router
const router = new koaRouter()

//multer
var storage = multer.diskStorage({
    destination: '/var/lensert/',
    filename: function (req, file, cb) {
        cb(null, shortid.generate() + '.' + mime.extension(file.mimetype))
    }
})

const base = 'http://localhost:3000/'
var upload = multer({
    storage: storage
});

router.post('/upload', upload.single('shot'), async(ctx, next) => {

    if (ctx.req.file == undefined) {
        ctx.throw(400, 'no shot provided')
        return
    }

    let shot = {
        ext: '.' + mime.extension(ctx.req.file.mimetype),
        mime: ctx.req.file.mimetype,
        size: ctx.req.file.size,
        origin: ctx.request.ip
    }

    let id = path.basename(ctx.req.file.filename, shot.ext)
    debug('new upload; id: ' + chalk.yellow(id) + ', origin: ' + chalk.yellow(shot.origin))
    db.incrAsync('shots').then(total => {
        debug('TODO: broadcast with socket.io')
    })

    db.hmsetAsync(id, shot)
    getColors(ctx.req.file.path).then(colors => db.sadd([id + ':' + 'colors', ...colors.map(color => color.hex())])).catch(function() {})

    ctx.body = {
        response: ':)',
        id: id,
        link: base + id
    }
})

module.exports = router