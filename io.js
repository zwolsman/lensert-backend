const io = require('socket.io')
const debug = require('debug')('lensert-server:socket.io')
var instance;
module.exports = {
    server: function(server) {
        debug('attached server')
        instance = io(server)
    },
    instance: function() {
        return instance
    }
}