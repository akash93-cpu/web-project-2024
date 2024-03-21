const express = require('express');
const path = require('path');
const createProxy = require('http-proxy-middleware');

const app = express();
app.use(express.static('public'));

const api_proxy_target = process.env.API_PROXY_TARGET;
if (api_proxy_target) {
    app.use('/graphql-server', createProxy({ target: api_proxy_target }));
}

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql-server';
const env = { UI_API_ENDPOINT };

app.get('/env.js', function(req, res) {
    res.send(`window.ENV = ${JSON.stringify(env)}`);    
});

const port = 5000;

app.listen(port, () => console.log(`Server running on -> http://localhost:${port}`));