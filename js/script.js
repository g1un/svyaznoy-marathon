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
			var markerImageNull = new google.maps.MarkerImage('../img/marker-sm-blue.png',
				new google.maps.Size(7, 7),
				new google.maps.Point(0, 0),
				new google.maps.Point(4, 4)
			);

			var markerImageNullPhoto = new google.maps.MarkerImage('../img/marker-xs-green.png',
				new google.maps.Size(7, 7),
				new google.maps.Point(0, 0),
				new google.maps.Point(4, 4)
			);

			var markerImage = new google.maps.MarkerImage('../img/marker.png',
				new google.maps.Size(15, 15),
				new google.maps.Point(0, 0),
				new google.maps.Point(7, 7)
			);

			var markerImagePhoto = new google.maps.MarkerImage('../img/marker-sm-green-photos.png',
				new google.maps.Size(15, 15),
				new google.maps.Point(0, 0),
				new google.maps.Point(7, 7)
			);

			var markerImageBig = new google.maps.MarkerImage('../img/marker-lg.png',
				new google.maps.Size(30, 30),
				new google.maps.Point(0, 0),
				new google.maps.Point(15, 15)
			);

			var markerImageBigPhoto = new google.maps.MarkerImage('../img/marker-lg-green-photos.png',
				new google.maps.Size(30, 30),
				new google.maps.Point(0, 0),
				new google.maps.Point(15, 15)
			);

			function createMarker(dist, photos) {
				if(dist == 0) {
					return photos == 1 ? markerImageNullPhoto : markerImageNull;
				} else if(dist < 50) {
					return photos == 1 ? markerImagePhoto : markerImage;
				} else {
					return photos ==1 ? markerImageBigPhoto : markerImageBig;
				}
			}

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

			//create Clipboard object for copying link to buffer
			var clipboard = new Clipboard(ibOptions.content.querySelector('.js-link'));
			clipboard.on('success', alertCopy);
			function alertCopy(e) {
				alert('Ссылка скопирована в буфер обмена');
			}

			//creating markers
			cities.forEach(function(city) {
				markers[city.id] = new google.maps.Marker({
					map: map,
					position: city.coordinates,
					icon: createMarker(city.distance, city.hasPhotos)
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
				ibOptions.content.querySelector('.js-photos').href = city.url;
				ibOptions.content.querySelector('.js-photos-num').innerHTML = city.count_photos;

				//set attribute for Clipboard
				ibOptions.content.querySelector('.js-link')
					.setAttribute('data-clipboard-text', window.location.href.split('#')[0] + '#' + city.id);
			}

			//resizer for changing infoBox view according to vieport size
			var smalled;

			function resizer() {

				var small = function() { return window.innerWidth <= 1023; };

				if(small() && smalled) return;
				if(!small() && !smalled && smalled != 'undefined') return;

				if(small() && ib) {
					ib.setOptions({pixelOffset: new google.maps.Size(-136, -337)});
					smalled = true;
				} else if(ib) {
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

	(function() {
		if(!document.querySelector('.js-magnificPopup')) return;

		$(document).ready(function() {
			$('.js-magnificPopup').magnificPopup({
				type:'image',
				closeMarkup:
							'<div class="rating-photo-close mfp-close">' +
								'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-59.6 562.2 13.1 13.1">' +
									'<circle fill="#F86524" cx="-53" cy="568.8" r="6.6"/>' +
									'<g fill="#FFF">' +
										'<path d="M-51.782 571.193l-3.606-3.606c-.283-.283-.354-.778-.07-1.203l.07-.07c.283-.283.778-.354 1.202-.07l.07.07 3.607 3.606c.283.283.353.778.07 1.202l-.07.07a.896.896 0 0 1-1.273 0c.07.072 0 0 0 0z"/>' +
										'<path d="M-55.388 569.99l3.606-3.606c.283-.282.778-.353 1.202-.07l.07.07c.284.283.354.778.072 1.203l-.071.07-3.606 3.607c-.283.282-.778.353-1.202.07l-.071-.07a.896.896 0 0 1 0-1.273c-.07.07 0 0 0 0z"/>' +
									'</g>' +
								'</svg>Закрыть' +
							'</div>'
			});
		});
	})();

	//cities alphabet
	(function() {
		if(!document.querySelector('.cities')) return;

		//cache Dom
		var alphabet = document.querySelector('.cities');

		getOffsetTop();

		//bind events
		window.addEventListener('resize', getOffsetTop);

		//get offset top
		function getOffsetTop() {
			alphabet.style.height = window.innerHeight - alphabet.getBoundingClientRect().top + 'px';
		}
	})();

	//progress bar
	// (function() {
	// 	if(!document.querySelector('.js-progress-line')) return;
	//
	// 	//cache Dom
	// 	var line = document.querySelector('.js-progress-line');
	// 	var info = document.querySelector('.js-progress-info');
	//
	// 	checkStyle();
	//
	// 	//get style
	// 	function getStyle() {
	// 		return line.style.width;
	// 	}
	//
	// 	//check style
	// 	function checkStyle() {
	// 		if(getStyle() == '100%' || !getStyle()) {
	// 			info.classList.add('_finish');
	// 		}
	// 	}
	// })();
});