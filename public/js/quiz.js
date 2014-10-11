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
		this.logout = function(){
			$http.get("/logout")
				.success(function(data){
					app.username = undefined;
				});
			
        };
	}]);
	
	app.controller("RegistrationController", ["$http", "$location", "$scope", function($http, $location, $scope){
		var reg = this;
		this.user = {};
		this.alreadyTakenUsernames = [];
		this.messages = [];
		this.cancel = function(){
			$location.path("/");
		};
		
		this.checkPassword = function () {
		    var passwordField = $scope.regform.password;
		    var confirmationField = $scope.regform.password_confirmation;
		    if (confirmationField.$error.required){
                confirmationField.$setValidity('dontMatch', true);
                return;
            }
            if (confirmationField.$viewValue == passwordField.$viewValue){
                confirmationField.$setValidity('dontMatch', true);
            } else {
                confirmationField.$setValidity('dontMatch', false);
            }
        };
             
		this.submitRegistration = function(){
		    this.messages = [];
            $scope.regform.submitted = false;
            if ($scope.regform.$valid) {
             // if (true) {  
                $http.post("/register", this.user)
                    .success(function(data){
                        $location.path("/");	
                    })
                .error(function(response, status, headers, config){
                    if (!!response.username && response.username.indexOf('has already been taken') !== -1){
                        reg.alreadyTakenUsernames.push(reg.user.username);
                        reg.checkUsernameUniqueness();
                    } 
                });             
            } else {
                $scope.regform.submitted = true;
            }
        };
        this.checkUsernameUniqueness = function(){
            var usernameField = $scope.regform.username;
            if (usernameField.$error.required || usernameField.$error.minlength){
                usernameField.$setValidity('unique', true);
                return;
            }
            if (this.alreadyTakenUsernames.indexOf(usernameField.$viewValue) === -1){
                usernameField.$setValidity('unique', true);
            } else {
                usernameField.$setValidity('unique', false);
            }
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
