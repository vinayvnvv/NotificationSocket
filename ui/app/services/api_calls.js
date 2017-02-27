app.service('Api', [function(){

	this.notification = {
		get: 'api/notifications/get/',
		push: 'api/notifications/insert/',
		seen: 'api/notifications/seen/',
		clear: 'api/notifications/clear/'
	}
	
}])