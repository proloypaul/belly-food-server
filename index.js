const {MongoClient} = require('mongodb');
const express = require("express");
const app = express();
require('dotenv').config()
const port = process.env.PORT || 3600;

// mongodb connected link 
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.e3dsx.mongodb.net:27017,cluster0-shard-00-01.e3dsx.mongodb.net:27017,cluster0-shard-00-02.e3dsx.mongodb.net:27017/?ssl=true&replicaSet=atlas-cjr3cu-shard-0&authSource=admin&retryWrites=true&w=majority`;
// console.log("conected link", uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        const database = client.db('belly-food');
        const foodscollection = database.collection('foods');
    }finally{
        // await client.close()
    }
}

run().catch(console.dir);
app.get('/', (req, res) => {
    res.send(`server running successfully port: ${port}`);
})
app.listen(port, () => {
    console.log(`belly-food server running`);
})