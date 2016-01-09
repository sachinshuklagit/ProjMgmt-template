define(['angular'], function(angular) {
var employeeprofile=angular.module('employeeprofile', ['ngResource']);



employeeprofile.factory('employeeprofileInfo', function($resource) {
	   return $resource(bidprojApp.baseurl+'/bidprojservices/userInfo?user_id=:user_id',{user_id:'@user_id'});
	 });

employeeprofile.controller('employeeprofileController',['$scope','$location','$resource', '$timeout','employeeprofileInfo',function($scope,$location, $resource, $timeout,employeeprofileInfo){
	var userid = $location.search().user_id;
	employeeprofileInfo.get({user_id:userid},function(response){
		$scope.employee=response.data;
		$scope.employee.url = bidprojApp.baseurl + $scope.employee.url; 
		//$scope.profileInfo=response;
	});
	
		
}]);
return employeeprofile;
});
