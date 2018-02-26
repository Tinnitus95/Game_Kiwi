let players = [];

function scripten(name, nests, team){
    document.getElementById("myChart").style.display = "none";
    //document.getElementById("feed_url").value = "https://nestr-dev-backend.herokuapp.com/api/topplayers/";
    
    //et p = JSON.parse(player);
    let player = {
        pName: name,
        pNests: nests,
        pTeam: team
    }

    players.push(player);

    console.log("Nr: "+players.length+" "+name + " took "+nests+" for the "+team+" team.\n");
}

function printTopPlayers(){
    for(let i=0; i<10; i++){
        if(players[i].pTeam == "Blue"){
            //let newDiv = document.createElement("div");
            console.log("BLUE");
        }
    }
}