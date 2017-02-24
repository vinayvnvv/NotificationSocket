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

	this.admin = {
		get: 'api/notifications/admin/get',
		push: 'api/notifications/admin/insert',
		seen: 'api/notifications/admin/seen',
		clear: 'api/notifications/admin/clear'
	}
	
}])
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
app.controller('adminCtrl', ['$scope', 'Notification', function($scope, Notification){
	$scope.nData = [];
	$scope.not = false;
	$scope.not_count = 0;
	console.log("called admin ctrl")

    Notification.get.admin(

    	function(data){ $scope.nData = data; $scope.findInitNotiCount(); },
    	function(err){ console.log(err); }

    	);

	Notification.listen.admin(function(data) {
		  $scope.nData.push(data);
          $scope.not_count++;
          $scope.$apply();
          $scope.playSound();
          document.title = $scope.not_count + " New Notification"
	});


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

			function(){ $scope.not_count = 0; $scope.nData = []; document.title = "Admin"; },
			function(){}

			);
	}

	$scope.seenNoti = function() {
		document.title = "Admin";
		Notification.seen.admin(

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

	$scope.pushNotification = function() {
		console.log("pushing")
		Notification.push.admin({text: $scope.text});
	}



	
}])