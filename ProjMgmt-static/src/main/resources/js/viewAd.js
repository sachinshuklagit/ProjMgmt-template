define(['angular'], function(angular) {
'use strict';

	var viewAdModule=angular.module('viewAd', []);
	
	viewAdModule.factory('ViewData', function($resource) {
	return $resource(bidprojApp.baseurl + '/bidprojservices/retrievePostByPostId?id=:post_id', { post_id:'@post_id'});
	});
	
	viewAdModule.factory('PostComment', function($resource) {
		return $resource(bidprojApp.baseurl + '/bidprojservices/comment');
	});

	viewAdModule.controller('viewAdController',['$scope', '$location','$http', '$resource', 'LocalStorage', 'ViewData', 'PostComment',
		function($scope, $location, $http, $resource, LocalStorage, ViewData, PostComment){
		
		var post_id = $location.search().postid;

		ViewData.get({post_id:post_id}, function(response){
			$scope.data = response.data[0];
			if(!$scope.data.priImageUrl){
				$('#displayImage').html("<div class='big-icon'><i class='fa fa-picture-o fa-1x '> </div>");
			} else {
				$scope.data.priImageUrl.url = bidprojApp.baseurl + $scope.data.priImageUrl.url;
			}
			for (var i=0; i<$scope.data.secImageUrl.length; i++) {
				$scope.data.secImageUrl[i].url = bidprojApp.baseurl + $scope.data.secImageUrl[i].url;
			}
		});
		
		$scope.postCommentOrReply = function(index){
			if ( !($scope.commentMsg || $("#reply" + index).val()) ) {
				return;
			}
			var userDetails = LocalStorage.getLocalstorage;
	
			if(userDetails != null){
				var fullName = userDetails.first_name + " " + userDetails.last_name;

				//for only replies we pass index
				if(index>-1){
					var replyMsg = $("#reply" + index).val();
					
					var detail = { message : replyMsg, user_id : userDetails.user_id , user_name : fullName };
					var criteria = { post_id : parseInt($location.search().postid), isParent : false, parent_id : $scope.data.comment[index].comment_id };
					var data = { detail : detail, criteria : criteria}; 

					PostComment.save({}, data, function(response){
						if(response.error != "null"){
							$("#reply" + index).val("");
							var reply = { created_date : response.data.comment.created_date, user_name : fullName, message : replyMsg };
							if(!$scope.data.comment[index].reply){
								$scope.data.comment[index].reply = [];
							}
							$scope.data.comment[index].reply.push(reply);
						}
					});
				}
				//for comments
				else {
					var detail = { message : $scope.commentMsg, user_id : userDetails.user_id , user_name : fullName };
					var criteria = { post_id : parseInt($location.search().postid), isParent : true };
					var data = { detail : detail, criteria : criteria};
				
					PostComment.save({}, data, function(response){
						if(response.error != "null"){
							var comment = {created_date : response.data.comment.created_date, user_name : fullName, message : $scope.commentMsg, comment_id : response.data.comment.comment_id };
							$scope.commentMsg = "";
							if(!$scope.data.comment){
								$scope.data.comment = [];
							}
							$scope.data.comment.push(comment);
						}
					});
				}
			}
		}
		
	}]);
	return viewAdModule;
});