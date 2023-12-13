const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());


// mongodb user and pass
// user: purnoakter11
// pass: d0zaTStEPWvgWWps

// mongodb code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const uri = "mongodb+srv://purnoakter11:d0zaTStEPWvgWWps@cluster0.raqfgwg.mongodb.net/?retryWrites=true&w=majority";

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.raqfgwg.mongodb.net/?retryWrites=true&w=majority`;

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
        // Send a ping to confirm a successful connection


        // coffe collection
        const coffeCollection = client.db('coffeeeeDb').collection('coffeeee')

        // user collection
        const userCollection = client.db('coffeeeeDb').collection('user')

        // find post coffee
        app.get('/coffee', async(req,res)=>{
            const cursor = coffeCollection.find();
            const result =await cursor.toArray();
            res.send(result)
        })

        
        // update get id 
        app.get('/coffee/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeCollection.findOne(query);
            res.send(result)
        })

        // upadete data
        app.put('/coffee/:id', async(req,res)=>{
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const options = { upsert: true };
            const updatedCoffee = req.body;
            const coffee = {
                $set:{
                    coffeeName: updatedCoffee.coffeeName, 
                    chef: updatedCoffee.chef, 
                    supplier: updatedCoffee.supplier,
                    taste: updatedCoffee.taste, 
                    category: updatedCoffee.category, 
                    details: updatedCoffee.details, 
                    photo: updatedCoffee.photo
                }
            }
            const result = await coffeCollection.updateOne(filter, coffee , options);
            res.send(result)
        })

        // create post 
        app.post('/coffee', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeCollection.insertOne(newCoffee);
            console.log(newCoffee)
            res.send(result)
        })



        // delete
        app.delete('/coffee/:id', async(req,res)=>{
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeCollection.deleteOne(query);
            res.send(result)
        })



        // user related apis
        // user read
        app.get('/user', async(req,res)=>{
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users)
        })
        // user create
        app.post('/user',async(req,res)=>{
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            res.send(result)
        })

        // user delete
        app.delete('/user/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await userCollection.deleteOne(query);
            res.send(result)
        })

        // updated user
        app.patch('/user', async(req,res)=>{
            const user = req.body;
            const query = {email:  user.email}
            const updatedDock = {
                $set:{
                    lastLoginAt: user.lastLoginAt
                }
            }
            const result = await userCollection.updateOne(query, updatedDock);
            res.send(result)
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is running');
})
app.listen(port, () => {
    console.log(`server is running on port: ${port}`)
})