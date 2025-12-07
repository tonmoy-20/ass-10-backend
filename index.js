const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzswtx3.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // await client.connect();

    const database = client.db("petPawServices");
    const petServices = database.collection("services");
    const orderCollections = database.collection("orders");

    app.post("/services", async (req, res) => {
      const data = req.body;
      data.createdAt = new Date();
      const result = await petServices.insertOne(data);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const { category } = req.query;
      let query = {};

      if (category) {
        query = { category: category };
      }

      const result = await petServices.find(query).toArray();
      res.send(result);
    });

    app.get("/my-services", async (req, res) => {
      const { email } = req.query;
      const query = { email: email };
      const result = await petServices.find(query).toArray();
      res.send(result);
    });
    app.put("/update/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;

      const query = { _id: new ObjectId(id) };

      const updateService = {
        $set: data,
      };

      const result = await petServices.updateOne(query, updateService);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petServices.deleteOne(query);
      res.send(result);
    });

    app.post("/orders", async (req, res) => {
      const data = req.body;
      const result = await orderCollections.insertOne(data);
      res.status(201).send(result);
    });

    app.get("/orders", async (req, res) => {
      const result = await orderCollections.find().toArray();
      res.status(200).send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Mongo Connected Successfully!");
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
