const {MongoClient} = require('mongodb');
const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config()
app.use(express.json())
app.use(cors())
const ObjectId = require('mongodb').ObjectId

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

        // get data from mongodb 
        app.get('/foods', async(req, res) => {
            const cursor = foodscollection.find({});
            const result = await cursor.toArray();
            res.send(result);
            // console.log("collected foods")
        })

        // get data from mongodb using id
        app.get('/foods/:id', async(req, res) => {
            const foodId = req.params.id;
            // console.log("food single id", foodId);
            const query = {_id: new ObjectId(foodId)}
            const result = await foodscollection.findOne(query);
            res.json(result);
            // console.log("pass data successfully");
        })
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