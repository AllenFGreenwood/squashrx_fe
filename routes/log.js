var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment-timezone');

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
                let startTime = moment(recent[index]['ab_res_start_time']).tz('America/New_York');
                recent[index]['ab_res_start_time'] = startTime.format('YYYY-MM-DD HH:mm:ss').toString();
                let endTime = moment(recent[index]['ab_res_end_time']).tz('America/New_York');
                recent[index]['ab_res_end_time'] = endTime.format('YYYY-MM-DD HH:mm:ss').toString();
            }
            var lastScan = db.collection('LastScan');
            lastScan.find().limit(1).toArray((err, last) => {
                //let lastTime = new Date(last[0]['ab_creation_time_window_from']);
                let lastTime = moment(last[0]['ab_creation_time_window_from']).tz('America/New_York');
                lastTime = lastTime.format('YYYY-MM-DD HH:mm:ss');

                //lastTime = fifteen_min_early_nyc.toISOString();
                let lastDb = last[0]['ab_creation_time_window_from'];

                res.render('log', { recent, lastTime, lastDb });
            });
        });
    });
});
// --------------------------------------------------

module.exports = router;
