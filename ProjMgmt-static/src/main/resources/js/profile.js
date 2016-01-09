define(['angular'], function(angular) {
'use strict';

var profileModule=angular.module('profile', ['ngStorage']);

profileModule.factory('profileInfo', function($resource) {
   return $resource(bidprojApp.baseurl+'/bidprojservices/user/:email_id',{email_id:'@email_id'});
 });

profileModule.factory('profileUpdate', function($resource) {
	   return $resource(bidprojApp.baseurl+'/bidprojservices/user');
	});


profileModule.factory('userS3ImageUrl', function($resource) {
	return $resource(bidprojApp.baseurl + '/bidprojservices/userS3ImageUrl?organization=:organization&user_id=:user_id&user_name=:user_name&key=:imageName',
			{organization:'@organization', user_id:'@user_id',user_name:'@user_name', imageName:'@imageName'});
});
profileModule.controller('profileController',['$scope','$http','LocalStorage','userS3ImageUrl','profileInfo', 'profileUpdate',function($scope,$http,LocalStorage,userS3ImageUrl,profileInfo,profileUpdate){
	
//	console.log("Get storage "+LocalStorage.getLocalstorage.email_id);
//	var userDetails=LocalStorage.getLocalstorage;
	
//	if(userDetails != null){
//		console.log("inside local storage "+userDetails.security_code);
//		//$location.path('/dashboard');
//	}
	
	/*profileInfo.get(function(response){
		$scope.profileInfo=response;
		alert(response);
	});*/
	//$scope.user;
	var userDetails = LocalStorage.getLocalstorage;
	var emailId=userDetails.email_id;
	profileInfo.get({email_id:emailId},function(response){
		$scope.user=response.data;
		console.log($scope.user);
		//$scope.profileInfo=response;
	});
	
	/*$http.get('data/user.json').success(function(response) {
		$scope.user =  response.data;
		console.log("Profile Data:-" + JSON.stringify($scope.user));
    });*/
	
	$scope.uploadImage = function() {
		 $("#fileupload").trigger("click");
	};
	$scope.editProfile = function() {
        $('.edit_data').removeClass('hide');
        $('.profile_data').addClass('hide');
        $('.save_profile').removeClass('hide');
        $('.edit_profile').addClass('hide');
	};
	
	$scope.saveProfile = function() {
        $('.profile_data').removeClass('hide');
        $('.edit_data').addClass('hide');
        $('.edit_profile').removeClass('hide');
        $('.save_profile').addClass('hide');
        
        var userDetails = LocalStorage.getLocalstorage;
		var emailId=userDetails.email_id;
		
		
        var userData={};
        userData.designation=$('#designation').val().trim();
        userData.first_name=$('#firstname').val().trim();
        userData.last_name=$('#lastname').val().trim();
        userData.gender=$("input:radio[name=gender]:checked").val();
        userData.dob=$('#dob').val().trim();
        userData.mobile_number=$('#mobile').val().trim();
        userData.extension=$('#extension').val().trim();
        userData.city=$('#city').val().trim();
        userData.pincode=$('#pin').val().trim();
        userData.country=$('#country').val().trim();
        userData.address=$('#address').val().trim();
        userData.landline=$('#phone').val().trim();
        userData.email_id=emailId;
		
        console.log(userData);
		profileUpdate.save({},userData, function(response){
			profileInfo.get({email_id:emailId},function(response){
				$scope.user=response.data;
				//$scope.profileInfo=response;
			});
		});
	};
	
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
				
				span.append(img);
				dvPreview.append(span);
				
				
			}
			
			$(".page-loader").fadeIn("slow");
			
			var userDetails = LocalStorage.getLocalstorage;
			var userId = userDetails.user_id;
			var organization = userDetails.organization;
			var userName = userDetails.first_name;
			var emailId=userDetails.email_id;
			
			userS3ImageUrl.get({organization:organization, user_id:userId,user_name:userName, imageName:$scope.fileName}, function (response){					
				if(response.error != 'null'){
					var s3url = response.data.presignedurl;
					s3url = bidprojApp.baseurl + s3url.substring(s3url.indexOf("/user"));
					var contentType = response.data.contentType;
					var compressedFile = $scope.dataURItoBlob($scope.file);
					$http.put(s3url, compressedFile, {
						transformRequest: angular.identity,
						headers: {'Content-Type': contentType}
					})
					.success(function(){
						reader.readAsDataURL($scope.image1.file);
						$(".profile_page_image").attr("src",response.data.filePath);
						
						$scope.user.url=response.data.filePath;
						
						var updatedData={};
						updatedData.email_id=$scope.user.email_id;
						updatedData.url=$scope.user.url;
						
						profileUpdate.save({},updatedData, function(response){
							
						});
						
					
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
			alert($scope.file + " is not a valid image file.");
			return false;
		}
	}
	else{
		alert("This browser does not support HTML5 FileReader.");
	}
//});
}
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

return profileModule;
});