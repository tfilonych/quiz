(function(){
	var app = angular.module("Quiz", ["ngRoute"]);
	
	app.config(['$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
	    $routeProvider
	    	.when('/main', {templateUrl: '/templates/main.html'})
	    	.when('/search', {templateUrl: '/templates/search.html'})
	    	.when('/contacts', {templateUrl: '/templates/contacts.html'})
	    	.when('/statistics', {templateUrl: '/templates/statistics.html'})
	      	.otherwise({redirectTo: '/'});
	}]);
  
	app.controller("NavigationController", function(){
		
	});
	
	app.directive("navigation", function(){
		return {
			restrict: "E",
			templateUrl: "templates/navigation.html",
			controller: "NavigationController",
			controllerAs: "nav"
		};
	});
	
	
	
	
	
	
})();
