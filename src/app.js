require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet').default;
const compression = require('compression');
const { checkOverLoad } = require('./helpers/check.connect');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
require('./dbs/init.mongodb');
//checkOverLoad();



// init routes
app.use('/',require('./routes'));



// handling errors
app.use((req,res,next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status : 'error',
        code : statusCode,
        message : error.message || "Internal server"
    })
})

module.exports = app;