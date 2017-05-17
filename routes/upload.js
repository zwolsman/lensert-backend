//libs
const koaRouter = require('koa-router')
const shortid = require('shortid')
const multer = require('koa-multer')
const mime = require('mime-types')
const imageType = require('image-type')
const path = require('path')
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

var upload = multer({
    storage: storage
});

router.post('/upload', upload.single('shot'), async(ctx, next) => {
    let shot = {
        size: ctx.req.file.size,
        mime: ctx.req.file.mimetype,
        ext: '.' + mime.extension(ctx.req.file.mimetype)
    }

    let id = path.basename(ctx.req.file.filename, shot.ext)
    
    let totalShots = await db.incrAsync('shots')
    console.log('total shots', totalShots)
    console.log(ctx.request.ip)

    db.hmsetAsync(id, shot)
    Object.assign(shot, {id: id})
    ctx.body = shot
})

var fs = require('fs')
router.get('/random', async(ctx, next) => {
    ctx.body = 'random'
})

router.get('/:id', async(ctx, next) => {
    let exists = await db.existsAsync(ctx.params.id)

    if(!exists) {
        ctx.throw(404)
    }

    let data = await db.hgetallAsync(ctx.params.id)

    ctx.response.set('Content-Type', data.mime)
    ctx.response.set('Content-Length', data.size)
    ctx.body = fs.createReadStream('/var/lensert/' + ctx.params.id + data.ext)
})

module.exports = router