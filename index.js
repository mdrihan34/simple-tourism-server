require("dotenv").config();
const express = require("express");
const cors = require("cors");
// 0tfn194fTRDZl4SF

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xojyj43.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
  
    const spotCollection = client.db("spotDB").collection("spot");
    app.get('/spots', async(req, res)=>{
      const cursor = spotCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })
    app.get('/spots/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.findOne(query)
      res.send(result)
    })
    
    app.post('/spots', async(req, res)=>{
     const newSpots = req.body
      console.log(newSpots)
      const result = await spotCollection.insertOne(newSpots)
      res.send(result)
    })
    app.put('/spots/:id', async(req, res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updatedSpots = req.body
      const spots = {
        $set:{
          image: updatedSpots.image, 
          spotName: updatedSpots.spotName,
          countryName: updatedSpots.countryName,
          location: updatedSpots.location,
          description: updatedSpots.description,
          cost: updatedSpots.cost,
          seasonality: updatedSpots.seasonality,
          travelTime: updatedSpots.travelTime,
          totalVisitors:updatedSpots.totalVisitors
        }
      }
      const result = await spotCollection.updateOne(filter,spots,options)
      res.send(result)
    })
    app.delete('/spots/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await spotCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run()
app.get("/", (req, res) => {
  res.send("Hello spots world!");
});

app.listen(port, () => {
  console.log(`Tourists Server is runing on port ${port}`);
});
