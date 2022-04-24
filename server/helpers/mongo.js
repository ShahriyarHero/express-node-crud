require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = process.env.MONGODB

const client = new MongoClient(
    uri,
    { 
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        serverApi: ServerApiVersion.v1 
    }
);

const getAll = async (db, cols) => {
    const collection = client.db(db).collection(cols)
    let result = []
    let error = null

    try {
        await client.connect()
        result = await collection.find({}).toArray()
    } catch (err) {
        error = err.message
    } finally {
        await client.close()
    }

    return [result, error]
}

const insertOne = async (db, cols, data) => {
    const collection = client.db(db).collection(cols)
    let result = []
    let error = null

    try {
        await client.connect()
        const res = await collection.insertOne(data)
        result = await collection.findOne({ _id: ObjectId(res.insertedId)})

    } catch (err) {
        error = err.message
    } finally {
        await client.close()
    }

    return [result, error]
}

const getOne = async (db, cols, id) => {
    const collection = client.db(db).collection(cols)
    let result = []
    let error = null

    try {
        await client.connect()
        result = await collection.findOne({ _id: ObjectId(id)})
    } catch (err) {
        error = err.message
    } finally {
        await client.close()
    }

    return [result, error]
}

const deleteOne = async (db, cols, id) => {
    const collection = client.db(db).collection(cols)
    let result = []
    let error = null

    try {
        await client.connect()
        result = await collection.deleteOne({ _id: ObjectId(id)})
    } catch (err) {
        error = err.message
    } finally {
        await client.close()
    }

    return [result, error]
}

const updateOne = async (db, cols, userId, data) => {
    const collection = client.db(db).collection(cols)
    let result = []
    let error = null

    try {
        await client.connect()
        const filter = {_id: ObjectId(userId)}
        const options = { upsert: true }
        const updatedDoc = { $set: data }
        await collection.updateOne(filter, updatedDoc, options)

        const newData = await getOne(db, cols, userId)
        result = newData[0]
    } catch (err) {
        error = err.message
    } finally {
        await client.close()
    }

    return [result, error]
}

module.exports = {
    getAll,
    getOne,
    insertOne,
    deleteOne,
    deleteOne,
    updateOne
}