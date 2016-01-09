define(['angular', 'bootstrap'], function(angular) {
	'use strict';
	var postAdModule=angular.module('postAd', []);
	
	postAdModule.factory('PostAdd', function($resource) {
		return $resource(bidprojApp.baseurl + '/bidprojservices/postAdd');
	});
	
	postAdModule.factory('ProductResource', function($resource) {
		return $resource(bidprojApp.baseurl + '/bidprojservices/getProduct/:name', {name:'@name'});
	});
	
	postAdModule.factory('PresignedUrlResource', function($resource) {
		return $resource(bidprojApp.baseurl + '/bidprojservices/presignedurl?organization=:organization&product=:product&user_id=:user_id&key=:imageName',
				{organization:'@organization', product:'@product', user_id:'@user_id', imageName:'@imageName'});
	});
	
	postAdModule.controller('postAdController',['$scope', '$resource', '$location', '$timeout', '$http', 'LocalStorage', 'PostAdd','ProductResource', 'PresignedUrlResource',
	                                            function($scope, $resource, $location, $timeout, $http, LocalStorage, PostAdd, ProductResource, PresignedUrlResource){
		
		//	Uploaded image counter
		var imageCounter=0;
		//	Upload image limit
		var imageUploadLimit = 5;
		$scope.formData = {};
		
		var userDetails = LocalStorage.getLocalstorage;
		$scope.formData.organization = userDetails.organization;
		$scope.formData.user_id = userDetails.user_id;
		
		
		/*
			This function gets all the sub-categories for the selected product.
		*/
		$scope.setProdcut=function(product){
			
			ProductResource.get({name:product}, function(response){
				if(response.error != "null" && response.data != "null"){
					$('#subCategoryDiv').slideUp('slow');
					if(!$scope.productAttr){
						$scope.productAttr = response.data.data.attribute;
					} else {
						$timeout(function() {
							$scope.productAttr = response.data.data.attribute;
						}, 600);
					}
					$timeout(function() {
						$('#subCategoryDiv').slideDown('slow');
					}, 1);
				} else{
					$('#subCategoryDiv').slideUp('slow');
				}
			});
	
			$scope.formData.product = product;
			$("#product_dialog").removeClass("in");
			$("#product_dialog").attr("style","display:none;");
			$("#product_dialog").attr("aria-hidden","true");
			$( "body").removeAttr( "class style" );
			$( ".modal-backdrop" ).remove();
		}
		
		/*
			This function uploads a file to S3 Bucket
		*/
		$scope.imageUpload = function(){
		//$("#fileupload").change(function () {
			
			if (typeof (FileReader) != "undefined"){	
			
				var dvPreview = $("#dvPreview");
				var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
				$scope.file =$scope.image1.compressed.dataURL;
				$scope.fileName = $scope.image1.file.name;
	
				if (regex.test($scope.fileName.toLowerCase())) {
					var reader = new FileReader();
					
					reader.onload = function (e){					
						var span = $("<span />");
						
						var img = $("<img />");
						img.attr("class", "img-rounded");
						img.attr("style", "height:100px; width:100px; margin:3px;");
						img.attr("src", e.target.result);
						
						if(imageCounter == 0){
							span.attr("class", "primary-img-border");
						}
						span.append(img);
						dvPreview.append(span);
						
						if(++imageCounter >= imageUploadLimit){
							$("#fileupload").attr("disabled","true");
						}
					}
					
					$(".page-loader").fadeIn("slow");
	
					//Generates the presigned object and upload the files to s3.
					PresignedUrlResource.get({organization : $scope.formData.organization, product : $scope.formData.product, user_id : $scope.formData.user_id, imageName:$scope.fileName}, function (response){					
						if(response.error != 'null'){
							var s3url = response.data.presignedurl;
							s3url = bidprojApp.baseurl + s3url.substring(s3url.indexOf("/organizations"));
							var contentType = response.data.contentType;
							var compressedFile = $scope.dataURItoBlob($scope.file);
							$http.put(s3url, compressedFile, {
								transformRequest: angular.identity,
								headers: {'Content-Type': contentType}
							})
							.success(function(){
								reader.readAsDataURL($scope.image1.file);
								if(imageCounter==0){
									$scope.formData.priImageUrl = {};
									$scope.formData.priImageUrl.url = response.data.filePath;
								} else {
									if(!$scope.formData.secImageUrl){
										$scope.formData.secImageUrl = [];
									}
									$scope.formData.secImageUrl.push({url : response.data.filePath});
								}
								$(".page-loader").fadeOut("slow");
							})
							.error(function(error){
								$(".page-loader").fadeOut("slow");
								alert("Error in file upload");
								console.log(error);
							});
						}else{
							console.log("error occurred" );
						}
					});
				}
				else{
					alert("Error in file upload.");
					console.log($scope.file + " is not a valid image file.");
					return false;
				}
			}
			else{
				alert("This application does not support HTML5 FileReader.");
			}
		//});
		}
		
		/*
			This function submits the Ads.
		*/
		$scope.submitPost = function(){
	
			var finalData = "";
			var priDataArr = new Array();
			var secDataArr = [];		
			var key = "";
			var val = "";
			var invalid = false;
			
			$(".form-control").each( function(){
				if($(this).hasClass( "required" ) && $(this).val().trim() == ""){
					var lval = $(this).attr("placeholder");
					var n = lval.indexOf(":");
					if(n>0){
						lval = lval.substring(0, lval.indexOf(":"));
					}				
					$("#errMsg").html(lval+" is required!");
					$("#errMsg").removeClass("hide");
					$(this).focus();
					invalid = true;
					return false;
				}
			});
			
			if(invalid == false ){
				if(imageCounter > 1){
					var priImgIndex = 0;
					$(".image-source span").each(function() {
						if ($(this).hasClass('primary-img-border')) {
							return false;
						}
						priImgIndex++;
					});
					if(priImgIndex > 0){
						var tempImg = $scope.formData.priImageUrl;
						$scope.formData.priImageUrl = $scope.formData.secImageUrl[priImgIndex-1];
						
						$scope.formData.secImageUrl.splice(priImgIndex-1, 1);
						//add the image at the front of the array - unshift
						$scope.formData.secImageUrl.unshift(tempImg);
					}
				}
				
				console.log($scope.formData);
				console.log(JSON.stringify($scope.formData));
				
				PostAdd.save({}, $scope.formData, function(response){
					if(response.error != "null"){
						$("#postMsg").removeClass("hide");
						$("#submit").attr("disabled",true);
						$timeout(function() {
							$location.path('/viewAd').search('postid',response.data);
						}, 1000);
					}
				});
			}
		}
	
		/*
			Primary image selector event
		*/
		$(".image-source").on("click", "span",  function(){
			if(imageCounter > 1){
				$(".image-source span").removeAttr("class");
				$(this).attr("class", "primary-img-border");
			}
		});
		
		/*
		  	Converting compressed file back to image.
		*/
		$scope.dataURItoBlob = function (dataURI) {
	    // convert base64/URLEncoded data component to raw binary data held in a string
			var byteString;
			if (dataURI.split(',')[0].indexOf('base64') >= 0)
				byteString = atob(dataURI.split(',')[1]);
			else
				byteString = unescape(dataURI.split(',')[1]);
	
			// separate out the mime component
			var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	
			// write the bytes of the string to a typed array
			var ia = new Uint8Array(byteString.length);
			for (var i = 0; i < byteString.length; i++) {
				ia[i] = byteString.charCodeAt(i);
			}
			return new Blob([ia], {type:mimeString});
		}
		
	}]);
	return postAdModule;
});