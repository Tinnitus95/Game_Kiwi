<html>
 <head>
  <title>PHP Test</title>
  <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
  <script src="teamLeaderboard.js" type="text/javascript"></script>
  <script src="playerLeaderboard.js" type="text/javascript"></script>
  <script src= "https://cdn.zingchart.com/zingchart.min.js"></script>
		<script> zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
		ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9","ee6b7db5b51705a13dc2339db3edaf6d"];</script>
  <style>
        @import 'https://fonts.googleapis.com/css?family=Montserrat';
        @import 'https://fonts.googleapis.com/css?family=Lato:400';
        
        #myChart{
            display: none;
        }
        #myChart a {
         display: none;
         touch-action: none;
        }
        
        .zc-ref {
        display: none;
        touch-action: none;
        }

        #myList {
            height: 499px;
            width: 99%;
            background:black;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
        }
        .myListPlayers {
            height: 40px;
            width: 400px;
            background: white;
            display: grid;
            grid-template-columns: 15% 40px auto 50px 15%;
            grid-template-rows: 40px;
        }
        .team-image {
            background-image: url("blue_kiwi.png");
            background-size: 40px 40px;
            grid-column: 2;
        }
        .user-name, .nests-text, .nests-value{
            margin: 0;
            padding: 0 0 0 20px;
            vertical-align: center;
            line-height: 40px;
            font-family: 'Open Sans', sans-serif;
            font-weight: bold;
        }
        .nests-text, .nests-value {
            padding: 0;
        }
  </style>
 </head>
 <body>
    <div id='myChart'><a class="zc-ref" href="https://www.zingchart.com/">Powered by ZingChart</a></div>
    <div id='myList'>
        <div class='myListPlayers' id="nr1">
            <div class='team-image'></div>
            <p class="user-name">OnlyRay</p>
            <p class="nests-text">nests: </p>
            <p class="nests-value">78</p>
        </div>
        <div class='myListPlayers' id="nr2">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr3">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr4">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr5">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr6">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr7">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr8">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr9">
            <div class='team-image'></div>
        </div>
        <div class='myListPlayers' id="nr10">
            <div class='team-image'></div>
        </div>
    </div>
    <form>
        Select Leaderboard
        <select id="feed_url" name="feed_url">
            <option value="https://nestr-dev-backend.herokuapp.com/api/topplayers/">Top Players</option>
            <option value="https://nestr-dev-backend.herokuapp.com/api/currentteamscore/">Current Team Score</option>
        </select>
        <input type="submit" value="Read"/>
    </form>

    <?php 
        if(isset($_REQUEST['feed_url'])){
            require './vendor/autoload.php';

            $myClient = new GuzzleHttp\Client([
                'headers' => ['User-Agent']
            ]);

            $feed_response = $myClient->request('GET', $_REQUEST['feed_url']);
            if($feed_response->getStatusCode() == '200'){
                if($feed_response->hasHeader('content-length')){
                    $contentLength = $feed_response->getHeader('content-length')[0];
                    //echo "<p> Downloaded $contentLength bytes of data. </p>";
                }
                $data = (string)$feed_response->getBody();

                $response = json_decode($data, true);
                //$xml = new SimpleXMLElement($body);

                $array = count($response);
                //fetching top players
                if($_REQUEST['feed_url'] == 'https://nestr-dev-backend.herokuapp.com/api/topplayers/'){
                    for($i=0; $i<$array; $i++){
                        $name =$response[$i]['username'];
                        $nests =$response[$i]['totalneststaken'];
                        $team =$response[$i]['team'];
                        echo '<script type="text/javascript">scripten('."\"$name\",$nests,\"$team\"".');</script>';
                    }
                    echo '<script type="text/javascript">printTopPlayers();</script>';
                }

                //fetching teams
                elseif($_REQUEST['feed_url'] == 'https://nestr-dev-backend.herokuapp.com/api/currentteamscore/'){
                    $red;
                    $blue;
                    for($i=0; $i < $array; $i++){
                        if($response[$i]['name'] == 'Red')
                            $red = $response[$i]['currentscore'];
                        elseif($response[$i]['name'] == 'Blue')
                            $blue = $response[$i]['currentscore'];
                    }
                    //echo $red;
                    //echo $blue;
                    echo '<script type="text/javascript">getTeams('."$red,$blue".');</script>';
                    //echo print_r($data);
                }
                else{
                    echo "COULD NOT FIND REQUESTED API";
                }
            }
        }
    ?>
    
    
 </body>
</html>