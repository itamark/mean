angular.module('starter', ['ionic', 'starter.controllers', 'starter.services',
  'starter.directives', 'ionic-datepicker', 'ionic-timepicker','firebase', 'ngCordovaOauth', 'satellizer'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $authProvider) {
  $authProvider.facebook({
    clientId: '835041403216623',
    responseType: 'token',
    name: 'facebook',
    url: '/auth/facebook',
    authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
    redirectUri: window.location.origin + '/',
    requiredUrlParams: ['display', 'scope'],
    scope: ['email'],
    scopeDelimiter: ',',
    display: 'popup',
    type: '2.0',
    popupOptions: { width: 580, height: 400 }
  });
  $stateProvider

  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    onEnter: function($state, Auth){
      Auth.isLoggedIn().then(function(data){
        // console.log('Logged in', data);
      }, function(error){
        console.log(error);
        $state.go('login');
      })
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  .state('tab.posts', {
      url: '/posts',
      views: {
        'tab-posts': {
          templateUrl: 'templates/tab-posts.html',
          controller: 'PostsCtrl'
        }
      }
    })
    .state('tab.post-detail', {
      url: '/posts/:userId/:postId',
      views: {
        'tab-posts': {
          templateUrl: 'templates/post-detail.html',
          controller: 'PostDetailCtrl'
        }
      }
    })

  .state('tab.new', {
    url: '/new',
    views: {
      'tab-new': {
        templateUrl: 'templates/tab-new.html',
        controller: 'NewCtrl'
      }
    }
  })
    .state('login', {
      url: '/login',
          templateUrl: 'templates/login.html',
          controller: 'LoginCtrl'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/posts');

});
