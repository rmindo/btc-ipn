/**
* Import Modules
*/
const express = require('express');
const bodyParser = require('body-parser');


/**
* Constants
*/
const config = require('./constants/config');

/**
* Routes
*/
const endpoints = require('./routes/endpoints');


/**
* Port
*/
const PORT = 2000;

/**
* Intantiate Express
*/
const app = express();


// app.use(express.json());
// app.use(bodyParser.json());
// app.use(express.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));



endpoints(app, config);




app.listen(PORT, () => console.log(`Listening on port ${PORT}`));