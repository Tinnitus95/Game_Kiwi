//Global variables
const url = "https://nestr-dev-backend.herokuapp.com/api";
let mapOptions = {
  zoom: 5,
  disableDefaultUI: true,
  draggable: true,
  gestureHandling: 'greedy',
  minZoom: 14
};
let playerIcon,
  playerMarker,
  player,
  nests,
  nestMarkers = [],
  map,
  mapDiv,
  playerLatLng,
  redteamscore,
  blueteamscore,
  currentteamscore;
let dateTime = moment().format();
function startMap() {
  let myPos = navigator.geolocation.getCurrentPosition(loadGame);
}
function loadGame(myPos) {
  if (getCookie("nestrid") == "")
    window.location.href = "../loginPage/index.html";
  fetch(url + '/players/' + getCookie("nestrid"))
    .then((resp) => resp.json())
    .then(function (data) {
      player = data[0];
      fetch(url + '/nests')
        .then((resp) => resp.json())
        .then(function (data) {
          nests = data;
          fetch(url + "/currentteamscore")
            .then((resp) => resp.json())
            .then(function (data) {
              currentteamscore = data;
              mapDiv = document.getElementById("map");
              map = new google.maps.Map(mapDiv, mapOptions);
              createPlayerMarker();
              createNestMarkers();
              setTeamScore();
              playerInfo();
              console.log("Game start");
              playerLatLng = new google.maps.LatLng(myPos.coords.latitude, myPos.coords.longitude);
              map.setCenter(playerLatLng);
              map.setZoom(19);
              navigator.geolocation.watchPosition(showPosition);
              google.maps.InfoWindow.prototype.isOpen = function () {
                var map = this.getMap();
                return (map !== null && typeof map !== "undefined");
              }
            })
        });
    });
}
function drawMarkersFromAPI() {
  fetch(url + "/nests/")
    .then((resp) => resp.json())
    .then(function (data) {
      nests = data;
      createNestMarkers();
    });
}
function removeNests() {
  for (let i = 0; i < nests.length; i++) {
    nestMarkers[i].setMap(null);
  }
}
function showPosition(position) {
  document.getElementById("loading-overlay").style.display = "none";
  playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //map.setCenter(playerLatLng);
  //map.setZoom(17);
  playerMarker.setPosition(playerLatLng);
  playerMarker.setMap(map);
}
function zoomCenter() {
  map.setCenter(playerLatLng);
  map.setZoom(19);
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
function createPlayerMarker() {
  if (player.teamname == "Red") {
    playerIcon = {
      url: "src/img/red_kiwi.png"
    }
  } else if (player.teamname == "Blue") {
    playerIcon = {
      url: "src/img/blue_kiwi.png"
    }
  }
  playerIcon.scaledSize = new google.maps.Size(50, 50);
  playerMarker = new google.maps.Marker({ icon: playerIcon, playerId: player.id, title: player.username, team: player.teamname });
}
function createNestMarker(nest) {
  let nestRedEggs = {
    url: "src/img/bird_nest_red_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
  let nestEmptyIcon = {
    url: "src/img/bird_nest_empty_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
  let nestBlueEggs = {
    url: "src/img/bird_nest_blue_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
  let marker = new google.maps.Marker({
    id: nest.id,
    name: nest.name,
    position: {
      lat: JSON.parse(nest.latitude),
      lng: JSON.parse(nest.longitude)
    },
    inhabitedby: nest.inhabitedby,
    latestsnatcher: nest.latestsnatcher,
    snatchtimestamp: nest.snatchtimestamp,
    map: map
  });
  if (marker.inhabitedby == "Red") {
    marker.setIcon(nestRedEggs);
  } else if (marker.inhabitedby == "Blue") {
    marker.setIcon(nestBlueEggs);
  } else {
    marker.setIcon(nestEmptyIcon);
  }
  let infoWindow = new google.maps.InfoWindow();
  // Av någon anledning kan man bara kalla på snatchNest med marker.id och inte hela markern.
  marker.addListener('click', () => {
    if (!infoWindow.isOpen()) {
      infoWindow.open(map, marker);
      if (marker.inhabitedby != null){
        infoWindow.setContent(`
          <h3>${marker.name}</h3>
          <p>Inhabited by: ${marker.inhabitedby}</p>
          <p>Latest snatcher: ${marker.latestsnatcher}</p>
          <p>Snatch timestamp: ${ moment(marker.snatchtimestamp).subtract(1, 'hours').tz('Europe/Stockholm').format('YYYY-MM-DD HH:mm:ss') }</p>
          <p>Current distance to nest is: ${checkNestProximity(marker)} meters</p>
          <button onclick="snatchNest(${marker.id})">Snatch nest</button>
          `)
      }
      else{
        infoWindow.setContent(`
        <h3>${marker.name}</h3>
        <p>Current distance to nest is: ${checkNestProximity(marker)} meters</p>
        <button onclick="snatchNest(${marker.id})">Snatch nest</button>
        `)
      }
    }
    else {
      infoWindow.close();
    }
  });
  nestMarkers.push(marker);
}
function createNestMarkers() {
  for (let i = 0; i < nests.length; i++) {
    createNestMarker(nests[i]);
  }
}
function playerInfo() {
  let playerInfoMenu = document.getElementById("player-info-menu");
  playerInfoMenu.innerHTML = "";
  let node = document.createElement("LI");
  let textNode = document.createTextNode(playerMarker.title);
  node.appendChild(textNode);
  playerInfoMenu.appendChild(node);
  let scorenode = document.createElement("LI");
  let scoreTextNode = document.createTextNode(`Red: ${redteamscore} Blue: ${blueteamscore}`);
  scorenode.appendChild(scoreTextNode);
  playerInfoMenu.appendChild(scorenode);
}
function setTeamScore() {
  for (let i = 0; i < currentteamscore.length; i++) {
    if (currentteamscore[i].name == "Red") {
      redteamscore = currentteamscore[i].currentscore;
    } else {
      blueteamscore = currentteamscore[i].currentscore;
    }
  }
}
function checkNestProximity(marker) {
  distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, marker.position);
  console.log("Distance to " + marker.name + " is: " + Math.ceil(distanceToNest) + " meters");
  return Math.ceil(distanceToNest).toString();
}
function snatchNest(id) {
  for (let i = 0; i < nestMarkers.length; i++) {
    if (id == nestMarkers[i].id) {
      // console.log(id);
      console.log(nestMarkers[i]);
      if (distanceToNest < 40 && nestMarkers[i].inhabitedby != playerMarker.team) {
        toggleoverlay(id);
      } else if (nestMarkers[i].inhabitedby == playerMarker.team) {
        console.log("Your team already owns this nest!")
      } else {
        console.log("Get closer to this nest to snatch it!")
      }
    }
  }
}
function postNest(id) {
  fetch(url + "/playertimestampnest/", {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ playerid: playerMarker.playerId, nestid: id, timestamp: dateTime })
  })
    .then(function (res) {
      if (res.status == "201") {
        removeNests();
        drawMarkersFromAPI();
        console.log(res.status);
      }
    }).catch(function (res) {
      console.log(res)
    })
}
// När dokmentet har laddat då kör denna funktion.
$(document).ready(function () {
  //console.log('');
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
    $buttonText == 'Open'
      ? $(this).text('Close')
      : $(this).text('Open');
  };
});
