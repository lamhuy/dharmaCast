angular.module('starter.controllers', ['starter.factories'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	// $scope.$on('$ionicView.enter', function(e) {
	// });

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope : $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Open the login modal
	$scope.login = function() {
		$scope.modal.show();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		console.log('Doing login', $scope.loginData);

		// Simulate a login delay. Remove this and replace with your login
		// code if using a login system
		$timeout(function() {
			$scope.closeLogin();
		}, 1000);
	};
})


.controller('DharmaCastCtrl', function($scope, audioFactory) {
	//grab json
	var dharmaCasts  = [];
	
	audioFactory.getDharmaCast().then(function(response) {
		
		console.info("dharmaCasts: ", response.data);
		dharmaCasts = response.data;
		$scope.dharmaCasts = dharmaCasts;
		
	}, function(error) {
		
		console.info(error);
	});
	
	$scope.dharmaCasts = dharmaCasts;
	
})


.controller('TopiclistsCtrl', function($scope,  $stateParams, $ionicScrollDelegate, audioFactory) {
	// grab json
	audioFactory.getTopicLists($stateParams.dharmaCastName).then(function(response) {
		
		console.info('Topiclists ', response.data);
		$scope.title = response.data.title;
		$scope.artistKey = response.data.key;
		$scope.playlists = response.data.playlists;
		
	}, function(error) {
		
		console.info(error);
	});
	
/*	$scope.resizeContent = function() {
		$ionicScrollDelegate.$getByHandle('main').resize();
	};*/
	
	
})

.controller('PlaylistCtrl', function($scope, $stateParams, $ionicPlatform, audioFactory) {
/*	console.info($stateParams);
	console.info($stateParams.playlistId);
	console.info($stateParams.dharmaCastName);*/
 
	// inner variables
	var song;	
	var audioLen = ''
	var currentTrackIndex = 0;
	var control = {
		prevEnabled : false,
		nextEnabled : false
	};

	var tracks = [];
	
	audioFactory.getPlayList($stateParams.dharmaCastName, $stateParams.playlistId).then(function(response) {
		
		console.info('Playlist ', response.data);
		tracks = response.data.playlist;
		$scope.tracks = tracks;
		$scope.title = response.data.title;
		initTrack(tracks[currentTrackIndex]);
	}, function(error) {
		
		console.info(error);
	});		
	
	function initTrack(track) {

		$scope.buttonText = 'icon icon ion-ios-play';
		song = new Audio(track.src);
		
		// timeupdate event listener
		song.addEventListener('timeupdate', function() {
			var s = parseInt(song.currentTime % 60);
			var m = parseInt((song.currentTime / 60) % 60);
			if(s<10)
				  s = '0' + s;
			$scope.duration =  m + ':' + s;
			
			$scope.barValue = song.currentTime;
			$scope.$apply()
			
		});
		
		song.onended= function(){
			//if not end of play list, continue auto play 
			if(currentTrackIndex < tracks.length -1 ){
				$scope.nextTrack();		
				setTimeout(function() {
					playAudio();
				}, 500);
			}
		}
		
		//after audio data is load then create seek bar
		song.addEventListener("loadeddata", function() {			
			CreateSeekBar();
		});
	
	
		if(currentTrackIndex == 0){
			control.prevEnabled = false;
		}
	}

	function playAudio() {
		song.play();		
	}
	function stopAudio() {
		song.pause();
	}

	$scope.prevTrack = function() {
		stopAudio();
		if(currentTrackIndex > 0){			
			currentTrackIndex--;
			$scope.currentTrackIndex =currentTrackIndex;			
			initTrack(tracks[currentTrackIndex]);
			playAudio();
			$scope.buttonText = 'icon icon ion-ios-pause';
		}
		
	}

	$scope.nextTrack = function() {
		stopAudio();		
		if(currentTrackIndex < tracks.length){
			currentTrackIndex++;
			$scope.currentTrackIndex =currentTrackIndex;			
			initTrack(tracks[currentTrackIndex]);
			playAudio();
			$scope.buttonText = 'icon icon ion-ios-pause';
		}
	}
	
	$scope.playBtn = function()	{
		if($scope.buttonText == 'icon icon ion-ios-play'){
			playAudio();
			$scope.buttonText = 'icon icon ion-ios-pause';
		}else{
			stopAudio();			
			$scope.buttonText = 'icon icon ion-ios-play';
		}
	}
	
	$scope.playTrack = function(event, index, track) {
		event.preventDefault();
		stopAudio();
		//udpate current index
		currentTrackIndex = index;
		$scope.currentTrackIndex = index;
		initTrack(track);
		// sleep need or tracker slider won't work
		setTimeout(function() {
			// do what you need here
			playAudio();
		}, 100);

		$scope.buttonText = 'icon icon ion-ios-pause';
		
		
	}
	
	
	function CreateSeekBar() {
		 
		 $scope.barValue = 0;
		 $scope.barMin = 0;
		 $scope.barMax = song.duration;;
		 $scope.duration = '0:00';
		    
		 
		  var s = parseInt(song.duration % 60);
		  var m = parseInt((song.duration / 60) % 60);
		  if(s<10)
			  s = '0' + s;
		  $scope.audioLen = m + ':' + s;
		
		  $scope.$apply()
	}

	$scope.audioSeekBar = function() {	  
	  song.currentTime = $scope.barValue;
	}


	
	$scope.$on("$destroy", function() {
		console.info("leaving controller");
		stopAudio();
    });
	 
	
	$scope.tracks = tracks;
	$scope.currentTrackIndex = currentTrackIndex;
	$scope.control = control;
	$scope.audioLen = audioLen;
});
