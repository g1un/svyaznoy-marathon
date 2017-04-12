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

		initMap();

		//initMap
		function initMap() {

			//cities
			var myLatLng = {lat: 55.708327, lng: 52.392155};

			map = new google.maps.Map(mapContainer, {
				center: myLatLng,
				zoom: 6
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

					// map.setCenter(results[0].geometry.location);
					// console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng());

					// var infowindow = new google.maps.InfoWindow({
					// 	content: '<div>Hello!</div>'
					// });
					//
					// marker.addListener('click', function() {
					// 	infowindow.open(map, marker);
					// });

					// var boxText = document.createElement("div");
					var boxText = document.querySelector('#infobox-template').content.querySelector('.infobox');
					// boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px;";
					// boxText.innerHTML = "City Hall, Sechelt<br>British Columbia<br>Canada";

					var myOptions = {
						content: boxText
						,disableAutoPan: false
						,maxWidth: 0
						,pixelOffset: new google.maps.Size(0, -377)
						,zIndex: null
						// ,boxStyle: {
						// 	background: "url('tipbox.gif') no-repeat"
						// 	,opacity: 0.75
						// 	,width: "280px"
						// 	,height: "351px"
						// }
						// ,closeBoxMargin: "10px 2px 2px 2px"
						// ,closeBoxURL: "https://www.google.com/intl/en_us/mapfiles/close.gif"
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

				} else {
					console.log('Geocode was not successful for the following reason: ' + status);
				}
			});
		}

	})();
});