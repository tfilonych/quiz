(function(){
	var app = angular.module("Quiz", ["ngRoute"]);
	
	app.config(['$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
	    $routeProvider
	    	.when('/main', {templateUrl: '/templates/main.html'})
	    	.when('/search', {templateUrl: '/templates/search.html'})
	    	.when('/contacts', {templateUrl: '/templates/contacts.html'})
	    	.when('/statistics', {templateUrl: '/templates/statistics.html'})
	    	.when('/registration', {templateUrl: '/templates/registration.html'})
	      	.otherwise({redirectTo: '/'});
	}]);
  
	app.controller("NavigationController", function(){
		
	});
	
	app.controller("LoginController", ["$location", function($location){
		
		this.username = "";
		this.password = "";
		this.submitLogin = function(){
			
		};
		this.register = function(){
			$("#login").modal("hide");
			$location.path("/registration");
			
		};
	}]);
	
	app.directive("login", function(){
		return {
			restrict: "E",
			templateUrl: "templates/login.html",
			controller: "LoginController",
			controllerAs: "lgn"
		};
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
