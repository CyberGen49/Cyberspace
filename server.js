
const express = require('express');
const logger = require('cyber-express-logger');
const utils = require('web-resources');
const sqlite3 = require('better-sqlite3');

const srv = express();
srv.set('view engine', 'ejs');
srv.use(logger({ getIP: req => req.headers['cf-connecting-ip'] }));
srv.use(express.static(`${__dirname}/web`, { index: false }));

srv.get('/*', (req, res, next) => {
    res.meta = {
        title: 'Welcome to Cyberspace',
        desc: `An oasis seeking to bring back the feelings of the old internet while keeping modern in design.`
    };
    next();
});

srv.use('/api', (req, res, next) => {
    req.db = sqlite3('main.db');
    res.on('finish', () => {
        db.close();
    });
    next();
});

srv.get('/*', (req, res) => {
    // <%= text %>
    res.render(`${__dirname}/web/index.ejs`, res.meta);
});

const port = 8867;
srv.listen(port, () => console.log(`Listening on ${port}`));