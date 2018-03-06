//get the elements
const x = document.getElementById("game-overlay");
const taplisten = document.getElementById('taplistener');

function toggleoverlay(id) {
    BGrandomiser();
    let counter = 20;
    x.style.display = "block";
    //add an eventlistener to the taplisten element
    taplisten.addEventListener("click", function clicked() {
        counter--;
        document.getElementById('counter').innerHTML = counter;
        if (counter === 0) {
            x.style.display = "none";
            counter = 20;
            document.getElementById('counter').innerHTML = counter;
            postNest(id);
            //remove the eventlistener when it succeeds
            taplisten.removeEventListener("click", clicked, false);

        }

    }, false)

}
