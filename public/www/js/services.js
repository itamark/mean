angular.module('starter.services', [])

.factory("Auth", function(PopupService, $q, $ionicHistory, $firebaseAuth) {
	var Auth = {};

	var myUID = window.localStorage.myUID ? window.localStorage.myUID : "";

	var myRef = new Firebase("https://cmgr.firebaseio.com/");

	Auth.persistUID = function(){
		window.localStorage.myUID = myUID;
	};

	Auth.getMyUID = function(){
		return myUID;
	};

  Auth.isOwnProfile = function(uid){
    console.log(uid, myUID)
    return uid === myUID;
  };

	Auth.loginWithFacebook = function(){
		var def = $q.defer();

		myRef.authWithOAuthPopup("facebook", function(error, authData) {
			if (error) {
				def.reject(error);
			} else {
				myUID = authData.facebook.id;
				Auth.persistUID();
				$ionicHistory.clearCache().then(function(){
					def.resolve(authData);
				});
			}
		}, {
      scope: "public_profile,email,user_friends"
    });
		return def.promise;
	};

	Auth.logout = function(){
		var def = $q.defer();
		myUID = "";
		Auth.persistUID();
		myRef.unauth();
		$ionicHistory.clearCache().then(function(){
			def.resolve("Logged out");
		});

		return def.promise;
	};

	Auth.isLoggedIn = function(){
		var def = $q.defer();

    var facebookAuth =  $firebaseAuth(myRef);

		facebookAuth.$onAuth(function(authData) {
			if (authData === null) {
				def.reject('Not logged in yet');
			} else {
				def.resolve(authData);
			}
		});

		return def.promise;
	};


	Auth.updateProfile = function(authData){
		var def = $q.defer();
		myRef.child('users').child(authData.facebook.id).set({
			uid							: authData.facebook.id ? authData.facebook.id : null,
			displayName			: authData.facebook.displayName ? authData.facebook.displayName : null,
			profileImageURL	: authData.facebook.profileImageURL ? authData.facebook.profileImageURL:  null,
      email: authData.facebook.email ?  authData.facebook.email :  null
    });
		def.resolve();
		return def.promise;
	};

	Auth.getProfile = function(userId){
		var def = $q.defer();

		myRef.child("users").child(userId).once("value", function(snapshot){
      console.log(snapshot);
			var user = snapshot.val();
			def.resolve(user);
		}, function (errorObject) {
		  console.log("The read failed: " + errorObject.code);
		  def.reject(errorObject);
		});
		return def.promise;
	};

  return Auth;
})


.factory('Users', function($http, $q){
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };
  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };
  return {
      login: function() {
        var deferred = $q.defer();
        $http.get('/api/posts').then(function(res){
            deferred.resolve(res.data);
          },
          function(err){
            return 'could not get posts';
          });
        return deferred.promise;
      },
    getUser: getUser,
    setUser: setUser
    }
  })


.factory('Posts', function($q, Auth) {

	var Posts = {};

	var myRef = new Firebase("https://cmgr.firebaseio.com/posts");

	Posts.all = function(){
		var deferred = $q.defer();
		myRef.once("value",function(snapshot){
			var posts = {};
			snapshot.forEach(function(childSnapshot){
				var postsOfUser = childSnapshot.val();
				angular.forEach(postsOfUser, function(post, key){
					posts[key] = post;
				});
			});
      console.log(posts);
			deferred.resolve(posts);
		});
		return deferred.promise;
	};

	Posts.remove = function(postId) {
		var deferred = $q.defer();

		return deferred.promise;
	};

	Posts.get = function(userId, postId) {
    var deferred = $q.defer();
    myRef.child(userId).child(postId).once("value", function(snapshot){
      deferred.resolve(snapshot.val());
    });
    return deferred.promise;
  };

  Posts.getByUser = function(userId) {
    var deferred = $q.defer();
    myRef.child(userId).once("value", function(snapshot){
      deferred.resolve(snapshot.val());
    });
    return deferred.promise;
  };

	Posts.set = function(post) {
		var deferred = $q.defer();
		var postRef =	myRef.child(Auth.getMyUID());
		postRef.push().set({
			"uid"							: Auth.getMyUID(),
			"displayName" 		: post.displayName,
			"profileImageURL" : post.profileImageURL,
			"content"					: post.content,
			"dt_created"			: Firebase.ServerValue.TIMESTAMP
		});
		deferred.resolve();
		return deferred.promise;
	};

	return Posts;

})


.factory('Comments', function($q, Auth) {

	var Comments = {};

	var myRef = new Firebase("https://cmgr.firebaseio.com/");

	Comments.get = function(postId) {
		var deferred = $q.defer();
		myRef.child('comments').child(postId).once("value", function(snapshot){
			deferred.resolve(snapshot.val());
		});
		return deferred.promise;
	};

	// A comment will be stored in Comment node and also Post node.
	Comments.saveComment = function(postUserId, postId, comment) {
		var deferred = $q.defer();

		var commentRef =	myRef.child('comments').child(postId);
		commentRef.push({
			"uid"							: Auth.getMyUID(),
			"displayName" 		: comment.displayName,
			"profileImageURL" : comment.profileImageURL,
			"content"					: comment.content,
			"dt_created"			: Firebase.ServerValue.TIMESTAMP
		}).then(function(data){
			var postRef = myRef.child('posts').child(postUserId).child(postId).child('comments');

			postRef.push().set({
				"commentId"	: data.key()
			});
			deferred.resolve();
		});

		return deferred.promise;
	};

	return Comments;

})

.service('PopupService', function($ionicPopup, $ionicLoading){
	this.alert = function(title, text) {
				   var alertPopup = $ionicPopup.alert({
				     title: title,
				     template: text
				   });

				   return alertPopup;
				 };

 	this.loading = function(){
 		$ionicLoading.show({
 			template: 'Loading<br><ion-spinner></ion-spinner>',
 		});
 	};

 	this.hideLoading = function(){
 		$ionicLoading.hide();
 	};
});
