document.addEventListener('DOMContentLoaded', function(){

	//hamburger
	(function() {
		if(!document.querySelector('.js-hamburger')) return;

		//cache Dom
		var hamburger = document.querySelector('.js-hamburger');
		var nav = document.querySelector('.js-nav');

		//bind events
		hamburger.addEventListener('click', toggleAside);

		//toggleAside
		function toggleAside() {
			nav.classList.toggle('_show');
		}
	})();

	//google map
	(function() {

		//cache dom
		var mapContainer = document.querySelector('#map');
		var boxText = document.querySelector('#infobox-template').content.querySelector('.infobox');

		initMap();

		//initMap
		function initMap() {

			//cities
			var myLatLng = {lat: 55.708327, lng: 52.392155};

			map = new google.maps.Map(mapContainer, {
				center: myLatLng,
				zoom: 6,
				disableDefaultUI: true,
				styles: [{
					"stylers": [
						{ "saturation": -100 }
					]
				}]
			});

			var geocoder = new google.maps.Geocoder();

			geocodeAddress(geocoder, map);
		}

		//geocoder
		function geocodeAddress(geocoder, resultsMap) {
			var address = 'Набережные челны';
			var markerImage = new google.maps.MarkerImage('../img/marker.png',
				new google.maps.Size(15, 15),
				new google.maps.Point(0, 0),
				new google.maps.Point(7, 7)
			);

			geocoder.geocode({'address': address}, function(results, status) {
				if (status === 'OK') {
					resultsMap.setCenter(results[0].geometry.location);
					var marker = new google.maps.Marker({
						map: resultsMap,
						position: results[0].geometry.location,
						icon: markerImage
					});

					var smalled;

					var myOptions = {
						content: boxText.cloneNode(true)
						,disableAutoPan: false
						,maxWidth: 0
						,pixelOffset: new google.maps.Size(window.innerWidth <= 1023 ? -136 : 0, window.innerWidth <= 1023 ? -337 : -377)
						,zIndex: null
						,closeBoxURL: ""
						,infoBoxClearance: new google.maps.Size(1, 1)
						,isHidden: false
						,pane: "floatPane"
						,enableEventPropagation: false
					};

					google.maps.event.addListener(marker, "click", function (e) {
						ib.open(map, this);
					});

					var ib = new InfoBox(myOptions);

					ib.open(map, marker);

					window.addEventListener('resize', _.throttle(resizer, 100));

					//resize
					function resizer() {

						var small = function() { return window.innerWidth <= 1023; };

						if(small() && smalled) return;
						if(!small() && !smalled && smalled != 'undefined') return;

						if(small()) {
							ib.setOptions({pixelOffset: new google.maps.Size(-136, -337)});
							smalled = true;
						} else {
							ib.setOptions({pixelOffset: new google.maps.Size(0, -377)});
							smalled = false;
						}
					}

				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});
		}
	})();
});