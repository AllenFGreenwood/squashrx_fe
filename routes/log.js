var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment-timezone');
var helpers = require('handlebars-helpers')();
// Create custom homepage
// --------------------------------------------------
router.get('/log', function (req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }
    MongoClient.connect('mongodb://localhost', (err, client) => {
        if (err) {
            throw err;
        }

        const db = client.db('LockDb');
        const log = db.collection('Log');
        //app.locals.log = log;

        log.find().sort({ "log_created": -1 }).limit(10).toArray((err, recent) => {
            for (index = 0; index < recent.length; index++) {
                var milli = Date.parse(recent[index]['ab_res_start_time']);
                var parsed = new Date(milli);

                recent[index]['abresstarttime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" }).replace(/:\d{2}\s/, ' ');

                milli = Date.parse(recent[index]['ab_res_end_time']);
                parsed = new Date(milli);

                recent[index]['abresendtime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" }).replace(/:\d{2}\s/, ' ');

                milli = Date.parse(recent[index]['ab_res_creation_time']);
                parsed = new Date(milli);

                recent[index]['abrescreationtime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });

            }
            var lastScan = db.collection('LastScan');
            lastScan.find().limit(1).toArray((err, last) => {
                //let lastTime = new Date(last[0]['ab_creation_time_window_from']);

                milli = Date.parse(last[0]['ab_creation_time_window_from']);
                parsed = new Date(milli);

                let lastTime = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });

                let lastDb = last[0]['ab_creation_time_window_from'];

                res.render('log', { recent, lastTime, lastDb });
            });
        });
    });
});
// --------------------------------------------------

module.exports = router;
