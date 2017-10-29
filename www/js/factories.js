angular.module('starter.factories', [])

.factory('audioFactory', function($http, $q, $timeout) {
	
	return {
		getDharmaCast : function() {
			return $http({
	    		  method: 'GET',
	    		  url: 'https://s3.amazonaws.com/dharmacast/dharmaCast.json'
	    		}).then(function successCallback(response) {
	    			 return response
    		  }, function errorCallback(response) {
    			  return 'ERROR dharmaCast LIST';
    		  });
	
		},
		
		getTopicLists : function(dharmaCastName) {
			return $http({
	    		  method: 'GET',
	    		  url: 'https://s3.amazonaws.com/dharmacast/'+dharmaCastName +'/dharmaCast_'+ dharmaCastName +'.json'
	    		}).then(function successCallback(response) {
	    			 return response
    		  }, function errorCallback(response) {
    			  return 'ERROR topicList for ' + dharmaCastName;
    		  });
	
		},
	
		getPlayList : function(dharmaCastName, playlistName) {
			return $http({
	    		  method: 'GET',
	    		  url: 'https://s3.amazonaws.com/dharmacast/'+dharmaCastName + '/' + playlistName +'/playlist_'+ playlistName +'.json'
	    		}).then(function successCallback(response) {
	    			 return response
    		  }, function errorCallback(response) {
    			  return 'ERROR playlist for ' + playlistName;
    		  });
	
		}

	};
});