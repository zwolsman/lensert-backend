const redis = require('redis')
const debug = require('debug')('lensert-server:redis')
const bluebird = require('bluebird')
const chalk = require('chalk')

const client = redis.createClient()
client.on('connect', function() {
    debug('connected to redis')
})

client.on('error', function(err) {
    if(err.code == 'ECONNREFUSED') {
        debug('Redis server not running on ' + chalk.yellow(err.address + ":" + err.port))
        process.exit(1);
    }
})

module.exports = bluebird.promisifyAll(client)