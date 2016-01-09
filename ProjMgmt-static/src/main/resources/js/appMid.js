var bidprojApp = bidprojApp || {};
bidprojApp.baseurl = "http://connect.triconinfotech.com";
//bidprojApp.baseurl = "http://localhost";

define(['angular', 'js/app', 'ngCompress'], function (angular) {
    'use strict';

    var app = angular.module('bidApp');
app.init = function(){
     angular.bootstrap(document, ['bidApp']);
}
return app;
});

