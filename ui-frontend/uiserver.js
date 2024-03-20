const express = require('express');
const path = require('path');
const app = express();

app.use(express.static('public'));

const port = 5000;

app.listen(port, () => console.log(`Server running on -> http://localhost:${port}`));
