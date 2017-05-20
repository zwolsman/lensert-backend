//Koa
const Koa = require('koa')
const render = require('koa-ejs')
const serve = require('koa-static')
const useragent = require('koa-useragent')
const enforceHttps = require('koa-sslify')

//Path
const path = require('path')

//app
const app = new Koa()

//routes
const indexRoute = require('./routes/index')
const uploadRoute = require('./routes/upload')
const shotRoute = require('./routes/shot')


if(require('./server').isSecure)
    app.use(enforceHttps())

app.use(async(ctx, next) => {
    try {
        await next()
    } catch (e) {
        ctx.body = {
            result: ':(',
            error: e.message
        }
    }
})

render(app, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false
})

app.use(useragent)
app.use(serve('public'))

app.use(indexRoute.routes())
app.use(indexRoute.allowedMethods())

app.use(uploadRoute.routes())
app.use(uploadRoute.allowedMethods())

app.use(shotRoute.routes())
app.use(shotRoute.allowedMethods())

module.exports = app