const Koa = require('koa')
const app = new Koa()
const uploadRoute = require('./routes/upload')

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



function isObject(obj) {
    return obj === Object(obj)
}
module.exports = app