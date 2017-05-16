//libs
const koaRouter = require('koa-router')
const shortid = require('shortid')
const multer = require('koa-multer')
//db
const db = require('../db')

//router
const router = new koaRouter()

//multer
var storage = multer.memoryStorage();
var upload = multer({storage: storage, limits: {fileSize: 16793600, files: 1}});

router.post('/upload', function(ctx, next) { 
    ctx.body = {test: true, id: shortid.generate()}
})

module.exports = router