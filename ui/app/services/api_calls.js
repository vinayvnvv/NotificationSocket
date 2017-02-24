app.service('Api', [function(){

	this.admin = {
		get: 'api/notifications/admin/get',
		push: 'api/notifications/admin/insert',
		seen: 'api/notifications/admin/seen',
		clear: 'api/notifications/admin/clear'
	}
	
}])