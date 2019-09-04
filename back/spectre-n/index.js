
const server = require('./api/server.js');
const MongoClient = require('mongodb').MongoClient;

const port = process.env.PORT || 7777;
MongoClient.connect(`mongodb+srv://${process.env.DBUN}:${process.env.DBPW}@cluster0-jdect.mongodb.net/test?retryWrites=true&w=majority`, (err, client) => {
  if(err) return console.log(err);
  db = client.db('spectest');
  server.listen(port, () => console.log(`Main screen turn on ${port}`));
})

