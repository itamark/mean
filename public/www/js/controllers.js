angular.module('starter.controllers', [])

.controller('PostsCtrl', function($scope, $state, Posts, PopupService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
    $scope.getPosts();
  });

  $scope.posts = [];

  $scope.getPosts = function() {
    PopupService.loading();

    Posts.all().then(function(data){
      angular.forEach(data, function(data, key){
        if (data.comments){
          data.comments = Object.keys(data.comments).length;
        } else {
          data.comments = 0;
        }
      });
      $scope.posts = data;
      console.log('Posts',$scope.posts);
    })
    .finally(function(){
      PopupService.hideLoading();
    });
  };

  $scope.remove = function(post) {
    Posts.remove(post).then(function(res){
        $rootScope.$emit('updatePosts');
      }
    );
  };

})

.controller('PostDetailCtrl', function($ionicModal, $scope, $stateParams, Auth, Posts, Comments, PopupService, $state) {

  $scope.userId = $stateParams.userId;
  $scope.postId = $stateParams.postId;

  $scope.post = {};

  $scope.getPostByUser = function() {
    PopupService.loading();

    Posts.get($scope.userId, $scope.postId).then(function(data){
      if (data.comments){
        data.comments = Object.keys(data.comments).length;
      } else {
        data.comments = 0;
      }
      $scope.post = data;

      $scope.getComments();
    })
    .finally(function(){
      PopupService.hideLoading();
    });
  };

  $scope.getComments = function() {
    Comments.get($scope.postId).then(function(data){
      $scope.comments = data;
    });
  };

  $scope.commentForm = {};

  $ionicModal.fromTemplateUrl('templates/commentForm.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.close = function() {
    $scope.modal.hide();
  };

  $scope.open = function() {
    $scope.modal.show();
  };

  $scope.saveComment = function() {
    Auth.getProfile(Auth.getMyUID()).then(function(data){
      $scope.commentForm.displayName     = data.displayName;
      $scope.commentForm.profileImageURL = data.profileImageURL;

      Comments.saveComment($scope.userId, $scope.postId, $scope.commentForm).then(function(){
        PopupService.alert('Info', 'Comment posted');
        $state.go($state.current, {userId:  $scope.userId, postId:  $scope.postId}, {reload: true});
        })
      .finally(function(){
        $scope.commentForm = {};
        $scope.close();
      });
    });
  };
  /* Controller logics */
  $scope.getPostByUser();

})

.controller('NewCtrl', function(Auth, PopupService, Posts, $scope, $state) {

  $scope.post = {};

  $scope.user = {};

  $scope.setPost = function(){
    PopupService.loading();

    Auth.getProfile(Auth.getMyUID()).then(function(data){
      $scope.post.displayName     = data.displayName;
      $scope.post.profileImageURL = data.profileImageURL;

      Posts.set($scope.post).then(function(){
        PopupService.alert('Info', 'Post submitted.');
        $state.go('tab.posts');
      })
      .finally(function(){
        $scope.post = {};
        PopupService.hideLoading();
      });

    });
  };

  Auth.getProfile(Auth.getMyUID()).then(function(data){
    $scope.user = data;
  });

})

.controller('ProfileCtrl', function($scope, $state, Auth, Posts) {
var uid = $state.params.userId ? $state.params.userId : Auth.getMyUID();
  $scope.user = {};
  $scope.logout = function(){
    Auth.logout().then(function(){
      $state.go('login');
    })
  };


  /* Controller logics */

  Auth.getProfile(uid).then(function(data){
    console.log(data);
    $scope.user = data;
    $scope.user.isOwnProfile = Auth.isOwnProfile(uid);
  });

  Posts.getByUser(uid).then(function(data){
    console.log(data);
    $scope.posts = data;
  })


})

.controller('LoginCtrl', function($scope, Auth, PopupService, Users, $state, $cordovaOauth, $http, $auth, $ionicLoading) {

  $scope.passportLinkedIn = function(){
    $http.get('/auth/linkedin').then(function(res){
      console.log(res);
    });
  };

  $scope.authenticate = function(provider) {
    $auth.authenticate(provider);
  };

  $scope.loginWithFacebookOauth = function(){
    PopupService.loading();
    $cordovaOauth.facebook("835041403216623", ["email", "public_profile", "user_friends"]).then(function(result) {
      Auth.updateProfile(result).then(function(){
        console.log('User data updated');
      });
      //PopupService.alert('Info','Welcome to CMGR');
      $state.go('tab.posts');
      console.log(JSON.stringify(result));
    }, function(error) {
      console.log(error);
    });
    //$cordovaOauth.linkedin('777e88m15vltcr', 'em5BATHfg0Zv5uwO',
    //  "http:localhost:4000/auth/linkedin/callback",
    //  ["r_basicprofile",
    //    "r_emailaddress"], true).then(function(result) {
    //  console.log(JSON.stringify(result));
    //}, function(error) {
    //  console.log(error);
    //});
  };

  $scope.loginWithLinkedIn = function(){
    PopupService.loading();
    $cordovaOauth.linkedin('777e88m15vltcr', 'em5BATHfg0Zv5uwO',
      "http:localhost:4000/auth/linkedin/callback",
      ["r_basicprofile",
      "r_emailaddress"], true).then(function(result) {
      console.log(JSON.stringify(result));
    }, function(error) {
      console.log(error);
    });
  };

  $scope.loginWithFacebook = function(){
    PopupService.loading();
    Auth.loginWithFacebook().then(function(data){
       console.log('Logged in as:', data);
      Auth.updateProfile(data).then(function(){
        console.log('User data updated');
      });
      PopupService.alert('Info','Welcome to CMGR');
      $state.go('tab.posts');
    },function(error){
      PopupService.alert('Error',error);
    })
    .finally(function(){
      PopupService.hideLoading();
    });
  };

  //////////// Attempt to use Native Facebook signin
  // This is the success callback from the login method
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
      .then(function(profileInfo) {
        // For the purpose of this example I will store user data on local storage
        Users.setUser({
          authResponse: authResponse,
          userID: profileInfo.id,
          name: profileInfo.name,
          email: profileInfo.email,
          picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
        });
        $ionicLoading.hide();
        $state.go('app.home');
      }, function(fail){
        // Fail get profile info
        console.log('profile info fail', fail);
      });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);

        // Check if we have our user saved
        var user = Users.getUser('facebook');

        if(!user.userID){
          getFacebookProfileInfo(success.authResponse)
            .then(function(profileInfo) {
              // For the purpose of this example I will store user data on local storage
              Users.setUser({
                authResponse: success.authResponse,
                userID: profileInfo.id,
                name: profileInfo.name,
                email: profileInfo.email,
                picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
              });

              $state.go('app.home');
            }, function(fail){
              // Fail get profile info
              console.log('profile info fail', fail);
            });
        }else{
          $state.go('app.home');
        }
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
        // but has not authenticated your app
        // Else the person is not logged into Facebook,
        // so we're not sure if they are logged into this app or not.

        console.log('getLoginStatus', success.status);

        $ionicLoading.show({
          template: 'Logging in...'
        });

        // Ask the permissions you need. You can learn more about
        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };

});
