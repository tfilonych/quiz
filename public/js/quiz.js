(function(){
	var app = angular.module("Quiz", ["ngRoute"]);
	
	app.config(['$routeProvider', "$locationProvider", function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
	    $routeProvider
	    	.when('/', {templateUrl: '/templates/main.html'})
	    	.when('/search', {templateUrl: '/templates/search.html'})
	    	.when('/contacts', {templateUrl: '/templates/contacts.html'})
	    	.when('/statistics', {templateUrl: '/templates/statistics.html'})
	    	.when('/registration', {templateUrl: '/templates/registration.html', controller: "RegistrationController", controllerAs: "reg"})
	      	.otherwise({redirectTo: '/'});
	}]);
  
	app.controller("NavigationController", function(){
		
	});
	
	app.controller("ApplicationController", ["$http", "$scope", function($http, $scope){
		var app = this;
		this.username = "";
		$http.get("/access")
			.success(function(data){
				app.username = data;
			}).error(function(){
				app.username = undefined;
			});
		$scope.$on("user_logged_in", function(event, data){
			app.username = data;
		});
			
		this.userLoggedIn = function(){
			return (this.username != "") && (this.username != undefined);
		};
		
	}]);
	
	app.controller("RegistrationController", ["$http", "$location", function($http, $location){
		this.user = {};
		this.cancel = function(){
			$location.path("/");
		};
		this.submitRegistration = function(){
			$http.post("/register", this.user)
			.success(function(data){
				$location.path("/");
			});
		};
	}]);
	
	app.controller("LoginController", ["$location", "$scope", "$http", function($location, $scope, $http){
		var lgnCtrl = this;
		this.user = {};
		this.message = "";
		this.submitLogin = function(){
			if (!this.user.username || !this.user.password){
				this.message = "Enter username and password!";
			} else {
				$http.post("/login", this.user)
					.success(function(data){
						$("#login").modal("hide");
						$location.path("/");
						$scope.$emit("user_logged_in", data);
					})
					.error(function(data){
						lgnCtrl.message = "Invalid username and/or password!";
					});
			}
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
