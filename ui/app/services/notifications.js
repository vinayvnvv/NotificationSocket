app.service('Notification', ['$http', 'Api', function($http, Api) {


	var admin = io.connect('/sockets/admin');

	this.push = {
		admin:function(data) { pushNotification("admin", data); },
		broker:function(data) { pushNotification("broker", data); }
	}

	this.listen = {
		admin:function(c_data, callback) { listen("admin", c_data, callback); },
		broker:function(c_data, callback) { listen("broker", c_data, callback); }
	}

	this.get = {
		admin:function(data, callback, error) { getMsgs("admin", data, callback, error); },
		broker:function(data, callback, error) { getMsgs("broker", data, callback, error); }
	}

	this.seen = {
		admin:function(data, callback, error) { setSeenStaus("admin", data, callback, error); },
		broker:function(data, callback, error) { setSeenStaus("broker", data, callback, error); }
	}

	this.clear = {
		admin:function(data, callback, error) { clear("admin", data, callback, error); },
		broker:function(data, callback, error) { clear("broker", data, callback, error); }
	}

    function getMsgs(type, data, callback, error) {

    	$http.get(Api.notification.get + type + "/" + data.id)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(res)
    	  });
    }

    function setSeenStaus(type, data, callback, error) {
    	$http.post(Api.notification.seen + type + "/" + data.id)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(res)
    	  });
    }

    function clear(type, data, callback, error) {
    	$http.post(Api.notification.clear + type + "/" + data.id)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(err)
    	  });
    }


	function listen(type, c_data, callback) {
		
		var id = Math.random();
		 	    admin.on('entry', function(s_data) {
		 	    	  if(c_data.id == s_data.id && s_data.__type__ == type)
                      callback(s_data);
		 	    } );


         
	}

	function pushNotification(type, data) {

		$http.post(Api.notification.push + type + "/" + data.id, data)
		  .then(function(res) {
		  	data.__type__ = type;
		  	admin.emit('push', data)
		  	console.log(res)
		  });

	}
 	
}])