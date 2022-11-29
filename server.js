
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('cyber-express-logger');
const utils = require('web-resources');
const sqlite3 = require('better-sqlite3');

const srv = express();
srv.set('view engine', 'ejs');
srv.use(logger({ getIP: req => req.headers['cf-connecting-ip'] }));
srv.use(express.static(`${__dirname}/web`, { index: false }));
srv.use(bodyParser.json({ type: 'application/json' }));

srv.use('/api', (req, res, next) => {
    req.db = sqlite3('main.db');
    res.out = {};
    req.validate = (name, value, condition) => {
        if (value && condition) {
            return true;
        }
        req.endError(`badRequest`, `The ${name} parameter is invalid.`, 401);
        return false;
    };
    res.endSuccess = (code = 200) => {
        res.out.success = true;
        res.status(code).json(res.out);
    };
    res.endError = (short, long, code) => {
        res.out.success = false;
        res.error = { short: short, long: long };
        res.status(code).json(res.out);
    };
    res.on('finish', () => {
        db.close();
    });
    next();
});

srv.post('/api/login', (req, res) => {
    // ...
});

srv.get('/*', (req, res, next) => {
    res.meta = {
        title: 'Welcome to Cyberspace',
        desc: `An oasis seeking to bring back the feelings of the old internet while keeping modern in design.`
    };
    next();
});

// Change meta depending on the page being accessed
// Users, posts, communities, etc.

srv.get('/*', (req, res) => {
    // <%= text %>
    res.render(`${__dirname}/web/index.ejs`, res.meta);
});

const port = 8867;
srv.listen(port, () => console.log(`Listening on ${port}`));