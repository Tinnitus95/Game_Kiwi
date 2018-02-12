<html>
 <head>
  <title>PHP Test</title>
  <script src="teamLeaderboard.js" type="text/javascript"></script>
  <script src="leaderboard.js" type="text/javascript"></script>
  <script src= "https://cdn.zingchart.com/zingchart.min.js"></script>
  <script> zingchart.MODULESDIR = "https://cdn.zingchart.com/modules/";
		ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9","ee6b7db5b51705a13dc2339db3edaf6d"];</script>
  <style>
    .zc-ref { display: none; }
    </style>
 </head>
 <body>
 <div id='myChart'><a class="zc-ref" href="https://www.zingchart.com/">
    Charts by ZingChart</a>
 </div>
    <form>
        Select Leaderboard
        <select name="feed_url">
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
                    echo "<p> Downloaded $contentLength bytes of data. </p>";
                }
                $data = (string)$feed_response->getBody();

                $response = json_decode($data, true);
                //$xml = new SimpleXMLElement($body);

                $array = count($response);

                //fetching top players
                if($_REQUEST['feed_url'] == 'https://nestr-dev-backend.herokuapp.com/api/topplayers/'){
                    for($i=0; $i < $array; $i++){
                        $name = $response[$i]['username'];
                        //echo $response[$i]['username'] . "\n";
                        echo $name;
                        echo '<script type="text/javascript">script("'.$name.'");</script>';
                    }
                    echo print_r($data);
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
                    echo $red;
                    echo $blue;
                    echo '<script type="text/javascript">getTeams('."$red,$blue".');</script>';
                    echo print_r($data);
                }
                else{
                    echo "COULD NOT FIND REQUESTED API";
                }
            }
        }
    ?>
 </body>
</html>