define(['angular'], function(angular) {
'use strict';

var registration=angular.module('registration', []);


//var registration=angular.module('registration', ['ngResource','ngStorage']);

 registration.factory('Register', function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/register');
 });
 
 registration.factory('Authentication', function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/activateUser');
 });
 
registration.controller('registrationController',['$scope','$location','Register','Authentication','LocalStorage',function($scope,$location,Register,Authentication,LocalStorage){
	
		$scope.domains=($location.search().organization).domain;
		$scope.name=($location.search().organization).name;
		$scope.userInfo={};
		$scope.authInfo={};
		var email;
		var firstName;
		var lastName;
		var gender;
		$scope.sendEmail=function(){
			email=$('#rEmail').val().trim();
			firstName=$('#firstName').val().trim();
			lastName=$('#lastName').val().trim();
			gender=$("input:radio[name=gender]:checked").val();
			var currentDomain=email.substring(email.indexOf('@')+1);
			
			if(firstName == ""){
				$('#firstName').addClass('error').focus();
				return;
			}
			
			if(lastName == ""){
				$('#firstName').removeClass('error')
				$('#lastName').addClass('error').focus();
				return;
			}
			
			if(email == ""){
				$('#lastName').removeClass('error');
				$('#rEmail').addClass('error').focus();
				return;
			}
			else{
				if($.inArray(currentDomain,$scope.domains) < 0){
					
					$('#invalidDomain').removeClass('hide');
					$('#invalidDomain').addClass('invalid');
					$('#invalidDomain').text('Please enter your email id with "'+$scope.domains +'"domains');
					return;
				}
				else{
					$('#firstName').removeClass('error')
					$('#lastName').removeClass('error')
					$('#invalidDomain').addClass('hide');
					$('#invalidDomain').removeClass('invalid');
					$('#rEmail').removeClass('error');
					
					
					$scope.userInfo.organization=$scope.name;
					$scope.userInfo.email_id=email;
					$scope.userInfo.user_id="";
					$scope.userInfo.first_name=firstName;
					$scope.userInfo.last_name=lastName;
					$scope.userInfo.gender=gender;
					$scope.userInfo.url="";
					$scope.userInfo.country="India";
					$scope.userInfo.city="Bangalore";
					$scope.userInfo.security_code="";
					$scope.userInfo.is_active=false;
					$scope.userInfo.timestamp="";
					$scope.userInfo.sold_post=[];
					
					console.log($scope.userInfo);
					var register=new Register();
					register.userInfo=$scope.userInfo
					register.$save({}, function(response) {
							
								console.log("$save success "+ JSON.stringify(response));
								$('#validDomain').removeClass('hide');
								$('#authCode').removeAttr('disabled');
								$('#registerBtn').removeAttr('disabled');
							
						}, function(error) {
							// failure
							console.log("$save failed "+ JSON.stringify(error))
							if(error.data.error == "user_already_existing"){
								
								$('#existingUser').removeClass('hide');
							}
						});
					}
			}
			
		}
		
		$scope.authentication=function(){
		
					var authCode=$('#authCode').val().trim();
					if(authCode == ""){
						
						$('#authCode').addClass('error');
						return;
					}
					else{
					
							$scope.authInfo.email_id=email;
							$scope.authInfo.security_code=authCode;
							
							var auth=new Authentication();
							auth.authentication=$scope.authInfo;
							
							auth.$save({},function (response) {
											// Success
											if(response.data.isSuccess){
												
												LocalStorage.setLocalstorage=response.data.user[0];
												$location.path('/dashboard?email_id='+email);
											
											}
											else{
												$('#invalidSecCode').removeClass('hide');
												return;
											}
									}, 
									function (error) {
										// failure
										console.log("$save failed " + JSON.stringify(error))
								});
							
					}
			
		}
		
	
}]);
return registration;
});