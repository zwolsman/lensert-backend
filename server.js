const fs = require('fs')
const path = require('path')
const app = require('./app')

module.exports = {
    servers: function () {
        let servers = []
        servers.push({
            server: require('http').createServer(app.callback()),
            port: process.env.PORT || '3000'
        })
        if (fs.existsSync('/etc/letsencrypt/live/www.lensert.com/')) {
            let options = {
                key: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/privkey.pem'),
                cert: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/fullchain.pem'),
                ca: fs.readFileSync('/etc/letsencrypt/live/www.lensert.com/chain.pem')
            }
            servers.push({
                server: require('https').createServer(options, app.callback()),
                port: 443
            })
        }
        return servers
    },
    isSecure: function () {
        return fs.existsSync('/etc/letsencrypt/live/www.lensert.com/')
    }

}