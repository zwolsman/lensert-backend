//libs
const koaRouter = require('koa-router')
const debug = require('debug')('lensert-server:download')
const chalk = require('chalk')
const fs = require('fs')

//router
const router = new koaRouter()

//db
const db = require('../db')

router.get('/download', async(ctx, next) => {
    let type = ctx.params.type || 'win'
    console.log(`data/lensert-${type}.zip`)
    if (!fs.existsSync(`data/lensert-${type}.zip`)) {
        console.log('bestaat niet?')
        ctx.throw(404)
    }

    db.saddAsync('download', `${ctx.request.ip}-${type}`).then(result => {
        if (result > 0)
            debug('new download; type: ' + chalk.yellow(type) + ', ip: ' + chalk.yellow(ctx.request.ip))
    })

    ctx.attachment(`lensert-${type}.zip`)
    ctx.body = fs.createReadStream(`data/lensert-${type}.zip`)
})

module.exports = router