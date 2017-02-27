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