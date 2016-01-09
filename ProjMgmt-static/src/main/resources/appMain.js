require.config({
        paths: {
            'angular': 'lib/angular',
            'jquery': 'lib/jquery-2.1.4.min',
            'bootstrap': 'lib/bootstrap.min',
            'domReady': 'lib/domReady',
            'ngResource': 'lib/angular-resource.min',
            'ngRoute': 'lib/angular-route.min',
            'ngStorage': 'lib/ngStorage',
            'ngCompress': 'lib/directive/ng-image-compress',
            'text': 'lib/requirejs-plugin-text',
//            'app': 'js/app',
            'registration': 'js/registration',
            'product_menu': 'js/product_menu',
            'postAd': 'js/postAd',
            'header': 'js/header',
            'footer': 'js/footer',
            'viewAd': 'js/viewAd',
            'dashboard': 'js/dashboard',
            'profile':'js/profile',
            'useractivities':'js/useractivities',
            'filter':'js/filteration',
            'employeeprofile':'js/employeeprofile'
        },
        shim: {
                
                  angular: {
                  	deps:['jquery'],
                    exports : 'angular'
                  },
				  bootstrap: { deps:['jquery'] },
                  ngResource: { deps:['angular'] },
                  ngRoute: { deps:['angular'] },
                  ngStorage: { deps:['angular'] },
                  ngCompress: { deps:['angular', 'js/app'] }
            }
         });

 require(['js/appMid'],function (app) {
            app.init();
 } );
