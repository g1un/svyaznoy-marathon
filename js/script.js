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
		if(!document.querySelector('#map')) return;

		//cache dom
		var mapContainer = document.querySelector('#map');

		initMap();

		//initMap
		function initMap() {

			//initial position on map
			var myLatLng = {lat: 55.708327, lng: 52.392155};

			//map
			map = new google.maps.Map(mapContainer, {
				center: myLatLng,
				zoom: 6,
				disableDefaultUI: true,
				zoomControl: true,
				zoomControlOptions: {
					position: google.maps.ControlPosition.RIGHT_CENTER
				},

				styles: [{
					"stylers": [
						{ "saturation": -100 }
					]
				}]
			});

			//geolocation button
			function addYourLocationButton(map, marker)
			{
				var controlDiv = document.createElement('div');

				var firstChild = document.createElement('button');
				firstChild.style.backgroundColor = '#fff';
				firstChild.style.border = 'none';
				firstChild.style.outline = 'none';
				firstChild.style.width = '28px';
				firstChild.style.height = '28px';
				firstChild.style.borderRadius = '2px';
				firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
				firstChild.style.cursor = 'pointer';
				firstChild.style.marginRight = '10px';
				firstChild.style.padding = '0px';
				firstChild.title = 'Your Location';
				controlDiv.appendChild(firstChild);

				var secondChild = document.createElement('div');
				secondChild.style.margin = '5px';
				secondChild.style.width = '18px';
				secondChild.style.height = '18px';
				secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
				secondChild.style.backgroundSize = '180px 18px';
				secondChild.style.backgroundPosition = '0px 0px';
				secondChild.style.backgroundRepeat = 'no-repeat';
				secondChild.id = 'you_location_img';
				firstChild.appendChild(secondChild);

				google.maps.event.addListener(map, 'dragend', function() {
					document.querySelector('#you_location_img').style.backgroundPosition =  '0px 0px';
				});

				firstChild.addEventListener('click', function() {
					// var imgX = '0';
					// var animationInterval = setInterval(function(){
					// 	if(imgX == '-18') imgX = '0';
					// 	else imgX = '-18';
					// 	document.querySelector('#you_location_img').style.backgroundPosition = imgX+'px 0px';
					// }, 500);
					if(navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(function(position) {
							var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
							marker.setPosition(latlng);
							map.setCenter(latlng);
							// clearInterval(animationInterval);
							document.querySelector('#you_location_img').style.backgroundPosition = '-144px 0px';
						});
					}
					else{
						// clearInterval(animationInterval);
						document.querySelector('#you_location_img').style.backgroundPosition = '0px 0px';
					}
				});

				controlDiv.index = 0;
				map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlDiv);
			}

			var myMarker = new google.maps.Marker({
				map: map,
				animation: google.maps.Animation.DROP,
				// position: faisalabad
			});

			addYourLocationButton(map, myMarker);


			//marker Image & position
			var markerImage = new google.maps.MarkerImage('../img/marker.png',
				new google.maps.Size(15, 15),
				new google.maps.Point(0, 0),
				new google.maps.Point(7, 7)
			);

			var markerImageNull = new google.maps.MarkerImage('../img/marker-sm-blue.png',
				new google.maps.Size(7, 7),
				new google.maps.Point(0, 0),
				new google.maps.Point(4, 4)
			);

			var markerImageBig = new google.maps.MarkerImage('../img/marker-lg.png',
				new google.maps.Size(30, 30),
				new google.maps.Point(0, 0),
				new google.maps.Point(15, 15)
			);

			//markers and infoBlock
			var markers = [];
			var boxText = function() {
				if ('content' in document.querySelector('#infobox-template')) {
					return document.querySelector('#infobox-template').content.querySelector('.js-infobox');
				} else {
					return document.querySelector('#infobox-template').querySelector('.js-infobox');
				}
			};
			var ib;
			var ibOptions = {
				content: boxText().cloneNode(true)
				,disableAutoPan: false
				,maxWidth: 0
				,zIndex: null
				,closeBoxURL: ""
				,infoBoxClearance: new google.maps.Size(1, 81)
				,isHidden: false
				,pane: "floatPane"
				,enableEventPropagation: false
			};
			var clipboard;

			//creating markers
			cities.forEach(function(city) {
				markers[city.id] = new google.maps.Marker({
					map: map,
					position: city.coordinates,
					icon: city.distance == 0 ? markerImageNull : city.distance < 50 ? markerImage : markerImageBig
				});

				//bind 'click' event to marker
				google.maps.event.addListener(markers[city.id], "click", function (e) {
					if(ib) ib.close();

					var _i = markers.indexOf(this);

					createInfoBox(_i);

					ib.open(map, this);
				});

				//bind 'click' event to map
				google.maps.event.addListener(map, "click", function (e) {
					if(ib) ib.close();
				});
			});

			//open ib if opened url has hash
			if(window.location.hash) {
				createInfoBox(window.location.hash.substr(1));
				ib.open(map, markers[window.location.hash.substr(1)]);
			}

			//get pixel Offset
			function getOffset() {
				return new google.maps.Size(window.innerWidth <= 1023 ? -136 : 0, window.innerWidth <= 1023 ? -337 : -377);
			}

			//throttling resizer of infoBox
			window.addEventListener('resize', _.throttle(resizer, 100));

			//create infoBox
			function createInfoBox(_i) {

				//searching for object with _i id in cities
				var city = cities.filter(function(city) {
					return city.id == _i;
				})[0];

				//get current pixel Offset property
				ibOptions.pixelOffset = getOffset();

				//create ib object
				ib = new InfoBox(ibOptions);

				//insert data for current ib template
				ibOptions.content.querySelector('.js-city').innerHTML = city.title;
				ibOptions.content.querySelector('.js-distance').innerHTML = city.distance;
				ibOptions.content.querySelector('.js-likes').innerHTML = city.likes;
				// ibOptions.content.querySelector('.js-photos').href = city.url;
				ibOptions.content.querySelector('.js-photos').addEventListener('click', function(e) {
					e.preventDefault();
				});

				//create Clipboard object for copying link to buffer
				clipboard = new Clipboard(ibOptions.content.querySelector('.js-link'));
				//set Clipboard attribute to copy
				ibOptions.content.querySelector('.js-link')
					.setAttribute('data-clipboard-text', window.location.href.split('#')[0] + '#' + city.id);
			}

			//resizer for changing infoBox view according to vieport size
			var smalled;

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
		}
	})();



    //share
    var shareButtons = {
        pUrl: location.href,
        pTitle: document.title,
        vk: {
            url: 'http://vkontakte.ru/share.php?'
        },
        fb: {
            url: 'https://www.facebook.com/sharer/sharer.php?s=100'
        },
        init: function() {
        	if(!this.$el) return;
            this.cacheDom();
            this.bindEvents();
        },
        cacheDom: function() {
            this.$el = document.querySelector('.js-share');
            this.$fb = document.querySelector('.js-share-fb');
            this.$vk = document.querySelector('.js-share-vk');
        },
        bindEvents: function() {
            this.$fb.addEventListener('click', this.getData.bind(this, 'fb'));
            this.$vk.addEventListener('click', this.getData.bind(this, 'vk'));
        },
        getData: function(net, e) {
            e.preventDefault();
            switch(net) {
                case 'fb':
                    url = this.fb.url;
                    url += '&p[title]=' + encodeURIComponent(this.pTitle);
                    url += '&p[summary]=' + encodeURIComponent('');
                    url += '&p[url]=' + encodeURIComponent(this.pUrl);
                    url += '&p[images][0]=' + encodeURIComponent('');
                    this.share(url);
                    break;
                case 'vk':
                    url = this.vk.url;
                    url += 'url=' + encodeURIComponent(this.pUrl);
                    url += '&title=' + encodeURIComponent(this.pTitle);
                    url += '&description=' + encodeURIComponent('');
                    url += '&image=' + encodeURIComponent('');
                    url += '&noparse=false';
                    this.share(url);
                    break;
                default:
                    return;
                    break;
            }
        },
        share: function(url) {
            window.open(url,'','toolbar=0,status=0');
        }
    };
    shareButtons.init();

	//progress info offset
	(function() {
		if(!document.querySelector('.js-progress-info')) return;

		//cache Dom
		var info = document.querySelector('.js-progress-info');
		var infoOffsetLeft = info.getBoundingClientRect().left;

		//check if info offset < 0
		if(infoOffsetLeft < 0) info.classList.add('_right');
	})();

	//rating photo
	(function() {
		if(!document.querySelector('.js-rating-photo')) return;

		//cache Dom
		var photos = document.querySelectorAll('.js-rating-photo');

		//bind events
		photos.forEach(function(photo) {
			photo.addEventListener('click', showPhoto);
		});

		//showPhoto
		function showPhoto() {

		}
	})();
});