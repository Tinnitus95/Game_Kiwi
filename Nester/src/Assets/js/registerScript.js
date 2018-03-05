export function registerscript(){

  let player = {

    username: document.getElementById("form-user-name").value,
    password: document.getElementById("form-pass-word").value,
    team: document.getElementById("team-select").value
  }

  console.log(player);
}
