app.controller('pushCtrl', ['$scope', 'Notification', function($scope, Notification){
	console.log("called admin ctrl")

	$scope.pushNotification = function() {
		console.log("pushing")
		Notification.push.admin({text: $scope.text});
	}



	
}])