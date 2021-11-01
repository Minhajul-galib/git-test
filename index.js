const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// midleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Pass}@cluster0.uk5kj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection!
async function run (){

    try{
        await client.connect();
        const database = client.db('travelAgency');
        const travelServices = database.collection('services');
        const usersCollection = database.collection('users');
        const bookedCollection = database.collection('booked');

        app.get('/ok', (req, res)=>{
            res.send('ok')
        })
        // POST API ADDING OF USER!
        app.post('/users', async (req, res)=>{
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            console.log('ok hit post', req.body)
            console.log('added user', result);

            res.json(result);
        })

        // POST API ADDING FOR BOOKED!
        app.post('/booked', async (req, res)=>{
            const newBooked = req.body;
            const result = await bookedCollection.insertOne(newBooked);

            console.log("hit Booked", req.body);
            res.send('add the booked', result);
            res.json(result);
        })


        // Get Users Api!
        app.get('/users', async (req, res)=>{
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });
        
        // Get Booked Api!
        app.get('/booked', async (req, res)=>{
            const cursor = bookedCollection.find({});
            const booked = await cursor.toArray();
            res.send(booked);
        });

        // Get services Api!
        app.get('/services', async (req, res)=>{
            const cursor = travelServices.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get single services
        app.get('/services/:id', async (req, res)=>{
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)};
            const service = await travelServices.findOne(query);
            res.json(service);
        })

        // // Update Booked
        // app.put('/booked/:id', async (req, res)=>{
        //     const id = req.params.id;
        //     const updateStatus = req.body;
        //     const filter = {_id: ObjectId(id)};
        //     const options = {upset: true};
        //     console.log(updateStatus);
        //     const updateDoc = {
        //         $set:{
        //             tourStatus: updateStatus.tourStatus,
        //         },
        //     };
        //     const result = await bookedCollection.updateOne(filter, updateDoc, options)
        //     res.send(result)
        // })

        // Booked Delete API
        app.delete('/booked/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookedCollection.deleteOne(query);
            console.log('Deleting Booked with id', result);

            res.json(result);
        })
        // User Delete API
        app.delete('/users/:id', async (req, res)=>{
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(query);
            console.log('Deleting user with id', result);

            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('Travel is running');
})

app.listen(port, ()=>{
    console.log('Server port running');
})
