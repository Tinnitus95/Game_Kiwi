//Global variables
const url = "https://nestr-dev-backend.herokuapp.com/api";


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
  currentteamscore,
  nestRedEggs,
  nestEmptyIcon,
  nestBlueEggs,
  myLatestTimeStamp;

function startMap() {
  let myPos = navigator.geolocation.getCurrentPosition(loadGame);
}

function loadGame(myPos) {
  if (getCookie("nestrid") == "")
    window.location.href = "../loginPage/index.html";
  fetch(url + '/playertimestampnests/latest')
    .then((resp) => resp.json())
    .then(function (data) {
      myLatestTimeStamp = formatTimeStampSubtractOne(data[0].timestamp);
      //console.log(myLatestTimeStamp);
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
                  createNestIcons();
                  createPlayerMarker();
                  createNestMarkers();
                  setTeamScore();
                  setTotalScore();
                  playerInfo();
                  console.log("Game start");
                  playerLatLng = new google.maps.LatLng(myPos.coords.latitude, myPos.coords.longitude);
                  map.setCenter(playerLatLng);
                  map.setZoom(18);
                  navigator.geolocation.watchPosition(showPosition);
                  google.maps.InfoWindow.prototype.isOpen = function () {
                    var map = this.getMap();
                    return (map !== null && typeof map !== "undefined");
                  }
                })
            });
        });
    });
  setInterval(() => checklatestTimeStamp(), 3000);
}

function drawMarkersFromAPI() {
  //console.log(nestMarkers);
  fetch(url + "/nests/")
    .then((resp) => resp.json())
    .then(function (data) {
      nests = data;
      createNestMarkers();
    });
}

function removeNests() {
  if (nestMarkers.length != 0) {
    for (let i = 0; i < nests.length; i++) {
      nestMarkers[i].setMap(null);
    }
    nestMarkers.length = 0;
  }
}

function showPosition(position) {
  document.getElementById("loading-overlay").style.display = "none";
  playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  //map.setCenter(playerLatLng);
  //map.setZoom(17);
  playerMarker.setPosition(playerLatLng);
  playerMarker.setMap(map);
  checklatestTimeStamp();
}

function zoomCenter() {
  map.setCenter(playerLatLng);
  map.setZoom(18);
}

function logOut() {
  document.cookie = "nestrid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/";
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
  playerMarker = new google.maps.Marker({ icon: playerIcon, playerId: player.id, title: player.username, team: player.teamname, score: player.totalneststaken });
}

function createNestIcons() {
  nestRedEggs = {
    url: "src/img/bird_nest_red_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
  nestEmptyIcon = {
    url: "src/img/bird_nest_empty_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
  nestBlueEggs = {
    url: "src/img/bird_nest_blue_new.png",
    scaledSize: new google.maps.Size(50, 50)
  };
}

function createNestMarker(nest) {
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

  marker.addListener('click', () => {
    //All nests have this content
    let infoWindowContent = `
      <h3>${marker.name}</h3>
      <p>Current distance to nest is: ${checkNestProximity(marker)} meters</p>
      `
    //If the window is closed
    if (!infoWindow.isOpen()) {
      infoWindow.open(map, marker);
      //If the nest is inhabited
      if (marker.inhabitedby != null) {
        infoWindowContent += `
          <p>Inhabited by: ${marker.inhabitedby}</p>
          <p>Latest snatcher: ${marker.latestsnatcher}</p>
          <p>Snatch timestamp: ${formatTimeStampSubtractOne(marker.snatchtimestamp)}</p>
          `
        //Is the nest locked for snatching
        if (isNestLocked(marker.snatchtimestamp)) {
          infoWindowContent += `
          <p id="nest-lock-message">Snatch lock currently engaged!<p>
          `
        }
        //If the player is close enough to snatch it
        else if (isNestSnatchable(marker) && !isNestLocked(marker.snatchtimestamp)) {
          infoWindowContent += `
            <button onclick="snatchNest(${marker.id})">Snatch nest</button>
            `
        }
      }
      //If the nest is not inhabited but you are close enough to snatch it
      else if (isNestSnatchable(marker)) {
        infoWindowContent += `
          <button onclick="snatchNest(${marker.id})">Snatch nest</button>
          `
      }
      //Write the content to the infowindow
      infoWindow.setContent(infoWindowContent);
    }
    //If the window is open then close it
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

  //Create a LI that holds the player Title
  let titlenode = document.createElement("LI");
  let titleTextNode = document.createTextNode(`Welcome, ${playerMarker.title}!`);
  titlenode.appendChild(titleTextNode);
  playerInfoMenu.appendChild(titlenode);

  let playerscorenode = document.createElement("LI");
  let playerscoreTextNode = document.createTextNode(`Total Snatches: ${player.totalneststaken}`);
  playerscorenode.appendChild(playerscoreTextNode);
  playerInfoMenu.appendChild(playerscorenode)

  //Create a LI that holds the global team score
  let teamscorenode = document.createElement("LI");
  let teamscoreTextNode = document.createTextNode(`Red: ${redteamscore} Blue: ${blueteamscore}`);
  teamscorenode.appendChild(teamscoreTextNode);
  playerInfoMenu.appendChild(teamscorenode);

  //Create a LI that acts as a logout button
  let logoutnode = document.createElement("LI");
  let logoutTextNode = document.createTextNode("Logout");
  logoutnode.appendChild(logoutTextNode);
  playerInfoMenu.appendChild(logoutnode);
  logoutnode.addEventListener('click', logOut);
  logoutnode.style.color = "red";
  logoutnode.style.cursor = "pointer";


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

function setTotalScore() {
  if (player.totalneststaken === null) {
    player.totalneststaken = "0";
  }
}

function checkNestProximity(marker) {
  distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, marker.position);
  //console.log("Distance to " + marker.name + " is: " + Math.ceil(distanceToNest) + " meters");
  return Math.ceil(distanceToNest).toString();
}

function snatchNest(id) {
  let nestColor = document.getElementById('taplistener');
  for (let i = 0; i < nestMarkers.length; i++) {
    if (id == nestMarkers[i].id) {

      if (nestMarkers[i].inhabitedby != null) {

        if (distanceToNest < 40 && nestMarkers[i].inhabitedby != playerMarker.team) {
          if (nestMarkers[i].inhabitedby === "Blue") {
            //console.log("blue")
            nestColor.classList.add("blueNestImage");
          }
          else if (nestMarkers[i].inhabitedby === "Red") {
            //console.log("red")
            nestColor.classList.add("redNestImage");
          }


          toggleoverlay(id);
        } else if (nestMarkers[i].inhabitedby == playerMarker.team) {
          console.log("Your team already owns this nest!")
        } else {
          console.log("Get closer to this nest to snatch it!")
        }
      } else {
        postNest(id);
      }

    }
  }
}

function postNest(id) {
  myLatestTimeStamp = formatTimeStamp(moment().format());
  fetch(url + "/playertimestampnests/", {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ playerid: playerMarker.playerId, nestid: id, timestamp: myLatestTimeStamp })
  })
    .then(function (res) {
      if (res.status == "201") {
        removeNests();
        drawMarkersFromAPI();
        currentTeamScoreFromAPI();
        setTotalPlayerScoreFromAPI();
        //console.log(res.status);
      }
    }).catch(function (res) {
      console.log(res)
    })
}

function isNestSnatchable(marker) {
  if (checkNestProximity(marker) < 40 && marker.inhabitedby != playerMarker.team) {
    return true;
  } else {
    return false;
  }
}

function currentTeamScoreFromAPI() {
  fetch(url + "/currentteamscore")
    .then((resp) => resp.json())
    .then(function (data) {
      currentteamscore = data;
      setTeamScore();
      playerInfo();
    });
}

function setTotalPlayerScoreFromAPI() {
  fetch(url + '/players/' + getCookie("nestrid"))
    .then((resp) => resp.json())
    .then(function (data) {
      player = data[0];
      setTotalScore();
      playerInfo();
    });
}

function checklatestTimeStamp() {
  fetch(url + "/playertimestampnests/latest")
    .then((resp) => resp.json())
    .then(function (data) {
      apiLatestTimeStamp = formatTimeStampSubtractOne(data[0].timestamp);
      //console.log(`My timestamp: ${myLatestTimeStamp} Database timestamp: ${apiLatestTimeStamp}`);
      if (apiLatestTimeStamp !== myLatestTimeStamp) {
        console.log("Updates availiable in DB");
        removeNests();
        drawMarkersFromAPI();
        currentTeamScoreFromAPI();
        myLatestTimeStamp = apiLatestTimeStamp;
      } else {
        //console.log("No updates availiable");
      }
    });
}

function BGrandomiser() {

  let element = document.getElementById('game-overlay');
  let x = Math.floor((Math.random() * 10) + 6);

  switch (x) {

    case 6:
      document.getElementById('game-overlay').style.backgroundImage = 'url(src/img/street_background_cobblestone.jpg)';
      break;
    case 7:
      document.getElementById('game-overlay').style.backgroundImage = 'url(src/img/street_background.jpg)';
      break;
    case 8:
      document.getElementById('game-overlay').style.backgroundImage = 'url(src/img/streetart_background.jpg)';
      break;
    case 9:
      document.getElementById('game-overlay').style.backgroundImage = 'url(src/img/subway_background.jpg)';
      break;
    default:
      document.getElementById('game-overlay').style.backgroundImage = 'url(src/img/green_grass.jpeg)';

  }
}

// Format a timestamp
function formatTimeStamp(timestamp) {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}

// Format a timestamp and subtract 1 hour
function formatTimeStampSubtractOne(timestamp) {
  return moment(timestamp).subtract(1, 'hours').format('YYYY-MM-DD HH:mm:ss');
}

function isNestLocked(timestamp) {
  let lockedUntil = formatTimeStampSubtractOne(moment(timestamp).add(30, 'seconds'));
  let now = moment().format();
  console.log(now + " " + moment(lockedUntil).format());
  if (moment(now).isAfter(lockedUntil)) {
    return false;
  } else {
    return true;
  }
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
