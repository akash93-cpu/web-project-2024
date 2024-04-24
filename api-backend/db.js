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

// timeout function for database -- not used 
// ** if used - please pass a value(for timeout) to connectToDatabase in server.js

// function connectToDatabase(timeout=5000) {
//     const promise = new Promise((resolve, reject) => {
//         mongoose.Promise = global.Promise;
//         const url = process.env.MONGO_DB_CONNECTION_STRING;

//         const timeoutId = setTimeout(() => {
//             reject(new Error('Connection timed out! Please restart server!'));
//         }, timeout);
//         mongoose.connect(url, { useNewUrlParser: true })
//             .then(() => {
//                 clearTimeout(timeoutId);
//                 db = mongoose.connection.once('open', () => console.log(`Connected to MongoDB Atlas database -> ${url}`));
//                 resolve();
//             })
//             .catch(error => {
//                 clearTimeout(timeoutId);
//                 reject(error);
//             });
//     });
//     return promise;
// }

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