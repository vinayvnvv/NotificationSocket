var app = angular.module("Notification", ['ui.router']);


app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

    //default Router
    $urlRouterProvider.otherwise("/app");

	//Define router config
    $stateProvider
       .state("admin", {
       	  url: "/admin",
       	  templateUrl: "app/admin/html/index.html",
       	  controller: "adminCtrl"
       })

   $stateProvider
       .state("broker", {
          url: "/broker",
          templateUrl: "app/broker/html/index.html",
          controller: "brokerCtrl"
       })    

    $stateProvider
       .state("push", {
       	  url: "/push",
       	  templateUrl: "app/push/push.html",
       	  controller: "pushCtrl"
       })   

    $stateProvider
       .state("app", {
       	  url: "/app",
       	  template: "index",
       	  controller: "chatCtrl"
       })   

     $stateProvider
       .state("manager", {
       	  url: "/manager",
       	  templateUrl: "app/manager/html/dashboard.html",
       	  controller: "managerCtrl"
       }) 

    $stateProvider
       .state("track", {
          url: "/track",
          templateUrl: "app/manager/html/track.html",
          controller: "trackCtrl"
       })    





 }]);
app.controller('mainCtrl', ['$scope', function($scope){
	console.log("called main mainCtrl");
}])
app.service('Api', [function(){

	this.notification = {
		get: 'api/notifications/get/',
		push: 'api/notifications/insert/',
		seen: 'api/notifications/seen/',
		clear: 'api/notifications/clear/'
	}
	
}])
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
app.controller('adminCtrl', ['$scope', 'Notification', function($scope, Notification){
	$scope.nData = [];
	$scope.not = false;
	$scope.not_count = 0;
	console.log("called admin ctrl")
	$scope.id = "new_id";

    Notification.get.admin(

        {id:$scope.id},
    	function(data){ $scope.nData = data; $scope.findInitNotiCount(); },
    	function(err){ console.log(err); }

    	);

	Notification.listen.admin(

        {id:$scope.id},
		function(data) {
		  $scope.nData.push(data);
          $scope.not_count++;
          $scope.$apply();
          $scope.playSound();
          document.title = $scope.not_count + " New Notification"
	}


	);


    $scope.playSound = function (who) {
		var audio = new Audio('sound/bot.mp3');
		audio.play();
	}

	$scope.expandNoti = function() {
		$scope.not = !$scope.not;
		$scope.seenNoti();
	}

	$scope.clearNoti = function() {
		Notification.clear.admin(
       
            {id:$scope.id},
			function(){ $scope.not_count = 0; $scope.nData = []; document.title = "Admin"; },
			function(err){ console.log(err); }

			);
	}

	$scope.seenNoti = function() {
		document.title = "Admin";
		Notification.seen.admin(

            {id:$scope.id},
			function(){ $scope.not_count = 0; /*$scope.$apply();*/ },
			function(){}

			);
	}

	$scope.findInitNotiCount = function() {
		for(var i=$scope.nData.length-1;i>=0;i--) {
			if($scope.nData[i].seen == undefined) 
				$scope.not_count++;
			else
				break;
		}
		if($scope.not_count>0)
			document.title = $scope.not_count + " New Notification";
		//$scope.$apply();
	}


	
}])
app.controller('brokerCtrl', ['$scope', 'Notification', function($scope, Notification){
	$scope.nData = [];
	$scope.not = false;
	$scope.not_count = 0;
	console.log("called admin ctrl")
	$scope.id = "new_id";

    Notification.get.broker(

        {id:$scope.id},
    	function(data){ $scope.nData = data; $scope.findInitNotiCount(); }

    	);

	Notification.listen.broker(

        {id:$scope.id},
		function(data) {
		  $scope.nData.push(data);
          $scope.not_count++;
          $scope.$apply();
          $scope.playSound();
          document.title = $scope.not_count + " New Notification"
	}


	);


    $scope.playSound = function (who) {
		var audio = new Audio('sound/bot.mp3');
		audio.play();
	}

	$scope.expandNoti = function() {
		$scope.not = !$scope.not;
		$scope.seenNoti();
	}

	$scope.clearNoti = function() {
		Notification.clear.broker(
       
            {id:$scope.id},
			function(){ $scope.not_count = 0; $scope.nData = []; document.title = "Admin"; },
			function(err){ console.log(err); }

			);
	}

	$scope.seenNoti = function() {
		document.title = "Broker";
		Notification.seen.broker(

            {id:$scope.id},
			function(){ $scope.not_count = 0; /*$scope.$apply();*/ },
			function(){}

			);
	}

	$scope.findInitNotiCount = function() {
		for(var i=$scope.nData.length-1;i>=0;i--) {
			if($scope.nData[i].seen == undefined) 
				$scope.not_count++;
			else
				break;
		}
		if($scope.not_count>0)
			document.title = $scope.not_count + " New Notification";
		//$scope.$apply();
	}


	
}])
app.controller('pushCtrl', ['$scope', 'Notification', function($scope, Notification){
	console.log("called admin ctrl")

	$scope.pushNotification = function(type) {
		console.log("pushing")
		var data = {
			id:$scope.id,
			text:$scope.text
		}
		if(type == 'admin')
			Notification.push.admin(data);
	    if(type == 'broker')
	    	Notification.push.broker(data);
	}



	
}])