function initMap() {
    let mapOptions = {
        zoom: 5,
        center: { lat: 59.312527, lng: 18.061619 },
        disableDefaultUI: true,
        draggable: false
    };

    let nestEmptyIcon = {
        url: "src/img/bird_nest_empty.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let nestBlueEggs = {
        url: "src/img/bird_nest_blue.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let nestRedEggs = {
        url: "src/img/bird_nest_red.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let redBirdIcon = {
        url: "src/img/red_kiwi.png",
        scaledSize: new google.maps.Size(50, 50),
    };

    let playerMarker = new google.maps.Marker(
        {
            icon: redBirdIcon,
            title: 'YOU',
            content: '<h2>YOU</<h2>',
        });

    let nests = []

    let mapDiv = document.getElementById("map");

    let map = new google.maps.Map(mapDiv, mapOptions);

    let playerLatLng,
        distanceToNest;

    // Find the location of the player
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
            if (distanceToNest < 20) {
                snatchNest(nests[i]);
            }
        }
    }

    function snatchNest(nest) {
        alert(`The ${nest.title} can now be snatched!`);
    }


}
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      nests = this.response;
    }
  };
  xhttp.open("GET", "https://nestr-backend.herokuapp.com/api/nests", true);
  xhttp.send();
}
function addLoadEvent(func) {
  var oldonload = window.onload; // Save the current onload handler

  if (typeof window.onload != 'function') // If there was no existing handler...
    {
    window.onload = func; // assign the new handler to window.onload
  } else {
    window.onload = function() // Overwrite existing handler with a new handler, consisting of...
    {
      oldonload(); // a call to the old saved handler plus...
      func(); // a call to the new specified handler.
    }
  }
}
addLoadEvent(loadDoc);
