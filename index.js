const MongoClient = require('mongodb').MongoClient;
const express = require("express");
const app = express();
const port = process.env.PORT || 3600;

// mongodb connected link 
// const uri = "mongodb://<username>:<password>@cluster0-shard-00-00.e3dsx.mongodb.net:27017,cluster0-shard-00-01.e3dsx.mongodb.net:27017,cluster0-shard-00-02.e3dsx.mongodb.net:27017/?ssl=true&replicaSet=atlas-cjr3cu-shard-0&authSource=admin&retryWrites=true&w=majority";

app.get('/', (req, res) => {
    res.send(`server running successfully port: ${port}`);
})
app.listen(port, () => {
    console.log(`belly-food server running`);
})