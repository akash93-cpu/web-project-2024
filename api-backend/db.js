// to connect to MongoDB Atlas database
require('dotenv').config();
const mongoose = require('mongoose');
let db;

async function connectToDatabase() {

    mongoose.Promise = global.Promise;
    const url = process.env.MONGO_DB_CONNECTION_STRING;
    await mongoose.connect(url, { useNewUrlParser: true });
    db = mongoose.connection.once('open', () => console.log(`Connected to MongoDB Atlas database -> ${url}`));
}

function insertOneIntoDatabase() { // not used 
    const schema = new mongoose.Schema({
        name: String,
        lastname: String,
    });
    const test_model = mongoose.model('Testers', schema);
    test_model.create({
        name: 'Test Person',
        lastname: 'Testtsssadasd',
    });
}

function getDB() {
    return db;
}

module.exports = { connectToDatabase, getDB, insertOneIntoDatabase }