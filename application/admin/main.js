var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var strings = require('./../strings');
var db_url = strings.db_url;



	var insertDocument = function(db, data, callback_suc, callback_err) {
	   db.collection('admin').insertOne(data, function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("Inserted a document into the modules collection.");
		    callback_suc();
		}
	  });
	};

  	var fetchDocument = function(db, callback_suc, callback_err) {
	   db.collection('admin').find().toArray(function(err, docs) {
        assert.equal(null, err);
        callback_suc(docs)
      });
	};
 
   var updateSeenStatus = function(db, callback_suc, callback_err) {
   	  db.collection('admin').update({},{$set:{"seen":true}},{multi:true}, function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("set seen status");
		    callback_suc();
		}
	  });
   }
   var clearDocument = function(db, callback_suc, callback_err) {
   	 db.collection('admin').drop(function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("cleared admin notification....");
		    callback_suc();
		}
	  });
   }
   

   	  




router.post('/insert', function(req, res, next) {

	setTimeout(run, 10);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  insertDocument(db, req.body, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.json({success:0,msg:err});
		      db.close();
		  });
		});
	}

})
router.get('/get', function(req, res, next) {
    
      setTimeout(run, 12);

      function run() {

      	  MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  fetchDocument(db, function(result) {
		  	  res.json(result);
		      db.close();
		  }, function(err) {
		  	  res.json({success:0,msg:err});
		      db.close();
		  });
		});

      }

		
});

//set seen status
router.post('/seen', function(req, res, next) {
	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  updateSeenStatus(db, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.json({success:0,msg:err});
		      db.close();
		  });
		});

	}
		
});

//clear
router.post('/clear', function(req, res, next) {
	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  clearDocument(db, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.json({success:0,msg:err});
		      db.close();
		  });
		});

	}
		
});


module.exports = router;