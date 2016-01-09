define(['angular'], function(angular) {
    'use strict';
    var filterModule = angular.module('filter', []);

   
    filterModule.factory('GetProductAttributes', function ($resource) {
        return $resource(bidprojApp.baseurl+'/bidprojservices/getProduct/:product', {product:'@product'});
    });
	
	filterModule.factory('RetrieveProductByName', function ($resource) {
        return $resource(bidprojApp.baseurl+'/bidprojservices/firstLevelFilter?email_id=:email_id&product=:product',
            {email_id: '@email_id',product: '@product'});
    });

	filterModule.factory('SecondLevelFilter', function($resource) {
		return $resource(bidprojApp.baseurl + '/bidprojservices/retrievePostsForFilterationAndDashBoard');
	});
	filterModule.controller('filterController', ['$scope', '$resource', '$location','RetrieveProductByName','LocalStorage','GetProductAttributes','SecondLevelFilter',
		function ($scope, $resource, $location,RetrieveProductByName,LocalStorage,GetProductAttributes,SecondLevelFilter) {

			var productName = $location.search().product;
			$('#product_e').text(productName);
			var organizationName=LocalStorage.getLocalstorage.organization;
			var organizationEmail=LocalStorage.getLocalstorage.email_id;

			RetrieveProductByName.get({email_id:organizationEmail,product:productName},function(response){
					var products= response.data;
					for (var product in products) {
					if (!products[product].priImageUrl) {
						products[product].priImageUrl = {};
						if(products[product].product == "Mobile"){
							products[product].priImageUrl.url='img/mobile_logo.png';
						}
						else if(products[product].product == "Tablet"){
							products[product].priImageUrl.url = 'img/tablet_logo.png';
						}else if(products[product].product == "Tablet"){
							products[product].priImageUrl.url = 'img/car_logo.png';
						}
						else if(products[product].product == "Car"){
							products[product].priImageUrl.url = 'img/car_logo.png';
						}else{
							products[product].priImageUrl.url = 'img/default_logo.png';
						}
						
					} else {
						products[product].priImageUrl.url = bidprojApp.baseurl + products[product].priImageUrl.url;
					}
				}
				$scope.products = products;
			});
			
			$scope.viewPost = function(postId) {
			$location.path('/viewAd?postid='+postId).replace();
			$location.url($location.path());
			}
			
			
			$('#filter_data').click(function(){
				$('.filter-page').removeClass('hide');
				$('.filter-attr').removeClass('hide');
				
				GetProductAttributes.get({product:productName},function(response){
					$scope.brands=response.data.data.attribute[0].brand.value;


					$scope.attributeArr=[];
					console.log(JSON.stringify(response));
					for(var i=0; i<response.data.data.attribute.length; i++){
					$.each(response.data.data.attribute[i], function(key, value){

						$scope.attributeArr.push(value.label);
					});
					
				}
					
					
				});
			});
			
			$('#filter_cancel_btn').click(function(){
				$('.filter-attr').addClass('hide');
				$('.filter-page').addClass('hide');
			});
			
			$scope.selectTab=function(setTab){
			console.log(setTab);
				$scope.tab=setTab;
			};
			
			$scope.currentTab=function(setTab){
				console.log($scope.tab==setTab);
				return $scope.tab==setTab;
			};

			$scope.filterProducts = function(){
				console.log("filter");

				var brand=[];
				//brand=$("input:checkbox[name=brand]:checked").val();
				$(':checkbox:checked').each(function(i){
					brand[i] = $(this).val();
				});
				console.log(brand);


				//console.log(brand);
				var attribute;
				attribute = {'brand':brand};

				$scope.data={};
				//$scope.data.email_id=email;


				//$scope.data.domains=($location.search().organization).domain;
				//$scope.data.name=($location.search().organization).name;
				$scope.data.organization=organizationName;
				$scope.data.email_id=organizationEmail;
				$scope.data.product=productName
				$scope.data.attribute=attribute;

				var secondlevelfilter=new SecondLevelFilter();
				secondlevelfilter.data=$scope.data;


				secondlevelfilter.$save({},function(response){
						console.log(response);
					$scope.products=$scope.products = response.data;
					$('.filter-attr').addClass('hide');
					$('.filter-page').addClass('hide');

				},function(error){
					console.log(error);

				});



			};
			
        
		}]);
    return filterModule;
});