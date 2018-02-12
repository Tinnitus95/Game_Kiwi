function registerscript() {
  let message = document.getElementById("creation_message");
  let username = document.getElementById("register-username").value;
  let password = document.getElementById("register-password").value;
  let email = document.getElementById("register-email").value;
  let team = document.getElementById("register-team").value;

  fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      username: username,
      password: password,
      email: email,
      teamid: team
    })

  }).then(function(res) {
      if(res.status == "201"){


      message.innerHTML = `Account with username: ${username} successfully created!`;
      console.log(res.status);

    }
    else{
      message.innerHTML= `Sumting wong`;
      console.log(res.status);
    }
  }).catch(function(res) {
    console.log(res)
  })
}
