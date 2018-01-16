function initMap() {

    let mapOptions = {
        zoom: 5,
        center: { lat: 59.312527, lng: 18.061619 },
        disableDefaultUI: true,
        draggable: false
    };

    let nestEmptyIcon = {
        url: "./img/bird_nest_empty.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let nestBlueEggs = {
        url: "./img/bird_nest_blue.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let nestRedEggs = {
        url: "./img/bird_nest_red.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let redBirdIcon = {
        url: "./img/red_kiwi.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let playerMarker = new google.maps.Marker(
        {
            icon: redBirdIcon,
            title: 'YOU',
            content: '<h2>YOU</<h2>',
        });

    let nests = [
        {
            coords: { lat: 59.316667, lng: 18.055983 },
            title: 'Saras Tobak nest',
            content: '<h2>Uninhabited</h2>',
            iconImage: nestEmptyIcon
        },
        {
            coords: { lat: 59.317020, lng: 18.055413 },
            title: 'Angelos Pizzeria nest',
            content: '<h2>Blue birds nest</h2>',
            iconImage: nestBlueEggs
        },
        {
            coords: { lat: 59.317199, lng: 18.054367 },
            title: 'Nitty Gritty nest',
            content: '<h2>Red birds nest</h2>',
            iconImage: nestRedEggs
        }
    ]

    let mapDiv = document.getElementById("map");
    let map = new google.maps.Map(mapDiv, mapOptions);
    let playerLatLng,
    distanceToNest;

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
        for (let i = 0; i < nests.length; i++) {
            // Add marker
            addMarker(nests[i]);
        }
    }

    function addMarker(nest) {
        let marker = new google.maps.Marker({
            position: nest.coords,
            map: map,
        });

        if (nest.title) {
            marker.setTitle(nest.title);
        }

        // Check for custom icon
        if (nest.iconImage) {
            // Set icon image
            marker.setIcon(nest.iconImage);
        }

        if (nest.content) {
            let infoWindow = new google.maps.InfoWindow({
                content: nest.content
            });

            marker.addListener('click', () => {
                infoWindow.open(map, marker);
            });
        }
    }

    function showPosition(position) {
        playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        playerMarker.setPosition(playerLatLng);
        map.setCenter(playerLatLng);
        playerMarker.setMap(map);
        map.setZoom(18);
        checkNestProximity(playerLatLng);
    }

    function checkNestProximity(playerLatLng) {
        for (let i = 0; i < nests.length; i++) {
            let nestLatLng = new google.maps.LatLng(nests[i].coords);
            distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, nestLatLng);
            console.log("Distance to " + nests[i].title + " is : " + distanceToNest);
            if (distanceToNest < 55) {
                snatchNest(nests[i]);
            }
        }   
    }

    function snatchNest(nest) {
        alert(`The ${nest.title} can now be snatched!`);
    }
}