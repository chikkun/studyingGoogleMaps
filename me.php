<?php
$marks = array();
function nobody()
{

    $marks[] = array("lat" => '35.506312',
            "long" => '139.471393',
            "name" => '知久');
    $marks[] = array("lat" => '35.527506',
            "long" => '139.454253',
            "name" => '伝法谷');
    $marks[] = array("lat" => '35.53501',
            "long" => '139.422601',
            "name" => '浜田');

    $js = <<<EOF
   <script type="text/javascript">
function initialize() {
    //地図を表示
    var latMin = 35.506312;
    var latMax = 35.535027;
    var lngMin = 139.422748;
    var lngMax = 139.471393;
    
    var latc = (latMin + latMax)/2;
    var lngc =  (lngMin + lngMax)/2;
    var latlng = new google.maps.LatLng(latMin, lngMax);
    var mapOpts = {
	zoom: 18,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map_canvas");
    var map = new google.maps.Map(mapDiv, mapOpts);
EOF;
    
        $no = 0;
        foreach ($marks as $m) {
            $no++;
            $lat = $m['lat'];
            $long = $m['long'];
            $name = $m['name'];

            $js .= <<<EOF
    //マーカーを作成
    var m$no = createMarker(
	map,
	new google.maps.LatLng($lat, $long),
	"<strong>$name</strong>"
    );
    map.setCenter(new google.maps.LatLng(latc, lngc));

EOF;
}
$js .= <<<EOF
    map.fitBounds(new google.maps.LatLngBounds(
	//bottom left
	new google.maps.LatLng(latMin, lngMin),
	//top right
	new google.maps.LatLng(latMax, lngMax)));
}

window.onload = initialize;
   </script>
EOF;
    return $js;
}

$overlayStyleS = '<div style="background-color: #00FF00; width:60px; font-size: 50%;height: 15px; text-align:center">';
$overlayStyleE = '</div>';
//$overlayStyleS = '<div>';
$tmp = "";
$lats = array();
$longs = array();
$overlay = "";
$js = "";
if (empty($_POST['marks']) || empty($_POST['puku']) || $_POST['puku'] != '19591112') {
    $js = nobody();
} else {
    foreach ($_POST['marks'] as $mark) {
        $data = preg_split('/\|/', $mark);
        $tmp .= $mark;
        if (empty($data) || empty($data[0]) || empty($data[1]) || empty($data[2])) {
            continue;
        }
        if (!is_numeric($data[0]) || !is_numeric($data[1])) {
            continue;
        }

        $name = $data[2];
        $name = mb_ereg_replace("　+$", "", $name);
        $marks[] = array("lat" => $data[0],
            "long" => $data[1],
            "name" => $name);
        $lats[] = $data[0] + 0;
        $longs[] = $data[1] + 0;
    }
    if (count($lats) == 0) {
        $js = nobody();
    } else {
        if (count($lats) > 1) {
            $latMax = max($lats);
            $latMin = min($lats);
            $longMax = max($longs);
            $longMin = min($longs);
            $latCenter = ($latMax + $latMin) / 2;
            $longCenter = ($longMax + $longMin) / 2;
        } elseif (count($lats) == 1) {
            $latMax = $lats[0];
            $latMin = $lats[0];
            $longMax = $longs[0];
            $longMin = $longs[0];
            $latCenter = $lats[0];
            $longCenter = $longs[0];
        }

        $js = <<<EOF
    <script type="text/javascript">
function initialize() {
    //地図を表示
    var latMin = $latMin;
    var latMax = $latMax;
    var lngMin = $longMin;
    var lngMax = $longMax;
    
    var latc = (latMin + latMax)/2;
    var lngc =  (lngMin + lngMax)/2;
    var latlng = new google.maps.LatLng(latMin, lngMax);
    var mapOpts = {
	zoom: 18,
	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map_canvas");
    var map = new google.maps.Map(mapDiv, mapOpts);
EOF;
    
        $no = 0;
        foreach ($marks as $m) {
            $no++;
            $lat = $m['lat'];
            $long = $m['long'];
            $name = $m['name'];

            $js .= <<<EOF
    //マーカーを作成
    var m$no = createMarker(
	map,
	new google.maps.LatLng($lat, $long),
	"<strong>$name</strong>"
    );
    map.setCenter(new google.maps.LatLng(latc, lngc));

EOF;
}
$js .= <<<EOF
    map.fitBounds(new google.maps.LatLngBounds(
	//bottom left
	new google.maps.LatLng(latMin, lngMin),
	//top right
	new google.maps.LatLng(latMax, lngMax)));
}

window.onload = initialize;
</script>

EOF;
  }
}
?>
<!DOCTYPE HTML"> 
<html lang="ja">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" type="text/css" href="css/style.css" />
      <script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?sensor=false&v=3"></script>
    <script type="text/javascript" src="js/gmap.js"></script>

    <style>
        body {
            text-align: center;
        }

        .gmap3 {
            width: 800px;
            height: 500px;
        }
    </style>

    <?php echo $js ?>

</head>
<body>
    <div id="map_canvas"></div>

</body>
</html>
