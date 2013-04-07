# me.php and gmap.js -- Show some markers and custom infoWindows for Google Maps in Post Request

## Install

Apache and PHP are required.

##Usage

Call me.php with Post data 'marks' like below.

    $marks[] = array("lat" => '35.506312',
            "long" => '139.471393',
            "name" => 'someone');
    $marks[] = array("lat" => '35.527506',
            "long" => '139.454253',
            "name" => 'another');
    $marks[] = array("lat" => '35.53501',
            "long" => '139.422601',
            "name" => 'nobody');
