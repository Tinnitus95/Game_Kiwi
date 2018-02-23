const url = "https://nestr-dev-backend.herokuapp.com/api/players/";

function loginscript() {

  let player = {
    id: "",
    username: document.getElementById("login-username").value,
    password: document.getElementById("login-password").value
  }

  fetch(url).then((resp) => resp.json()).then(function(data) {

    let players = data;

    for (var i = 0; i < players.length; i++) {
      if ((players[i].username === player.username) && (players[i].password === player.password)) {
        document.cookie = "nestrid=" + players[i].id + "; path=/;";

        window.location.href = "../game/index.html";
        player.id = players[i].id;

        console.log(document.cookie);
      }
      
    }

  })
};
