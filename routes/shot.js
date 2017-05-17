//libs
const koaRouter = require('koa-router')
const debug = require('debug')('lensert-server:upload')
const chalk = require('chalk')

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

    let views = await db.getAsync(ctx.params.sid + ':views') || 0
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

    //smembers, hgetall
    ctx.body = result
})

module.exports = router