const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(cors());
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 3600;

// mongodb connected link
var uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.e3dsx.mongodb.net:27017,cluster0-shard-00-01.e3dsx.mongodb.net:27017,cluster0-shard-00-02.e3dsx.mongodb.net:27017/?ssl=true&replicaSet=atlas-cjr3cu-shard-0&authSource=admin&retryWrites=true&w=majority`;
// console.log("conected link", uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const database = client.db("belly-food");
    const usersCollection = database.collection("users");
    const foodscollection = database.collection("foods");
    const cartsCollection = database.collection("carts");
    const orderInformation = database.collection('orderInformantion')

    // post user data into mongodb
    app.post("/users", async (req, res) => {
      const userData = req.body;
      // console.log(userData);
      const result = await usersCollection.insertOne(userData);
      res.json(result);
      // console.log(result);
    });
    // check user and update
    app.put("/users", async (req, res) => {
      const userData = req.body;
      // console.log(userData);
      const filter = { email: userData.email };
      const options = { upsert: true };
      const updateDoc = { $set: userData };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
    // get data from mongodb
    app.get("/foods", async (req, res) => {
      const cursor = foodscollection.find({});
      const result = await cursor.toArray();
      res.send(result);
      // console.log("collected foods")
    });

    // get data from mongodb using id
    app.get("/foods/:id", async (req, res) => {
      const foodId = req.params.id;
      // console.log("food single id", foodId);
      const query = { _id: new ObjectId(foodId) };
      const result = await foodscollection.findOne(query);
      res.json(result);
      // console.log("pass data successfully");
    });

    // post cart to mongodb
    app.post("/carts", async (req, res) => {
      const cartsData = req.body;
      // console.log(cartsData);
      const result = await cartsCollection.insertOne(cartsData);
      res.json(result);
      // console.log(result)
    });

    // get all carts data
    app.get("/carts", async (req, res) => {
      const cursor = cartsCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
      // console.log(result);
    });

    // get cart using email
    app.get("/carts/:email", async (req, res) => {
      const useableUser = req.params.email;
      // console.log(useableUser)
      const query = { email: useableUser };
      //   console.log(query);
      const cursor = cartsCollection.find(query);
      const result = await cursor.toArray();
      res.json(result);
      //   console.log(result);
    });

    // delete single cart
    app.delete("/carts/:id", async (req, res) => {
      const dltId = req.params.id;
      //   console.log("dlt id", dltId);
      const query = { _id: new ObjectId(dltId) };
      const result = await cartsCollection.deleteOne(query);
      res.json(result);
      //   console.log(result);
    });

    // Post order to database
    app.post("/orderinformation", async(req, res) => {
      const orderData = req.body;
      // console.log(orderData);
      const result = await orderInformation.insertOne(orderData)
      res.json(result)
      // console.log(result)
    }) 
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  res.send(`server running successfully port: ${port}`);
});
app.listen(port, () => {
  console.log(`belly-food server running`);
});
