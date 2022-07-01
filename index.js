const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://taskadding:B7xqhW7G5ny1QPpr@cluster0.dhr9c.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const taskDatabase = client.db("tasksCollection").collection("Tasks");

        app.post("/tasks", async (req, res) => {
            const doc = req.body
            const result = await taskDatabase.insertOne(doc)
        })

        app.put("/tasks", async (req, res) => {
            const filter = { Email: req.query.email }
            const options = { upsert: true };
            const updateDoc = {
                $push: { Task: req.body.Task }
            }
            console.log(req.body)
            const result = await taskDatabase.updateOne(filter, updateDoc, options);
        })
        app.put("/checkedTask", async (req, res) => {
            const filter = { Email: req.query.email }
            const options = { upsert: true };
            const updateDoc = {
                $push: { completedTask: req.body.Rtask }
            }

            const result = await taskDatabase.updateOne(filter, updateDoc, options);
        })
        app.put("/removeTask", async (req, res) => {
            const filter = { Email: req.query.email }
            const updateDoc = {
                $pull: { Task: req.body.Rtask }
            }

            const result = await taskDatabase.updateOne(filter, updateDoc);
        })
        app.put("/checked", async (req, res) => {
            const filter = { Email: req.query.email }
            const options = { upsert: true };
            const updateDoc = {
                $set: req.body
            }
            const result = await taskDatabase.updateOne(filter, updateDoc, options);
        })
        app.get('/Completetask', async (req, res) => {
            const query = { Email: req.query.email };
            const cursor = await taskDatabase.findOne(query);
            res.send(cursor)
        })
        app.get('/taskOne', async (req, res) => {
            const query = { Email: req.query.email };
            const cursor = await taskDatabase.findOne(query);
            res.send(cursor)
        })
    } finally {

    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})