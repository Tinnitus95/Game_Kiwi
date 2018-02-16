function initMap() {

  const url = "https://nestr-dev-backend.herokuapp.com/api/";

  let playerMarker;
  let playerIcon;
  let nests;
  let markers = [];
  let snatchable;
  let dateTime = moment().format();

  // TODO: getcurrent position new google.maps.latlng(pos.coords.lat, pos.coords.lng)
  let mapOptions = {
    zoom: 5,
    center: {
      lat: 59.312527,
      lng: 18.061619
    },
    disableDefaultUI: true,
    draggable: true,
    gestureHandling: 'greedy',
    minZoom: 14
  };

  let nestEmptyIcon = {
    url: "src/img/bird_nest_empty_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };

  let nestBlueEggs = {
    url: "src/img/bird_nest_blue_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };

  let nestRedEggs = {
    url: "src/img/bird_nest_red_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };

  let redBirdIcon = {
    url: "src/img/red_kiwi.png",
    scaledSize: new google.maps.Size(50, 50)
  };

  let blueBirdIcon = {
    url: "src/img/blue_kiwi.png",
    scaledSize: new google.maps.Size(50, 50)
  };

  let mapDiv = document.getElementById("map");

  let snatchButton = document.getElementById("snatch_button");
  snatchButton.addEventListener("click", snatchNest);

  let map = new google.maps.Map(mapDiv, mapOptions);

  let playerLatLng,
    distanceToNest;

  fetch(url + "players/")
    .then((resp) => resp.json())
    .then(function (data) {
      let players = data;
      for (var i = 0; i < players.length; i++) {
        if (players[i].id == getCookie("nestrid")) {

          if (players[i].teamname == "Red") {
            playerIcon = redBirdIcon;
          } else if (players[i].teamname == "Blue") {
            playerIcon = blueBirdIcon;

          }

          playerMarker = new google.maps.Marker({
            icon: playerIcon,
            playerId: players[i].id,
            title: players[i].username,
            team: players[i].teamname
          });

        }
      }
      console.log(document.cookie);
      console.log(playerMarker.title);
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition);
      }
    });

  fetch(url + "nests/")
    .then((resp) => resp.json())
    .then(function (data) {

      nests = data;

      for (let i = 0; i < nests.length; i++) {

        nests[i] = {
          id: nests[i].id,
          content: nests[i].name,
          coords: {
            lat: JSON.parse(nests[i].latitude),
            lng: JSON.parse(nests[i].longitude)
          },
          inhabitedby: nests[i].inhabitedby

        }
        addMarker(nests[i]);

      }
    });


  function drawMarkersFromAPI() {
    fetch(url + "nests/").then((resp) => resp.json()).then(function (data) {

      nests = data;

      for (let i = 0; i < nests.length; i++) {

        nests[i] = {
          id: nests[i].id,
          content: nests[i].name,
          coords: {
            lat: JSON.parse(nests[i].latitude),
            lng: JSON.parse(nests[i].longitude)
          },
          inhabitedby: nests[i].inhabitedby

        }
        addMarker(nests[i]);

      }
    });
  }

  function removeNests() {
    for (let i = 0; i < nests.length; i++) {
      markers[i].setMap(null);
    }
  }

  function addMarker(nest) {
    let marker = new google.maps.Marker({
      position: nest.coords,
      map: map
    });

    markers.push(marker);

    if (nest.inhabitedby == "Red") {
      marker.setIcon(nestRedEggs);
    }
    else if (nest.inhabitedby == "Blue") {
      marker.setIcon(nestBlueEggs);
    }
    else {
      marker.setIcon(nestEmptyIcon);
    }
    // if (nest.title) {
    //   marker.setTitle(nest.title);
    // }
    if (nest.content) {
      let infoWindow = new google.maps.InfoWindow({ content: nest.content });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    }
  }

  function showPosition(position) {
    //console.log(playerMarker);
    playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    playerMarker.setPosition(playerLatLng);
    map.setCenter(playerLatLng);
    playerMarker.setMap(map);
    map.setZoom(18);
    checkNestProximity(playerLatLng);
    document.getElementById("loading-overlay").style.display = "none";
  }

  function checkNestProximity(playerLatLng) {

    for (let i = 0; i < nests.length; i++) {
      let nestLatLng = new google.maps.LatLng(nests[i].coords);
      distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, nestLatLng);
      //console.log("Distance to " + nests[i].content + " is: " + Math.ceil(distanceToNest) + " meters");
      // if (distanceToNest < 21 && hiddenButton.style.display === "none") {
      //   hiddenButton.style.display = "block";
      //   console.log("button is displayed");
      // } else {
      //   hiddenButton.style.display = "none";
      // }

      if (distanceToNest < 40 && nests[i].inhabitedby != playerMarker.team) {
        snatchButton.disabled = false;
        snatchButton.style.backgroundColor = 'green';
        snatchButton.innerHTML = `Snatch "${nests[i].content}"`;
        console.log(new Date().toLocaleString());
        snatchable = nests[i];
      }
    }
  }

  function snatchNest() {
    console.log(playerMarker.playerId);
    console.log(snatchable.id);


    fetch(url + "playertimestampnest/", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        playerid: playerMarker.playerId,
        nestid: snatchable.id,
        timestamp: dateTime
      })

    }).then(function (res) {
      if (res.status == "201") {

        removeNests();
        drawMarkersFromAPI();
        snatchButton.style.backgroundColor = 'red';
        snatchButton.disabled = true;
        snatchButton.innerHTML = ':('
        console.log(res.status);
      }

    }).catch(function (res) {
      console.log(res)
    })
  }

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

}


// När dokmentet har laddat då kör denna funktion.
$(document).ready(function () {
  console.log('');
  // När vi clickar på menu-toggle knappen.
  $('.toggle-menu').click(function () {
    toggleMenu();
  });
  //När vi trycker på en menylänk - stäng menyn.
  $('.menu a').click(function () {
    toggleMenu();
  });
  //Vår custom funktion som togglar menyn.
  let toggleMenu = function () {
    $('.menu').toggleClass('menu-open');
    let $buttonText = $(this).text();
    $buttonText == 'Open' ? $(this).text('Close') : $(this).text('Open');
  };

});
