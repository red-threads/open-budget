require('dotenv').config()
const assert = require('assert')
var MongoClient = require('mongodb').MongoClient
// Connection URL
const url = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_SERVER}/${process.env.MONGO_DB}?retryWrites=true`
console.log(url)
// Use connect method to connect to the Server
MongoClient.connect(url, function (err, db) {
  assert.strictEqual(null, err)
  console.log('Connected correctly to server')
  db.close()
})
