const x = document.getElementById("game-overlay");
const taplisten = document.getElementById('taplistener');



function toggleoverlay(id) {   
  BGrandomiser();
  let counter = 20;
  x.style.display = "block";
  taplisten.addEventListener("click", function(){
    counter--;
    document.getElementById('counter').innerHTML = counter;
    if(counter == 0){
      x.style.display = "none";
      counter = 20;
      document.getElementById('counter').innerHTML = counter;
      postNest(id);
    }
  })

}
