//libs
const koaRouter = require('koa-router')
const debug = require('debug')('lensert-server:shot')

//router
const router = new koaRouter()

//db
const db = require('../db')

router.get('/', async (ctx, next) => {
    let views = await db.getAsync('views'), shots = await db.getAsync('shots')
    
    await ctx.render('index', {isMac: ctx.userAgent.isMac, isWindows: ctx.userAgent.isWindows, views: views, shots: shots})
})
module.exports = router

