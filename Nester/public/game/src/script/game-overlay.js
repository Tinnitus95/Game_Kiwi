let counter = 20;
const x = document.getElementById("game-overlay");
const taplisten = document.getElementById('taplistener');



function toggleoverlay() {
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}



taplisten.addEventListener("click", function(){
  counter--;
  document.getElementById('counter').innerHTML = counter;
  if(counter == 0){
    x.style.display = "none";
    counter = 20;
  }
})
