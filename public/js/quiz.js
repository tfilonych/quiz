(function(){
	var app = angular.module("Quiz", ["ngRoute", "ngResource", "flow"]);
	app.constant("existUser", "has already been taken");
	app.factory('$access', ['$resource',
        function($resource) {
            return $resource('/access');
    }]);
    
    app.factory('$user', ['$resource',
        function($resource) {
            return $resource('/user', null,
            {
                'update': { method:'PUT' }
            }); 
    }]);
    
	app.config(['$routeProvider', "$locationProvider", "flowFactoryProvider", function($routeProvider, $locationProvider, flowFactoryProvider) {
		$locationProvider.html5Mode(true);
	    $routeProvider
	    	.when('/', {templateUrl: '/templates/main.html'})
	    	.when('/search', {templateUrl: '/templates/search.html'})
	    	.when('/contacts', {templateUrl: '/templates/contacts.html'})
	    	.when('/statistics', {templateUrl: '/templates/statistics.html'})
	    	.when('/registration', {templateUrl: '/templates/registration.html', controller: "RegistrationController", controllerAs: "reg"})
	      	.when('/cabinet', {templateUrl: '/templates/cabinet.html', controller: "CabinetController", controllerAs: "cab"})
	      	.otherwise({redirectTo: '/'});
	      	flowFactoryProvider.defaults = {
                target: '/avatar',
                permanentErrors: [404, 500, 501],
            };
	}]);
  
	app.controller("NavigationController", function(){
	});
	
	app.controller("ApplicationController", ["$scope", "$access", function($scope, $access){
		var app = this;
		this.user = {};
		$access.get(
		    function(data){
                app.user = data;
                $scope.$broadcast("user_updated", data);
            },
		    function(){
                app.user = {};
            });
            
		$scope.$on("user_logged_in", function(event, data){
			app.user = data;
			$scope.$broadcast("user_updated", data);
		});
			
		this.userLoggedIn = function(){
			return !!this.user.username;
		};
		this.logout = function(){
			$access.remove(null,
                function(data){
                   app.user = {};
                });
        };
	}]);
	
	app.controller("ProfileController", ["$http", "$user", function($http, $user){
	    this.user = {};
	    var profile = this; 
	    this.previousUser = {};
	    this.editable = false;
	    this.edit = function(){
	        this.editable = true;
	        angular.copy(this.user, this.previousUser);
	    };
	    
        this.cancelEdit = function(){
            angular.copy(this.previousUser, this.user);
            this.editable = false;
        };
        
        this.saveEdit = function(){
            $user.update(this.user, 
                    function(data){
                        console.log("OK");    
                    }, 
                    function(response, status, headers, config){
                        console.log("BAD");
                });
                 this.editable = false;
        };
        
        this.syncUserAvatar = function(){
            console.log("shos tam");
            $user.update({picture: this.user.picture}, 
                function(data){
                    console.log("saved picture");
                },
                function(response, status, headers, config){
                        console.log("BAD");
                });            
        };
        
        this.saveAvatar = function(){
            this.$flow.on('fileSuccess', function(file, response){
                profile.$flow.off('fileSuccess');
                profile.user.picture = response;
                profile.$flow.cancel();
                profile.syncUserAvatar();
            });
            this.$flow.upload();
        };
	}]);
	
	app.controller("CabinetController", ["$scope", function($scope){
	    var cabinet = this;
	    this.tabs = ['Опубліковані', 'Недоопрацьовані', 'Незатверджені', 'Створені', 'Мій профіль'];
	    this.tab = this.tabs[0];
	    this.user = {};
	    $scope.$on("user_updated", function(event, data){
	        cabinet.user = data;
	        
	    });
	    this.copyAppUser = function(user){
	        angular.copy(user, this.user);
	        this.user.birthday = new Date(this.user.birthday);
	    };
	    this.setTab = function(selected){
	      this.tab = selected;    
	    };
	    
	    this.isSelected = function(givenTab){
	      return givenTab === this.tab;
	    };
	}]);
	
	app.controller("RegistrationController", ["$user", "$location", "$scope", "userValidationService", "existUser", function($user, $location, $scope, $userValidation, existUser){
		var reg = this;
		this.validation = new $userValidation($scope);
		this.emailPattern = /^[\w+\.]?\w+@\w+\.[a-z]{2,4}$/;
		this.user = {};
		this.alreadyTakenUsernames = [];
		this.messages = "";
		this.cancel = function(){
			$location.path("/");
		};
		
		this.submitRegistration = function(){
		    this.messages = [];
            $scope.regform.submitted = false;
            if ($scope.regform.$valid) {
                $user.save(this.user, 
                    function(data){
                        $location.path("/");    
                    }, 
                    function(response){
                        if (!!response.data.username && response.data.username.indexOf(existUser) !== -1){
                            reg.validation.addTakenUser(reg.user.username);
                        }
                });
            } else {
                $scope.regform.submitted = true;
            }
        };
       
	}]);
	
	app.controller("LoginController", ["$location", "$scope", "$access", function($location, $scope, $access){
		var lgnCtrl = this;
		this.user = {};
		this.message = "";
		this.submitLogin = function(){
			if (!this.user.username || !this.user.password){
				this.message = "Enter username and password!";
			} else {
				$access.save(this.user,
				    function(data){
                        $("#login").modal("hide");
                        $location.path("/");
                        $scope.$emit("user_logged_in", data);
                    },
				    function(data){
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
	
	app.directive("profile", function(){
	   return {
	       restrict: "E",
	       templateUrl: "templates/profile.html",
           controller: "ProfileController",
           controllerAs: "profile"  
	   }; 
	});
	
	app.directive("createdTests", function(){
       return {
           restrict: "E",
           templateUrl: "templates/created_tests.html",
       }; 
    });
    
    app.directive("publishedTests", function(){
       return {
           restrict: "E",
           templateUrl: "templates/published_tests.html",
       }; 
    });
    
    app.directive("notApprovedTests", function(){
       return {
           restrict: "E",
           templateUrl: "templates/not_approved_tests.html",
       }; 
    });
    
    app.directive("unfinishedTests", function(){
       return {
           restrict: "E",
           templateUrl: "templates/unfinished_tests.html",
       }; 
    });
    
})();
