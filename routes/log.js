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
                //var dateString = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });
                //let startTime = new Date(moment(recent[index]['ab_res_start_time']).tz('America/New_York'));
                //recent[index]['ab_res_start_time'] = startTime;//.format('YYYY-MM-DD HH:mm:ss').toString();
                recent[index]['abresstarttime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });
                //recent[index]['abresstarttime'] = recent[index]['abresstarttime'].replace(/+0000 (Greenwich Mean Time)/, '');
                //let endTime = new Date(moment(recent[index]['ab_res_end_time']).tz('America/New_York'));
                milli = Date.parse(recent[index]['ab_res_end_time']);
                parsed = new Date(milli);
                recent[index]['abresendtime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });//.format('YYYY-MM-DD HH:mm:ss').toString();  



                //recent[index]['abresendtime'] = endTime; //.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
                //recent[index]['abresendtime'] = recent[index]['abresendtime'].replace(/+0000 (Greenwich Mean Time)/, '');
                //let madeTime = new Date(moment(recent[index]['ab_res_creation_time']).tz('America/New_York'));

                milli = Date.parse(recent[index]['ab_res_creation_time']);
                parsed = new Date(milli);


                //recent[index]['ab_res_creation_time'] = madeTime;//.format('YYYY-MM-DD HH:mm:ss').toString();
                recent[index]['abrescreationttime'] = parsed.toLocaleString("en-US", { timeZone: "America/New_York" }); //.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
                //recent[index]['abrescreationttime'] = 
            }
            var lastScan = db.collection('LastScan');
            lastScan.find().limit(1).toArray((err, last) => {
                //let lastTime = new Date(last[0]['ab_creation_time_window_from']);
                milli = Date.parse(recent[index]['ab_creation_time_window_from']);
                parsed = new Date(milli);

                let lastTime = parsed.toLocaleString("en-US", { timeZone: "America/New_York" });; //.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

                //let lastTime = new Date(moment(last[0]['ab_creation_time_window_from']).tz('America/New_York')).toString();
                //lastTime = lastTime.toString();
                //lastTime = lastTime.replace(/+0000 (Greenwich Mean Time)/, '');
                //lastTime = lastTime.format('YYYY-MM-DD HH:mm:ss');

                //lastTime = fifteen_min_early_nyc.toISOString();
                let lastDb = last[0]['ab_creation_time_window_from'];

                res.render('log', { recent, lastTime, lastDb });
            });
        });
    });
});
// --------------------------------------------------

module.exports = router;
