function nestrGame() {

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

    function loadGame() {
        //mapOptions.center = new google.maps.LatLng(myPos.coords.latitude, myPos.coords.longitude);
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
                                navigator.geolocation.watchPosition(showPosition);
                            })
                    });
            });
    }


    function showPosition(position) {
        document.getElementById("overlay").style.display = "none";
        playerLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        map.setCenter(playerLatLng);
        map.setZoom(17);
        playerMarker.setPosition(playerLatLng);
        playerMarker.setMap(map);
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
        }
        else if (player.teamname == "Blue") {
            playerIcon = {
                url: "src/img/blue_kiwi.png"
            }
        }

        playerIcon.scaledSize = new google.maps.Size(50, 50);

        playerMarker = new google.maps.Marker({
            icon: playerIcon,
            playerId: player.id,
            title: player.username,
            team: player.teamname
        });
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
            map: map
        });
        if (marker.inhabitedby == "Red") {
            marker.setIcon(nestRedEggs);
        }
        else if (marker.inhabitedby == "Blue") {
            marker.setIcon(nestBlueEggs);
        }
        else {
            marker.setIcon(nestEmptyIcon);
        }

        let infoWindow = new google.maps.InfoWindow({
            content: `
            <h3>${marker.name}</h3>
            <button onclick="snatchNest('${marker.name}')">Snatch nest</button>
            ` 
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);

            infoWindow.setContent(`
            <h3>${marker.name}</h3>
            <button onclick="snatchNest(${marker.my_id}, ${player.id})">Snatch nest</button>
            `)
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
            }
            else {
                blueteamscore = currentteamscore[i].currentscore;
            }
        }
    }

    function checkNestProximity(marker) {
        /* let nestLatLng = new google.maps.LatLng({
            lat: JSON.parse(marker.position.lat),
            lng: JSON.parse(marker.position.lng)
        }); */
        distanceToNest = google.maps.geometry.spherical.computeDistanceBetween(playerLatLng, marker.position);
        console.log("Distance to " + marker.name + " is: " + Math.ceil(distanceToNest) + " meters");
        return Math.ceil(distanceToNest).toString();
    }

    loadGame();
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
        $buttonText == 'Open' ? $(this).text('Close') : $(this).text('Open');
    };

});
