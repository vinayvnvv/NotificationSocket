app.service('Notification', ['$http', 'Api', function($http, Api) {


	var admin = io.connect('/sockets/admin');

	this.push = {
		admin:pushAdminNotification
	}

	this.listen = {
		admin:listenAdmin
	}

	this.get = {
		admin:getAdminMsgs
	}

	this.seen = {
		admin:setAdminSeenStaus
	}

	this.clear = {
		admin:clearAdmin
	}

    function getAdminMsgs(callback, error) {
    	$http.get(Api.admin.get)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(res)
    	  });
    }

    function setAdminSeenStaus(callback, error) {
    	$http.post(Api.admin.seen)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(res)
    	  });
    }

    function clearAdmin(callback, error) {
    	$http.post(Api.admin.clear)
    	  .then(function(res){
             callback(res.data)
    	  }, function(err) {
    	  	 error(res)
    	  });
    }


	function listenAdmin(callback) {
		
		var id = Math.random();
		 	    admin.on('entry', function(data) {
                      callback(data);
		 	    } );


         
	}

	function pushAdminNotification(data) {

		$http.post(Api.admin.push, data)
		  .then(function(res) {
		  	admin.emit('push', data)
		  	console.log(res)
		  });

	}
 	
}])