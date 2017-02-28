app.controller('brokerCtrl', ['$scope', 'Notification', function($scope, Notification){
	$scope.nData = [];
	$scope.not = false;
	$scope.not_count = 0;
	console.log("called admin ctrl")
	$scope.id = localStorage.getItem("n_b_id") || "id123";

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

	$scope.changeId = function() {
       localStorage.setItem("n_b_id", $scope.id);
       location.reload();
	}


	
}])