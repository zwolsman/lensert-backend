const redis = require('redis')
const debug = require('debug')('lensert-server:redis')
const bluebird = require('bluebird')

const client = redis.createClient()
client.on('connect', function() {
    debug('connected to redis')
})

module.exports = bluebird.promisifyAll(client)