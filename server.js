const fs = require('fs')
const path = require('path')
const app = require('./app')

let server = null
if (fs.existsSync('/etc/letsencrypt/live/www.lensert.com/')) {
    let options = {
        key: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/fullchain.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/chain.pem')
    }
    server = require('https').createServer(options, app.callback())
} else {
    server = require('http').createServer(app.callback())
}

module.exports = server