const express = require('express');
const cors = require('cors');
const logger = require('./helpers/logger')
const { getAll, getOne, insertOne, deleteOne, updateOne } = require('./helpers/mongo');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(logger)

app.get("/users", async (req, res) => {
    const [users, error] = await getAll('express', 'users')

    if (!error) {
        res.json(users)
    } else {
        res.json({error: error})
    }
})

app.get("/users/:userId", async (req, res) => {
    const { userId } = req.params
    const [user, error] = await getOne('express', 'users', userId)

    if (!error) {
        user ? res.json(user) : res.json({error: "User not found"})
    } else {
        res.json({error: error})
    }
})

app.delete("/users/delete", async (req, res) => {
    const { userId } = req.body
    const [result, error] = await deleteOne('express', 'users', userId)
    
    if (!error) {
        res.json(result)
    } else {
        res.json({error: error})
    }
})

app.post("/users/create", async (req, res) => {
    const [result, error] = await insertOne('express', 'users', req.body)

    if (!error) {
        res.json(result)
    } else {
        res.json({error: error})
    }
})

app.put("/users/:userId/update", async (req, res) => {
    const { userId } = req.params
    const [result, error] = await updateOne('express', 'users', userId, req.body)

    if (!error) {
        res.json(result)
    } else {
        res.json({error: error})
    }
})

app.listen(port, () => {
    console.log('listening to port', port);
}) 