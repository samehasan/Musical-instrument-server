const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ssocgpa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const usersCollection = client.db("MILSDB").collection("users");
    const InstructorCollection = client.db("MILSDB").collection("Instructor");
    const ClassesCollection = client.db("MILSDB").collection("Classes");
    const cartCollection = client.db("MILSDB").collection("carts");

    app.get('/users', async (req, res) => {
        const result = await usersCollection.find().toArray();
        res.send(result);
      });

    app.post('/users', async (req, res) => {
        const user = req.body;
        const query = { email: user.email }
        const existingUser = await usersCollection.findOne(query);
  
        if (existingUser) {
          return res.send({ message: 'user already exists' })
        }
  
        const result = await usersCollection.insertOne(user);
        res.send(result);
      });

    app.get('/instructor', async (req, res) => {
        const result = await InstructorCollection.find().toArray();
        res.send(result);
      })

      app.get('/classes', async (req, res) => {
        const result = await ClassesCollection.find().toArray();
        res.send(result);
      })

      app.get('/carts', async (req, res) => {
        const email = req.query.email;
  
        if (!email) {
          res.send([]);
        }
        const query = { email: email };
        const result = await cartCollection.find(query).toArray();
        res.send(result);
      });
  
      app.post('/carts', async (req, res) => {
        const item = req.body;
        console.log(item);
        const result = await cartCollection.insertOne(item);
        res.send(result);
      })
  
      app.delete('/carts/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result);
      })
  
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is')
})

app.listen(port, () => {
  console.log(` on port ${port}`);
})

    