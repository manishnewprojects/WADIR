<?php
 
function lookup($string){
 
  $string = str_replace (" ", "+", urlencode($string));


   $details_url = "https://maps.googleapis.com/maps/api/geocode/json?address=".$string."&key=AIzaSyAWyCb1Xq7gDRWSWRnOAVF3VsBz9TQW-og&sensor=false";
 
   $ch = curl_init();
   curl_setopt($ch, CURLOPT_URL, $details_url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   $response = json_decode(curl_exec($ch), true);
 
    // error logging block - leave here for use in other places - mv 10/17/17
    //error_log("GOGL RESULT", 3, '/var/tmp/errors.log');
    //error_log(print_r($response, TRUE), 3, '/var/tmp/errors.log');
    //error_log("GOGL RESULT", 3, '/var/tmp/errors.log');


// If Status Code is ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED or INVALID_REQUEST
   if ($response['status'] != 'OK') {
    $latitude = -76;
    $longitude = -148;
    $array = array(
        'latitude' => $latitude,
        'longitude' => $longitude,
        'location_type' => 0,
    );

    return $array;
   }
 
  $geometry = $response['results'][0]['geometry'];
 
  $latitude = $geometry['location']['lat'];
  $longitude = $geometry['location']['lng'];


 
    $array = array(
        'latitude' => $geometry['location']['lng'],
        'longitude' => $geometry['location']['lat'],
        'location_type' => $geometry['location_type'],
    );
 
    return $array;
 
}
 
?>