const Koa = require('koa')
const app = new Koa()
const uploadRoute = require('./routes/upload')
const shotRoute = require('./routes/shot')

app.use(async (ctx, next) => {
    try {
        await next()
    } catch(e) {
        ctx.body = {
            response: ':(',
            error: e.message
        }
    }
})

app.use(uploadRoute.routes())
app.use(uploadRoute.allowedMethods())

app.use(shotRoute.routes())
app.use(shotRoute.allowedMethods())


function isObject(obj) {
    return obj === Object(obj)
}
module.exports = app