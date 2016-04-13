angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('PostsCtrl', function($rootScope, $scope, Posts, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $rootScope.$on('updatePosts', function (event, toState, toParams, fromState, fromParams, options) {
    setAllPosts();
  });

  function setAllPosts(){
    Posts.all().then(function(res) {
        $scope.posts = res;
      }
    );
  }

  setAllPosts();

  $scope.remove = function(post) {
    Posts.remove(post).then(function(res){
        $rootScope.$emit('updatePosts');
      }
    );
  };
})

.controller('PostDetailCtrl', function($scope, $stateParams, Posts) {
  Posts.get($stateParams.postId).then(function(res){
    $scope.post = res;
  });
})

.controller('NewCtrl', function($rootScope, $scope, Posts, $state) {

  $scope.post = {
    content: ''
  };


  $scope.setPost = function(){
    Posts.set($scope.post).then(function(res){
      $rootScope.$emit('updatePosts');
      $state.go('tab.posts');
    });
  };


  //$scope.settings = {
  //  enableFriends: true
  //};
})
  .controller('LoginCtrl', function($rootScope, $scope, Users, $state) {

$scope.login = function(){
  Users.login().then(function(res){
console.log(res);
  });
};


    //$scope.settings = {
    //  enableFriends: true
    //};
  });
