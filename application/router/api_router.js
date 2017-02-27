var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var strings = require('./../strings');
var db_url = strings.db_url;
var DB = new (require('./../db/main'))();

var broker = require('./../broker/main');
var admin  = require('./../admin/main');

// router.use('/broker', broker);
// router.use('/admin', admin);


router.get('/get/:type/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}


    
      setTimeout(run, 12);

      function run() {

      	  MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  DB.fetchDocument(db, req.params.type, req.params.id, function(result) {
		  	  res.json(result);
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});

      }

		
});






router.post('/insert/:type/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}

	setTimeout(run, 10);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  DB.insertDocument(db, req.params.type, req.params.id, req.body, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});
	}

});


//set seen status
router.post('/seen/:type/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}

	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  DB.updateSeenStatus(db, req.params.type, req.params.id, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});

	}
		
});

//clear
router.post('/clear/:type/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}
	
	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  DB.clearDocument(db, req.params.type, req.params.id, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});

	}
		
});







function isValidId(id)  {
   if(id == undefined || id == 0 || id == 'undefined') {
		return false;
	}

	return true;
}




module.exports = router;
