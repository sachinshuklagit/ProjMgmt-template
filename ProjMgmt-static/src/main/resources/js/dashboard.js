define(['angular'], function(angular) {
var dashboard=angular.module('dashboard', ['ngResource']);



dashboard.controller('dashboardController',['$scope','$location','$resource', '$timeout',function($scope,$location, $resource, $timeout){
	var emailId = $location.search().email_id;
	var postResource = $resource(bidprojApp.baseurl +'/bidprojservices/retrievePostsForFilterationAndDashBoard?email_id='+emailId, {});
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
return dashboard;
});
