const express = require('express');
const path = require('path');
const createProxy = require('http-proxy-middleware');

const app = express();

const enableHMR = (process.env.ENABLE_HMR || 'true') === 'true';

if (enableHMR && (process.env.NODE_ENV !== 'production')) {
    console.log('Adding dev middlware, enabling HMR');
    const webpack = require('webpack');
    const devMiddleware = require('webpack-dev-middleware');
    const hotMiddleware = require('webpack-hot-middleware');

    const config = require('./webpack.config.js');
    config.entry.app.push('webpack-hot-middleware/client');
    config.plugins = config.plugins || [];
    config.plugins.push(new webpack.HotModuleReplacementPlugin());

    const compiler = webpack(config);
    app.use(devMiddleware(compiler));
    app.use(hotMiddleware(compiler));
}

app.use(express.static('public'));

const api_proxy_target = process.env.API_PROXY_TARGET;
if (api_proxy_target) {
    app.use('/graphql-server', createProxy({ target: api_proxy_target }));
    app.use('/auth', createProxy({ target: api_proxy_target }));
}

// if (!authApiEndpoint) {
//     authApiEndpoint = 'http://localhost:3000/auth';
// }

const UI_API_ENDPOINT = process.env.UI_API_ENDPOINT || 'http://localhost:3000/graphql-server';
// const apiAuthEndpoint = 'http://localhost:3000/auth';
const env = { UI_API_ENDPOINT }; // removed apiAuthEndpoint

app.get('/env.js', function(req, res) {
    res.send(`window.ENV = ${JSON.stringify(env)}`);    
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve('public/index.html'));
});

const port = 5000;

app.listen(port, () => console.log(`Server running on -> http://localhost:${port}`));