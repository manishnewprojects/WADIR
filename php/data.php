<?php

include dirname(__FILE__)."/../php_includes/addr_lookup.php";


// Database details
$db_server   = 'localhost';
$db_username = 'root';
$db_password = '*********';
$db_name     = 'w411_listings_database';

// Get job (and id)
$job = '';
$id  = '';


if (isset($_GET['job'])){
  $job = $_GET['job'];
  if ($job == 'get_companies' ||
      $job == 'get_companies_edit' ||
      $job == 'get_company'   ||
      $job == 'add_company'   ||
      $job == 'edit_company'  ||
      $job == 'delete_company'){
    if (isset($_GET['id'])){
      $id = $_GET['id'];
      if (!is_numeric($id)){
        $id = '';
      }
    }
  } else {
    $job = '';
  }
}

// Prepare array
$mysql_data = array();

 

// Valid job found
if ($job != ''){

 // Connect to database
  $db_connection = mysqli_connect($db_server, $db_username, $db_password, $db_name);

  if (mysqli_connect_errno()){
    $result  = 'error';
    $message = 'Failed to connect to database: ' . mysqli_connect_error();
    $job     = '';
  }
 
 // Execute job
 if ($job == 'get_companies'){

    // Get companies
    $query = "SELECT * FROM business_info ORDER BY business_id";
    $query = mysqli_query($db_connection, $query);
    if (!$query){
      $result  = 'error';
      $message = 'query error';
    } else {
      $result  = 'success';
      $message = 'query success';
      while ($company = mysqli_fetch_array($query)){
        // Construct "Click to connect" message from phone number entry in database MV 7-1-17
        $wa_str = '';
        $wa_str = '<a href="https://api.whatsapp.com/send?phone=';
        $wa_str .= $company['whatsapp'];
        $wa_str .= '&text=New customer query via whats411.com! Response requested"> Send WhatsApp message</a>';
        $mysql_data[] = array(
          "name"            => $company['name'],
          "owner"           => $company['owner'],
          "city"            => $company['city'],
          "locality"        => $company['locality'],
          "biz_type"        => $company['type'],
          "whatsapp_link"   => $wa_str,
          "latitude"        => $company['latitude'],
          "longitude"       => $company['longitude'],
        );
      }  
    }  
 } elseif ($job == 'get_company') {
    // Get company
    if ($id == ''){
      $result  = 'error';
      $message = 'id missing';
    } else {
      $query = "SELECT * FROM business_info WHERE business_id = '" . mysqli_real_escape_string($db_connection, $id) . "'";

      $query = mysqli_query($db_connection, $query);

    if (!$query){
      $result  = 'error';
      $message = 'query error';
    } else {
      hide_loading_message();

      $result  = 'success';
      $message = 'query success';
      while ($company = mysqli_fetch_array($query)){
        $mysql_data[] = array(
          "name"            => $company['name'],
          "owner"           => $company['owner'],
          "city"            => $company['city'],
          "locality"        => $company['locality'],
          "biz_type"        => $company['type'],
          "whatsapp_link"   => $company['whatsapp'],
        );
      }  
      } 
   }

  } elseif ($job == 'add_company'){

    // Add company
    $wa_only_numbers = preg_replace('/\D/', '', $_GET['whatsapp']);

    // Add Lat/LONG
    $lat_long_location = '';
    $lat_long_location = $_GET['city'];
    $lat_long_location .= ',';
    $lat_long_location .= $_GET['locality'];

    $array = lookup($lat_long_location);

    // Add company
    $query = "INSERT INTO  business_info SET ";
    if (isset($_GET['name']))       { $query .= "name     = '" . mysqli_real_escape_string($db_connection, $_GET['name'])     . "', "; }
    if (isset($_GET['city']))       { $query .= "city     = '" . mysqli_real_escape_string($db_connection, $_GET['city'])     . "', "; }
    if (isset($_GET['type']))       { $query .= "type     = '" . mysqli_real_escape_string($db_connection, $_GET['type'])     . "', "; }
    if (isset($_GET['locality']))   { $query .= "locality = '" . mysqli_real_escape_string($db_connection, $_GET['locality']) . "', "; }
    if (isset($_GET['owner']))      { $query .= "owner    = '" . mysqli_real_escape_string($db_connection, $_GET['owner'])    . "', "; }
    if (isset($_GET['whatsapp']))   { $query .= "whatsapp = '" . mysqli_real_escape_string($db_connection, $wa_only_numbers)  . "', "; }

    $query .= "latitude  =" . $array['latitude'] . ",";
    $query .= "longitude  =" . $array['longitude'] ;

   // error_log(print_r($query, TRUE), 3, '/var/tmp/errors.log');

    $query = mysqli_query($db_connection, $query);

   // error_log("RESULT", 3, '/var/tmp/errors.log');
   // error_log(print_r($query, TRUE), 3, '/var/tmp/errors.log');

    if (!$query){
      $result  = 'error';
      $message = 'add error';

    } else {
      $result  = 'success';
      $message = 'add success';
    }

  } elseif ($job == 'edit_company'){

    // Add company
    $wa_only_numbers = preg_replace('/\D/', '', $_GET['whatsapp']);

    // Add Lat/LONG
    $lat_long_location = '';
    $lat_long_location = $_GET['city'];
    $lat_long_location .= ',';
    $lat_long_location .= $_GET['locality'];

    $array = lookup($lat_long_location);

    // Add company
    $query = "UPDATE business_info SET ";
    if (isset($_GET['name']))       { $query .= "name     = '" . mysqli_real_escape_string($db_connection, $_GET['name'])     . "', "; }
    if (isset($_GET['city']))       { $query .= "city     = '" . mysqli_real_escape_string($db_connection, $_GET['city'])     . "', "; }
    if (isset($_GET['type']))       { $query .= "type     = '" . mysqli_real_escape_string($db_connection, $_GET['type'])     . "', "; }
    if (isset($_GET['locality']))   { $query .= "locality = '" . mysqli_real_escape_string($db_connection, $_GET['locality']) . "', "; }
    if (isset($_GET['owner']))      { $query .= "owner    = '" . mysqli_real_escape_string($db_connection, $_GET['owner'])    . "', "; }
    if (isset($_GET['whatsapp']))   { $query .= "whatsapp = '" . mysqli_real_escape_string($db_connection, $wa_only_numbers)  . "', "; }

    $query .= "latitude  =" . $array['latitude'] . ",";
    $query .= "longitude  =" . $array['longitude'] ;
    $query .= " WHERE business_id =" . mysqli_real_escape_string($db_connection, $_GET['id']);
       
    // error_log(print_r($query, TRUE), 3, '/var/tmp/errors.log');

    $query = mysqli_query($db_connection, $query);

    if (!$query){
      $result  = 'error';
      $message = 'add error';

    } else {
      $result  = 'success';
      $message = 'add success';
    }

  } elseif ($job == 'delete_company'){

    // Delete company
    if ($id == ''){
      $result  = 'error';
      $message = 'id missing';
    } else {
      $query = "DELETE FROM business_info WHERE business_id = '" . mysqli_real_escape_string($db_connection, $_GET['id']) . "'";

      //error_log(print_r($query, TRUE), 3, '/var/tmp/errors.log');


      $query = mysqli_query($db_connection, $query);
      if (!$query){
        $result  = 'error';
        $message = 'query error';
      } else {
        $result  = 'success';
        $message = 'query success';
      }
    } 

  } elseif ($job='get_companies_edit'){

    // Get companies
    $query = "SELECT * FROM business_info ORDER BY business_id";
    $query = mysqli_query($db_connection, $query);
    if (!$query){
      $result  = 'error';
      $message = 'query error';
    } else {
      $result  = 'success';
      $message = 'query success';
      while ($company = mysqli_fetch_array($query)){
        $functions  = '<div class="function_buttons"><ul>';
        $functions .= '<li class="function_edit"><a data-id="'   . $company['business_id'] . '" data-name="' . $company['name'] . '"><span>Edit</span></a></li>';
        $functions .= '<li class="function_delete"><a data-id="' . $company['business_id'] . '" data-name="' . $company['name'] . '"><span>Delete</span></a></li>';
        $functions .= '</ul></div>';
        $mysql_data[] = array(
          "name"            => $company['name'],
          "owner"           => $company['owner'],
          "city"            => $company['city'],
          "locality"        => $company['locality'],
          "biz_type"        => $company['type'],
          "whatsapp_link"   => $company['whatsapp'],
          "latitude"        => $company['latitude'],
          "longitude"       => $company['longitude'],
          "business_id"     => $company['business_id'],
          "functions"       => $functions
        );
      }  
    }  
 }

 

  // Close database connection
  mysqli_close($db_connection);
}

// Prepare data
$data = array(
  "result"  => $result,
  "message" => $message,
  "data"    => $mysql_data
);

// Convert PHP array to JSON array
$json_data = json_encode($data);
print $json_data;


?>
