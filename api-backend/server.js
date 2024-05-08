const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const { connectToDatabase, insertOneIntoDatabase } = require('./db.js');
const { startServer } = require('./api_handles.js');
require('dotenv').config();

app.use(express.static('public'));

app.use(cookieParser()); 

// app.use('/auth', router);

startServer(app);

const port = 3000;
const graphQLServerString = process.env.GRAPHQL_SERVER_CONNECTION_STRING;

(async function () {
    try {
        await connectToDatabase();
        // insertOneIntoDatabase(); // not used as for now
        app.listen(port, function() {
            console.log(`App started on port ${ port } \n\nGraphQL server -> please access ${ graphQLServerString }`)
        });
    } catch (err) {
        console.log('ERROR!', err);
    }

}());