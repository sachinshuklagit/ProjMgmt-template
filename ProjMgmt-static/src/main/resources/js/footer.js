define(['angular'], function(angular) {
'use strict';
var app=angular.module('footer', []);

app.controller('FooterController', ['$scope', '$location', 'LocalStorage', function($scope, $location, localStorage) {
	
	$scope.launchDashboard = function() {
		var userDetails=localStorage.getLocalstorage;
		if (userDetails !== null) {
			$location.path('/dashboard?email_id='+userDetails.email_id);
		}
		return;
	}
}]);

return  app;
});