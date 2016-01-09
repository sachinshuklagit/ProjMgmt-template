
define(['angular'], function(angular) {
	var userActivities=angular.module('userActivities', ['ngResource']);



	userActivities.controller('userActivitiesController',['$scope','$location','$resource', '$timeout','$localStorage',function($scope,$location, $resource, $timeout,$localStorage){
		var userId = $localStorage.userDetails.user_id;
		var organization = $localStorage.userDetails.organization;
		var postResource = $resource(bidprojApp.baseurl +'/bidprojservices/myactivities?organization='+organization+'&user_id='+userId);
		postResource.get( {}, function (response) {
			var posts = response.data;
			
			for (var post in posts) {
				if (!posts[post].priImageUrl) {
					posts[post].priImageUrl = {};
					if(posts[post].product == "Mobile"){
						posts[post].priImageUrl.url='img/mobile_logo.png';
					}
					else if(posts[post].product == "Tablet"){
						posts[post].priImageUrl.url = 'img/tablet_logo.png';
					}else if(posts[post].product == "Tablet"){
						posts[post].priImageUrl.url = 'img/car_logo.png';
					}
					else if(posts[post].product == "Car"){
						posts[post].priImageUrl.url = 'img/car_logo.png';
					}else{
						posts[post].priImageUrl.url = 'img/default_logo.png';
					}
					
				} else {
					posts[post].priImageUrl.url = bidprojApp.baseurl + posts[post].priImageUrl.url;
				}
			}
			$scope.activities=posts;
			});
		
		
		$scope.viewPost = function(postId) {
		$location.path('/viewAd?postid='+postId).replace();
		$location.url($location.path());
		}
			
	}]);
	return userActivities;
	});