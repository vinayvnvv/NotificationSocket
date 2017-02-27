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