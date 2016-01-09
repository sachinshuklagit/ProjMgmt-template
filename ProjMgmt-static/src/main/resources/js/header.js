define(['angular'], function(angular) {

var app=angular.module('header', []);

app.controller('headerCtrl', function($scope,$http,LocalStorage,$location) {
	$scope.count = 0;
	$scope.image_url="img/menu.png";
	$scope.right_menu_open=false;
	$scope.left_menu_open=false;
	
	$http.get('data/user.json').success(function(response) {
		$scope.user =  response.data;
		console.log("Header Data:-" + JSON.stringify($scope.user));
    });
	
	$scope.toggleRightMenu = function toggleRightMenu(event) {
        angular.element('#left_menu').scrollTop(0);
        $scope.left_menu_open=false;
		
        $scope.right_menu_open=!($scope.right_menu_open);
		event.stopPropagation();
	};
	
	$scope.toggleLeftMenu = function toggleLeftMenu(event) {
        angular.element('#right_menu').scrollTop(0);
        $scope.right_menu_open=false;
		
        $scope.left_menu_open=!($scope.left_menu_open);
		event.stopPropagation();
	};
	
	$scope.logout = function(){
		
		LocalStorage.setLocalstorage = null;
		if(LocalStorage.getLocalstorage == null){
			$location.path('/?');
		}
	};
	
	window.onclick = function(event) {
		angular.element('#right_menu').scrollTop(0);
		$scope.right_menu_open = false;
		
		angular.element('#left_menu').scrollTop(0);
		$scope.left_menu_open = false;
		$scope.$apply();
    };
});

return  app;
});