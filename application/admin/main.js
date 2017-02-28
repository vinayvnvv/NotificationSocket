var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var strings = require('./../strings');
var db_url = strings.db_url;




	var insertDocument = function(db, id, data, callback_suc, callback_err) {
	   var collection = "admin_" + id;
	   db.collection(collection).insertOne(data, function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("Inserted a document into the modules collection.");
		    callback_suc();
		}
	  });
	};

  	var fetchDocument = function(db, id, callback_suc, callback_err) {
	   db.collection('admin_' + id).find().toArray(function(err, docs) {
        assert.equal(null, err);
        callback_suc(docs)
      });
	};
 
   var updateSeenStatus = function(db, id, callback_suc, callback_err) {
   	  db.collection('admin_' + id).update({},{$set:{"seen":true}},{multi:true}, function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("set seen status");
		    callback_suc();
		}
	  });
   }
   var clearDocument = function(db, id, callback_suc, callback_err) {
   	 db.collection('admin_' + id).drop(function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("cleared admin notification....");
		    callback_suc();
		}
	  });
   }
   

   	  




router.post('/insert/:id', function(req, res, next) {

	setTimeout(run, 10);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  insertDocument(db, req.params.id, req.body, function() {
		  	  res.json({success:1});
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});
	}

})
router.get('/get/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}


    
      setTimeout(run, 12);

      function run() {

      	  MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  fetchDocument(db, req.params.id, function(result) {
		  	  res.json(result);
		      db.close();
		  }, function(err) {
		  	  res.status(400).json({success:0,msg:err});
		      db.close();
		  });
		});

      }

		
});

//set seen status
router.post('/seen/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}

	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  updateSeenStatus(db, req.params.id, function() {
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
router.post('/clear/:id', function(req, res, next) {

	if(!isValidId(req.params.id)) {
		res.status(400).send("Id is required!");
		return;
	}
	
	setTimeout(run, 12);
	function run() {
		MongoClient.connect(db_url, function(err, db) {
		  assert.equal(null, err);
		  clearDocument(db, req.params.id, function() {
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