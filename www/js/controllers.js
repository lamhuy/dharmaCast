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


.controller('TopiclistsCtrl', function($scope,  $stateParams, audioFactory) {
	// grab json
	audioFactory.getTopicLists($stateParams.dharmaCastName).then(function(response) {
		
		console.info('Topiclists ', response.data);
		$scope.title = response.data.title;
		$scope.artistKey = response.data.key;
		$scope.playlists = response.data.playlists;
		
	}, function(error) {
		
		console.info(error);
	});
	
	
	
})

.controller('PlaylistCtrl', function($scope, $stateParams, $ionicPlatform, audioFactory) {
	console.info($stateParams);
	console.info($stateParams.playlistId);
	console.info($stateParams.dharmaCastName);
 
	// inner variables
	var song;
	var tracker = $('.tracker');
	var volume = $('.volume');
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
		
	
	function initAudio(elem) {
		var url = elem.attr('audiourl');
		var title = elem.text();
		var cover = elem.attr('cover');
		var artist = elem.attr('artist');

		$('.player .title').text(title);
		$('.player .artist').text(artist);
		$('.player .cover').css('background-image', 'url(/' + cover + ')');
		;

		song = new Audio(url);
		// timeupdate event listener
		song.addEventListener('timeupdate', function() {
			var curtime = parseInt(song.currentTime, 10);
			tracker.slider('value', curtime);
		});

		$('.playlist li').removeClass('active');
		elem.addClass('active');
	}

	function initTrack(track) {

		$('.player .title').text(track.title);
		$('.player .artist').text(track.artist);
		// $('.player .cover').css('background-image','url(/' + cover+')');;

		song = new Audio(track.src);
		//console.info("SONG DURATION: ", song.duration);
		// timeupdate event listener
		song.addEventListener('timeupdate', function() {
			var curtime = parseInt(song.currentTime, 10);
			tracker.slider('value', curtime);
			
			var s = parseInt(song.currentTime % 60);
			var m = parseInt((song.currentTime / 60) % 60);
			if(s<10)
				  s = '0' + s;
			$scope.duration =  m + ':' + s;
			
			$scope.value = song.currentTime;
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
		
		song.addEventListener("loadeddata", function() {
			 console.log("Audio data loaded");
			 console.log("Audio duration: " + this.duration);
			CreateSeekBar();
			});
	
	
		if(currentTrackIndex == 0){
			control.prevEnabled = false;
		}
		
		
		$('.playlist li').removeClass('active');
		/* elem.addClass('active'); */
	}

	function playAudio() {
		song.play();

		tracker.slider("option", "max", song.duration);

		$('.play').addClass('hidden');
		$('.pause').addClass('visible');
	}
	function stopAudio() {
		song.pause();

		$('.play').removeClass('hidden');
		$('.pause').removeClass('visible');
	}

	// play click
	$('.play').click(function(e) {
		e.preventDefault();

		playAudio();
	});

	// pause click
	$('.pause').click(function(e) {
		e.preventDefault();

		stopAudio();
	});

	// forward click
/*	$('.fwd').click(function(e) {
		e.preventDefault();

		stopAudio();

		var next = $('.playlist li.active').next();
		if (next.length == 0) {
			next = $('.playlist li:first-child');
		}
		initAudio(next);
	});

	// rewind click
	$('.rew').click(function(e) {
		e.preventDefault();

		stopAudio();

		var prev = $('.playlist li.active').prev();
		if (prev.length == 0) {
			prev = $('.playlist li:last-child');
		}
		initAudio(prev);
	});*/

	$scope.prevTrack = function() {

		stopAudio();
				
		if(currentTrackIndex > 0){			
			currentTrackIndex--;
			initTrack(tracks[currentTrackIndex]);
		}

		
	}

	$scope.nextTrack = function() {

		stopAudio();
		
		if(currentTrackIndex < tracks.length){
			currentTrackIndex++;
			initTrack(tracks[currentTrackIndex]);
		}



	}

	// show playlist
	/*
	 * $('.pl').click(function (e) { e.preventDefault();
	 * 
	 * $('.playlist').fadeIn(300); });
	 */

	// playlist elements - click
	/*
	 * $('.playlist li').click(function () { stopAudio(); initAudio($(this));
	 * playAudio(); });
	 */
	// initialization - first element in playlist
	// initAudio($('.playlist li:first-child'));
	//initTrack(tracks[currentTrackIndex]);
	// set volume
	//song.volume = 0.8;

	// initialize the volume slider
	volume.slider({
		range : 'min',
		min : 1,
		max : 100,
		value : 80,
		start : function(event, ui) {
		},
		slide : function(event, ui) {
			song.volume = ui.value / 100;
		},
		stop : function(event, ui) {
		},
	});

	// empty tracker slider
	tracker.slider({
		range : 'min',
		min : 0,
		max : 10,
		start : function(event, ui) {
		},
		slide : function(event, ui) {
			song.currentTime = ui.value;
		},
		stop : function(event, ui) {
		}
	});

	$scope.playTrack = function(event, index, track) {
		event.preventDefault();
		stopAudio();
		//udpate current index
		currentTrackIndex = index;
		initTrack(track);
		// sleep need or tracker slider won't work
		setTimeout(function() {
			// do what you need here
			playAudio();
		}, 100);

	}
	
	
	function CreateSeekBar() {
		  var seekbar = document.getElementById("audioSeekBar");
		    $scope.value = 0;
		    $scope.min = 0;
		    $scope.max = song.duration;;
		    $scope.duration = '0:00';
		    
		  seekbar.min = 0;
		  seekbar.max = 
		  seekbar.value = 0;
		  var s = parseInt(song.duration % 60);
		  var m = parseInt((song.duration / 60) % 60);
		  if(s<10)
			  s = '0' + s;
		  $scope.audioLen = m + ':' + s;
		
		  $scope.$apply()
	}

/*	function EndofAudio() {
	  document.getElementById("audioSeekBar").value = 0;
	}*/

	$scope.audioSeekBar = function() {
	  var seekbar = document.getElementById("audioSeekBar");
	  song.currentTime = seekbar.value;
	}


/*	audio.addEventListener("timeupdate", function() {
	  var duration = document.getElementById("duration");
	  var s = parseInt(song.currentTime % 60);
	  var m = parseInt((song.currentTime / 60) % 60);
	  duration.innerHTML = m + ':' + s;
	}, false);
	*/
	
	$scope.$on("$destroy", function() {
		console.info("leaving controller");
		stopAudio();
    });
	 
	

	
	$scope.tracks = tracks;
	$scope.currentTrackIndex = currentTrackIndex;
	$scope.control = control;
	$scope.audioLen = audioLen;
});
