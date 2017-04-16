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
				styles: [{
					"stylers": [
						{ "saturation": -100 }
					]
				}]
			});

			//marker Image & position
			var markerImage = new google.maps.MarkerImage('../img/marker.png',
				new google.maps.Size(15, 15),
				new google.maps.Point(0, 0),
				new google.maps.Point(7, 7)
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
				,infoBoxClearance: new google.maps.Size(1, 1)
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
					icon: markerImage
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
});