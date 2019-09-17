var express = require('express');
var router = express.Router();
const ObjectID = require('mongodb').ObjectID;
//const authUtils = require('../utils/auth');
const MongoClient = require('mongodb').MongoClient;
// Configure user account profile edit
// --------------------------------------------------
router.get('/', function (req, res, next) {

    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }
    MongoClient.connect('mongodb://localhost', (err, client) => {
        if (err) {
            throw err;
        }

        const db = client.db('LockDb');
        const log = db.collection('Courts');
        //app.locals.log = log;

        log.find().sort({ "court_name": 1 }).limit(3).toArray((err, results) => {

            for (index = 0; index < results.length; index++) {
                results[index].court_name_escaped = results[index].court_name.replace(/#/g, '%23');;
                //results[index].court_name = results[index].court_name;
            }

            res.render('courts', { results });
            //});
        });
    });
});
// --------------------------------------------------


// Get public profile for any user
// --------------------------------------------------
router.get('/:courtname', (req, res, next) => {
    var court_name = req.params.courtname;
    MongoClient.connect('mongodb://localhost', (err, client) => {
        if (err) {
            throw err;
        }

        const db = client.db('LockDb');
        const log = db.collection('Courts');
        //app.locals.log = log;
        console.log("C N: ", court_name);
        log.find({ "court_name": court_name }).limit(1).toArray((err, result) => {


            //const users = req.app.locals.users;
            //const _id = ObjectID(req.session.passport.user);

            //users.findOne({ _id }, (err, results) => {
            // //    if (err) {
            //        throw err;
            //    }
            let lock_id = result[0]['remote_lock_id'];
            let last_court_name = result[0]['last_court_name'];
            let remote_lock_minutes_before = result[0]['remote_lock_minutes_before'];
            res.render('court', { court_name, lock_id, last_court_name, remote_lock_minutes_before });
            //});
        });
    });
})
// --------------------------------------------------


// Handle updating user profile data
// --------------------------------------------------
router.post('/', (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/login');
    }
    var court_name = req.body.court_name;

    var new_court_name = req.body.new_court_name.trim();
    if (new_court_name === '') {
        return res.redirect('/courts');
    }
    MongoClient.connect('mongodb://localhost', (err, client) => {
        if (err) {
            throw err;
        }
        const db = client.db('LockDb');
        const court = db.collection('Courts');
        //app.locals.log = log;
        court.updateOne({ "court_name": court_name }, { $set: { "court_name": new_court_name, "last_court_name": court_name, "remote_lock_minutes_before": remote_lock_minutes_before } }, (err) => {

        });
        client.close();
        res.redirect('/courts');

    });
});
// --------------------------------------------------

module.exports = router;
