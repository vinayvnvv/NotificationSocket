var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var strings = require('./../strings');
var db_url = strings.db_url;


var DB = function() {
    
   this.insertDocument = function(db, type, id, data, callback_suc, callback_err) {
		   var collection = type + "_" + id;
		   db.collection(collection).insertOne(data, function(err, result) {
		    if(err) { callback_err(err); }
		    else {
			    console.log("Inserted a document into the modules collection.");
			    callback_suc();
			}
		  });
    };

    this.fetchDocument = function(db, type, id, callback_suc, callback_err) {
    var collection = type + "_" + id;
	   db.collection(collection).find().toArray(function(err, docs) {
	   	if(err) { callback_err(err); }

        assert.equal(null, err);
        callback_suc(docs)
      });
	};

	this.updateSeenStatus = function(db, type, id, callback_suc, callback_err) {
	  var collection = type + "_" + id;
   	  db.collection(collection).update({},{$set:{"seen":true}},{multi:true}, function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("set seen status");
		    callback_suc();
		}
	  });
   };
   
   this.clearDocument = function(db, type, id, callback_suc, callback_err) {
   	 var collection = type + "_" + id;
   	 db.collection(collection).drop(function(err, result) {
	    if(err) { callback_err(err); }
	    else {
		    console.log("cleared admin notification....");
		    callback_suc();
		}
	  });
   }


}

module.exports = DB;