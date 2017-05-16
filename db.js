const redis = require('redis')
const bluebird = require('bluebird')

const client = redis.createClient()
client.on('connect', function() {
    console.log('connected to redis')
})

module.exports = bluebird.promisifyAll(client)