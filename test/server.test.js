const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://nodejs_application:Hatelove48@cluster0.njfpy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    if (err) console.error(err)
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});