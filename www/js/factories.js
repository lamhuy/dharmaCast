angular.module('starter.factories', [])

.factory('audioFactory', function($http, $q, $timeout) {
	var didSso = false;
	var locationCache = null;
	var flightCache = null;
	var passengerCache = {};

	return {
		getPlayList : function(playlistName) {
			return $http({
	    		  method: 'GET',
	    		  url: 'http://preciousnailspaleesburg.com/playlist_'+ playlistName +'.json'
	    		}).then(function successCallback(response) {
	    			 return response
    		  }, function errorCallback(response) {
    			  return 'ERROR LITS';
    		  });
	
		}

		/*passengers : function(flightTecsID) {
			if (passengerCache[flightTecsID] && passengerCache[flightTecsID].expires > Date.now()) {
				return $q.when(passengerCache[flightTecsID].data);
			}

			return gdHttp.get(environment.current.url + '/passengers', {
				params : {
					flightTecsID : flightTecsID
				}
			}).then(function(success) {
				// Translate reference data, retaining original
				success.data.forEach(function(passenger) {
					passenger.nationalityName = lookup.list('tecsCountry').get(passenger.nationality, 'name') || passenger.nationality;
					passenger.genderName = lookup.list('gender').get(passenger.genderCode, 'name') || passenger.genderCode;
					passenger.paymentTypeName = lookup.list('paymentType').get(passenger.paymentType, 'name') || passenger.paymentType;

					if (Array.isArray(passenger.documents)) {
						passenger.documents.forEach(function(document) {
							document.typeName = lookup.list('tecsDocType').get(document.typeCode, 'name') || document.typeCode;
							document.countryName = lookup.list('tecsCountry').get(document.countryCode, 'name') || document.countryCode;
						});
					}
				});

				// Sort passengers by name
				success.data = $filter('orderBy')(success.data, [ 'lastName', 'firstName' ]);

				passengerCache[flightTecsID] = {
					expires : Date.now() + 1800000, // 30 minutes
					data : success.data
				};
				return passengerCache[flightTecsID].data;
			});
		}*/
	};
});