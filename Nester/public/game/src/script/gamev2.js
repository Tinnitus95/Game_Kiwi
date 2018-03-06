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
    redteamscore = 0,
    blueteamscore = 0,
    currentteamscore,
    totalfreenests = 0,
    nestRedEggs,
    nestEmptyIcon,
    nestBlueEggs,
    myLatestTimeStamp,
    toggleMenuOpen = false;

function startMap() {
    let myPos = navigator.geolocation.getCurrentPosition(loadGame);
}
// Loading game
function loadGame(myPos) {
    //checks if the cookie is empty and redirects to the loginpage if that is the case
    if (getCookie("nestrid") == "")
        window.location.href = "../loginPage/index.html";
    fetch(url + '/playertimestampnests/latest')
        .then((resp) => resp.json())
        .then(function(data) {
            // If the are no snatches in the DB set myLatestTimeStamp to now
            if (data.length == 0) {
                myLatestTimeStamp = moment().format();
            } else {
                myLatestTimeStamp = formatTimeStampSubtractOne(data[0].timestamp);
            }
            //we make all of our initial fetches using .then, this will ensure we have all the information from the database before starting the game
            fetch(url + '/players/' + getCookie("nestrid"))
                .then((resp) => resp.json())
                .then(function(data) {
                    player = data[0];
                    fetch(url + '/nests')
                        .then((resp) => resp.json())
                        .then(function(data) {
                            nests = data;
                            fetch(url + "/currentteamscore")
                                .then((resp) => resp.json())
                                .then(function(data) {
                                    currentteamscore = data;
                                    mapDiv = document.getElementById("map");
                                    map = new google.maps.Map(mapDiv, mapOptions);
                                    createNestIcons();
                                    createPlayerMarker();
                                    createNestMarkers();
                                    setTeamScore();
                                    setTotalScore();
                                    setTotalNeutralNests()
                                    playerInfo();
                                    console.log("Game start");
                                    playerLatLng = new google.maps.LatLng(myPos.coords.latitude, myPos.coords.longitude);
                                    map.setCenter(playerLatLng);
                                    map.setZoom(18);
                                    navigator.geolocation.watchPosition(showPosition);
                                    google.maps.InfoWindow.prototype.isOpen = function() {
                                        var map = this.getMap();
                                        return (map !== null && typeof map !== "undefined");
                                    }
                                })
                        });
                });
        });
    setInterval(() => checklatestTimeStamp(), 3000);
}

//This function is used to redraw the markers
function drawMarkersFromAPI() {

    fetch(url + "/nests/")
        .then((resp) => resp.json())
        .then(function(data) {
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
//when the position is found the loading overlay will be hidden
function showPosition(position) {
    document.getElementById("loading-overlay").style.display = "none";
    playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //map.setCenter(playerLatLng);
    //map.setZoom(17);
    playerMarker.setPosition(playerLatLng);
    playerMarker.setMap(map);
    checklatestTimeStamp();
}
//function to center the viewport over the player
function zoomCenter() {
    map.setCenter(playerLatLng);
    map.setZoom(18);
}
//delete the cookie and return to the home screen
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
//Sets the information of the player
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
    playerMarker = new google.maps.Marker({
        icon: playerIcon,
        playerId: player.id,
        title: player.username,
        team: player.teamname,
        score: player.totalneststaken
    });
}
//creates the styles of the nests
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
    //sets the picture of the isNestSnatchable
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
      <h3>- ${marker.name} -</h3>
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
                //If the nest locked for snatching
                if (isNestLocked(marker.snatchtimestamp)) {
                    infoWindowContent += `
          <p id="nest-lock-message">Nest-lock engaged!<p>
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

//Creates the content of the game menu
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

    let neutralnestsnode = document.createElement("LI");
    let neutralnestsTextNode = document.createTextNode(`Empty Nests: ${totalfreenests}`);
    neutralnestsnode.appendChild(neutralnestsTextNode);
    playerInfoMenu.appendChild(neutralnestsnode);

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

function setTotalNeutralNests() {
    //calculates total neutral nests
    totalfreenests = 0;
    for (let i = 0; i < nests.length; i++) {
        if (nests[i].inhabitedby === null) {
            totalfreenests++;
        }
    }
}

//Prevents the display of null
function setTotalScore() {
    if (player.totalneststaken === null) {
        player.totalneststaken = "0";
    }
}

function checkNestProximity(marker) {
    distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, marker.position);

    return Math.ceil(distanceToNest).toString();
}

function snatchNest(id) {
    //Trigger the game overlay and change
    let nestColor = document.getElementById('taplistener');
    for (let i = 0; i < nestMarkers.length; i++) {
        if (id == nestMarkers[i].id) {

            if (nestMarkers[i].inhabitedby != null) {

                if (distanceToNest < 40 && nestMarkers[i].inhabitedby != playerMarker.team) {
                    if (nestMarkers[i].inhabitedby === "Blue") {

                        nestColor.classList.add("blueNestImage");
                        toggleoverlay(id);
                    } else if (nestMarkers[i].inhabitedby === "Red") {

                        nestColor.classList.add("redNestImage");
                        toggleoverlay(id);
                    }
                }
            } else {
                postNest(id);
            }

        }
    }
}
// sends the information of the captured nest to the DB
function postNest(id) {
    myLatestTimeStamp = formatTimeStamp(moment().format());
    fetch(url + "/playertimestampnests/", {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                playerid: playerMarker.playerId,
                nestid: id,
                timestamp: myLatestTimeStamp
            })
        })
        .then(function(res) {
            //trigger a redraw if nest was succesfully captured
            if (res.status == "201") {
                removeNests();
                drawMarkersFromAPI();
                currentTeamScoreFromAPI();
                setTotalPlayerScoreFromAPI();
                setTotalNeutralNestsFromAPI();
            }
        }).catch(function(res) {
            console.log(res)
        })
}

//checks distance between player and nest, also checks if player and nest is not on the same team
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
        .then(function(data) {
            currentteamscore = data;
            setTeamScore();
            playerInfo();
        });
}

function setTotalPlayerScoreFromAPI() {
    fetch(url + '/players/' + getCookie("nestrid"))
        .then((resp) => resp.json())
        .then(function(data) {
            player = data[0];
            setTotalScore();
            playerInfo();
        });
}

function setTotalNeutralNestsFromAPI() {
    fetch(url + '/nests')
        .then((resp) => resp.json())
        .then(function(data) {
            nests = data;
            setTotalNeutralNests();
            playerInfo();
        });
}

function checklatestTimeStamp() {
    fetch(url + "/playertimestampnests/latest")
        .then((resp) => resp.json())
        .then(function(data) {
            // If the are no snatches in the DB set apiLatestTimeStamp to myLatestTimeStamp
            if (data.length == 0) {
                apiLatestTimeStamp = myLatestTimeStamp;
            } else {
                apiLatestTimeStamp = formatTimeStampSubtractOne(data[0].timestamp);
            }

            if (apiLatestTimeStamp !== myLatestTimeStamp) {
                console.log("Updates available in DB");
                removeNests();
                drawMarkersFromAPI();
                currentTeamScoreFromAPI();
                myLatestTimeStamp = apiLatestTimeStamp;
            }
        });
}
// Set game overlay backgroundImage randomly
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
    if (moment(now).isAfter(lockedUntil)) {
        return false;
    } else {
        return true;
    }
}

// När dokmentet har laddat då kör denna funktion.
$(document).ready(function() {

    // När vi clickar på menu-toggle knappen.
    $('.toggle-menu').click(function() {
        toggleMenu();
    });
    //När vi trycker på en menylänk - stäng menyn.
    $('.menu a').click(function() {
        toggleMenu();
    });
    //Vår custom funktion som togglar menyn.
    let toggleMenu = function() {
        // Set toggleMenuOpen to its oppisite
        toggleMenuOpen = !toggleMenuOpen;
        $('.menu').toggleClass('menu-open');
        // If the menu is open set the nav to z-index 1
        if (toggleMenuOpen) {
            $('nav').css('z-index', 1);
        }
        // If the menu is closed set the nav to z-index 0
        else {
            // Wait 100 ms for the animation to finish
            setTimeout(() => {
                $('nav').css('z-index', 0);
            }, 200);
        }
    };
});
