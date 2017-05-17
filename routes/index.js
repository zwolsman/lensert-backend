//libs
const koaRouter = require('koa-router')
const debug = require('debug')('lensert-server:shot')

//router
const router = new koaRouter()

//db
const db = require('../db')

router.get('/', async (ctx, next) => {
    await ctx.render('index', {isMac: false, isWindows: true, views: 0, shots: 0})
})
module.exports = router