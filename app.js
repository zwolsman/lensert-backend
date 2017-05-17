const Koa = require('koa')
const app = new Koa()
const uploadRoute = require('./routes/upload')

app.use(uploadRoute.routes())
app.use(uploadRoute.allowedMethods())

module.exports = app