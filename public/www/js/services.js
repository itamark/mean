angular.module('starter.services', [])
  .factory('Users', function($http, $q){
    return {
      login: function() {
        var deferred = $q.defer();
        $http.get('/auth/linkedin').then(function(res){
            deferred.resolve(res.data);
          },
          function(err){
            return 'could not get posts';
          });
        return deferred.promise;
      }
    }
  })
.factory('Posts', function($http, $q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var posts = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      var deferred = $q.defer();
      $http.get('/api/posts').then(function(res){
        deferred.resolve(res.data);
      },
      function(err){
        return 'could not get posts';
      });
      return deferred.promise;
    },
    remove: function(postId) {
      var deferred = $q.defer();
      $http.delete('/api/posts/'+postId).then(function(res){
        deferred.resolve(res.data);
      });
        return deferred.promise;
    },
    get: function(postId) {
      var deferred = $q.defer();
      $http.get('/api/posts/'+postId).then(function(res){
        deferred.resolve(res.data);
      });
      return deferred.promise;;
    },
    set: function(post){
      var deferred = $q.defer();
      $http.post('/api/posts', post).then(function(res){
          deferred.resolve(res);
      },
      function(err){
        return 'could not set post';
      });
      return deferred.promise;
    }
  };
});
