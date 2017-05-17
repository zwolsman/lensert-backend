//libs
const koaRouter = require('koa-router')
const debug = require('debug')('lensert-server:shot')
const chalk = require('chalk')
const fs = require('fs')

//router
const router = new koaRouter()

//db
const db = require('../db')

//Get information
router.get('/i(nfo|nformation)?/:sid([a-zA-Z0-9-_]{7,14}):ext(.[jpg|png|gif|webp|tif|bmp|jxr]+)?', async(ctx, next) => {
    let exists = await db.existsAsync(ctx.params.sid)
    if (!exists) {
        ctx.throw(404)
        return
    }

    let base = await db.hgetallAsync(ctx.params.sid)
    delete base.origin
    base.size = parseInt(base.size)

    let views = await db.scardAsync(ctx.params.sid + ':views') || 0
    let colors = await db.smembersAsync(ctx.params.sid + ':colors') || []
    let result = {
        response: ':)',
        id: ctx.params.sid
    }
    Object.assign(result, base, {
        palette: colors
    }, {
        views: views
    })

    ctx.body = result
})

router.get('/d(ownload)?/:sid([a-zA-Z0-9-_]{7,14}):ext(.[jpg|png|gif|webp|tif|bmp|jxr]+)?', async (ctx, next) => {
    let exists = await db.existsAsync(ctx.params.sid)

    if (!exists) {
        ctx.throw(404)
        return
    }
    let shot = await db.hgetallAsync(ctx.params.sid)

    ctx.response.attachment(ctx.params.sid + shot.ext)
    await echoShot(ctx.params.sid, ctx, shot)
})


router.get('/:sid', async(ctx, next) => {
    let exists = await db.existsAsync(ctx.params.sid)

    if (!exists) {
        ctx.throw(404)
        return
    }

    await echoShot(ctx.params.sid, ctx)

    db.saddAsync(ctx.params.sid + ':views', ctx.request.ip).then(result => {
        db.incrby('views', result)
        if(result > 0)
            debug('new view; id: ' + chalk.yellow(ctx.params.sid) + ', ip: ' + chalk.yellow(ctx.request.ip))
    })
})

async function echoShot(id, ctx, shot) {
    if(shot === undefined)
        shot = await db.hgetallAsync(id)

    ctx.response.set('Content-Type', shot.mime)
    ctx.response.set('Content-Length', shot.size)
    ctx.body = fs.createReadStream('/var/lensert/' + id + shot.ext)
}
module.exports = router