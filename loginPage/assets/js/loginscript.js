function loginscript() {

  let player = {
    id : "" ,
    username: document.getElementById("form-username").value,
    password: document.getElementById("form-password").value,


  }

  alert(player.username);

  const url = "https://nestr-dev-backend.herokuapp.com/api/players/";

  fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {

    let players = data;

    for (var i = 0; i < players.length; i++) {
      if((players[i].username === player.username) && (players[i].password === player.password)){

        player.id = players[i].id;

        console.log(player);
      }


    }

  })
};
