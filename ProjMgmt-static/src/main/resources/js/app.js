var bidprojApp = bidprojApp || {};
bidprojApp.baseurl = "http://connect.triconinfotech.com";
//bidprojApp.baseurl = "http://localhost";

define(['angular', 'ngResource', 'ngRoute', 'ngStorage', 'js/registration','js/product_menu','js/postAd',
'js/header', 'footer', 'js/viewAd','js/dashboard','profile','js/useractivities','js/filteration','js/employeeprofile'], function (angular) {
    'use strict';

    var app = angular.module('bidApp', ['ngResource','ngRoute', 'ngStorage', 'registration', 'productMenu', 'postAd', 'header', 'footer', 'viewAd', 'dashboard','profile','userActivities','filter','employeeprofile']);

//main module of application
//var app=angular.module('app', ['ngRoute','productMenu','ngResource','ngStorage','registration','postAd', 'viewAd','header','dashboard']);

app.config(function($routeProvider,$httpProvider){
	

//$routeProvider is used for hash-based routing
	$routeProvider
	.when('/',{
			templateUrl:'template/signin.html',
			controller:'compListController',
	})
	.when('/registration',{
			templateUrl:'template/registartion.html',
			controller:'registrationController',
	})
	.when('/dashboard',{
		templateUrl:'template/dashboard.html',
		controller:'dashboardController',
	})
	.when('/postAd',{
			templateUrl:'template/post.html',
			controller:'postAdController',
	})
	.when('/viewAd',{
			templateUrl:'template/viewAd.html',
			controller:'viewAdController',
	})
	.when('/header',{
			templateUrl:'template/header.html',
			controller:'productMenuController',
	})
	
	.when('/notification', {
		templateUrl : 'template/notification.html',
	}).when('/lostorfound', {
		templateUrl : 'template/lost_or_found.html',
	}).when('/discussion', {
		templateUrl : 'template/discussion.html',
	})
	.when('/employeeprofile', {
		templateUrl : 'template/employeeprofile.html',
		controller:'employeeprofileController'
	})
	.when('/profile', {
		templateUrl : 'template/profile.html',
		controller:'profileController'
	}).when('/activity', {
		templateUrl : 'template/activity.html',
	}).when('/settings', {
		templateUrl : 'template/settings.html',
	}).when('/help', {
		templateUrl : 'template/help.html',
	}).when('/share', {
		templateUrl : 'template/share.html',
	}).when('/feedback', {
		templateUrl : 'template/feedback.html',
	}).when('/follow', {
		templateUrl : 'template/follow.html',
	}).when('/myactivities', {
		templateUrl:'template/userActivities.html',
		controller:'userActivitiesController',
	})
	.when('/filter', {
	templateUrl:'template/filter.html',
	controller:'filterController',
})
	.otherwise({
            redirectTo: '/'
          })
});		


//REST api for get organization details
 app.factory("Getorganization", function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/organizations');
   
 });
 app.factory("Login", function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/login/:email',{email:'@email'});
 });

  app.factory('Authentication', function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/activateUser');
 });
 
 app.service('LocalStorage',function($localStorage){
	
	return {
	
		 get getLocalstorage() {return $localStorage.userDetails;},
		set setLocalstorage(data) {$localStorage.userDetails=data;}
		
	};
 });
 
app.controller('compListController',['$scope','$http','Getorganization','$location','Login','Authentication','LocalStorage','$resource',function($scope,$http,Getorganization,$location,Login,Authentication,LocalStorage, $resource){
		
		$scope.myVar = 'sachin';

		$scope.clickMe = function(){
		    $scope.myVar = 'Changed';
            console.log('Changed....');
		};

		var userDetails=LocalStorage.getLocalstorage;
		
		if(userDetails != null){
			console.log("inside local storage "+userDetails.security_code);
			authenticateUser(userDetails);
		}
		
		$scope.compList;
		$scope.organizationDetails;
		$scope.authInfo={};
		Getorganization.get(function(response){
			$scope.compList=response.data.data;
		});
		
function authenticateUser(userDetails) {
	var data = {};
	data.security_code=userDetails.security_code;
	data.email_id = userDetails.email_id
	var validateUserResource = $resource(bidprojApp.baseurl +'/bidprojservices/validateUser');
	var validateUser = new validateUserResource();
	validateUser.authentication = data;
	validateUser.$save( {}, function (response) {
		var result = response.data;
		if (result.isSuccess) {
			$location.path('/dashboard?email_id='+userDetails.email_id);
			$location.url($location.path());
		}
		else {
			$location.path('/');
		}
		});
	
}

	$scope.next=function(){
		var existingUserFlag=$('#existingUserFlag').val();
		var userEmail=$('#userEmail').val().trim();
		var authCode=$('#securityCode').val().trim();
		
		if(existingUserFlag == 'Y'){
			console.log('existing');	
			$scope.authInfo.email_id=userEmail;
			$scope.authInfo.security_code=authCode;
			
			var auth=new Authentication();
			auth.authentication=$scope.authInfo;
					
			auth.$save({},function (response) {
					console.log(JSON.stringify(response));
						if(response.data.isSuccess){
							
							LocalStorage.setLocalstorage=response.data.user[0];
							$location.path('/dashboard?email_id='+userEmail);
						}
						else{
							
							$('#invalidUser').addClass('hide');
							$('#validEmail').addClass('hide');
							$('#invalidSecCode').removeClass('hide');
							return;
						}
				}, 
				function (error) {
					console.log("$save failed " + JSON.stringify(error))
			});
		}
		
		else{
			
			var i=0;
			var organization=$('#organizationName').val();
			if(organization.trim() == "")
			{
				$('#organizationName').addClass('error').focus();
				return;
			}
			else{
			
				for(i=0;i<($scope.compList).length;i++){
					if($scope.compList[i].name == organization)
					{
						$scope.organizationDetails = $scope.compList[i];
						
					}
				}
				//redirect to registration page with organization query parameter
				$location.path('/registration').search('organization',$scope.organizationDetails);
			}
		
		}
		
		
	}
	
	$scope.getCode=function(){
			var userEmail=$('#userEmail').val().trim();
			$('#organizationName').val('');
			$('#organizationName').attr('disabled','true');
			if(userEmail == ""){
				$('#userEmail').addClass('error').focus();
				return;
			}
			else{
				$('#existingUserFlag').val('Y');
				
				Login.get({email:userEmail},function(response){
						console.log(JSON.stringify(response));
						if(response.data.user=='invalid'){
							$('#invalidUser').removeClass('hide');
							$('#organizationName').removeAttr('disabled');
							$('#existingUserFlag').val('N');
						}
						else if(response.data.user == 'valid'){
							$('#invalidUser').addClass('hide');
							$('#validEmail').removeClass('hide');
						}
					
				})
			}
	}
}]);

/* app.init = function(){
     angular.bootstrap(document, ['bidApp']);
} */
return app;
});

