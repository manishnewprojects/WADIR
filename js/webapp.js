$(document).ready(function(){

getLocation();

function getLocation(){
if (navigator.geolocation) {
          var options = {timeout:60000};
          navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }; send_values(pos);
            }, errorHandler, options);

            }
            else{
               alert("Sorry, browser does not support geolocation!");
  }
}   

function errorHandler(err) {
  pos = {
              lat:-122,
              lng:37
            };
  if(err.code == 1) {
      alert("Error: Access is denied!");
      send_values(pos);
  }     
  else if( err.code == 2) {
      alert("Error: Position is unavailable!");
      send_values(pos);
  }
}

function send_values(position) {

   var wadir_companies =  $('#wadir_companies').DataTable( {
    "ajax": "php/data.php?job=get_companies",
    "columns": [
      { "data": "name"},
      { "data": "city"  },
      { "data": "biz_type"  },
      { "data": "locality"},
      { "data": "owner" },
      { "data": "whatsapp_link" },
      { "data": "latitude" },
      { "data": "longitude" },
      { "data"  : null,
        "render" : function (data, type, row) { return (distance(data["longitude"],data["latitude"],position.lat, position.lng)); }
      }
    ],
    "columnDefs": [
            {
                "targets": [ 6,7,8 ],
                "visible": false,
                "searchable": false,
            },
    ],
    "order":[[8,'asc']]
  });

}

 var wadir_companies_edit =  $('#wadir_companies_edit').DataTable( {
    "ajax": "php/data.php?job=get_companies_edit",
    "columns": [
      { "data": "name"},
      { "data": "city"  },
      { "data": "biz_type"  },
      { "data": "locality"},
      { "data": "owner" },
      { "data": "whatsapp_link" },
      { "data": "latitude" },
      { "data": "longitude" },
      { "data": "business_id" },
      { "data": "functions"}
    ],
    "columnDefs": [
            {
                "targets": [ 6,7,8 ],
                "visible": false,
                "searchable": false,
            },
    ],
    "order":[[1,'asc']]
  });

 var form_company = $('#form_company');
  
  // Add company submit form
  $(document).on('submit', '#form_company.add', function(e){
    // Validate form 
    e.preventDefault();
    if (form_company.valid() == true){
      // Send company information to database
      var form_data = $('#form_company').serialize();
      var request   = $.ajax({
        url:          'php/data.php?job=add_company',
        cache:        false,
        data:         form_data,
        dataType:     'json',
        contentType:  'application/json; charset=utf-8',
        type:         'get'
      });
      
      
    }
      request.done(function(output){
          if (output.result == 'success'){
            var dialog=JSON.stringify(form_data);
            var dialog_name=dialog.substring(dialog.lastIndexOf("name=")+5,dialog.lastIndexOf("&city"));
            dialog_name = dialog_name.replace(/\+/g," ");
            dialog_name = dialog_name.replace(/\%2C/g,",");

            var bootbox_message = 'Your business <b>'+ dialog_name +'</b> added succesfully!';
            bootbox.alert(bootbox_message, 
                        function(){
                              window.open('http://whatsappdir.com', '_self');
                        });
          }
         else {
           
          bootbox.alert("Add request failed1!");

         }

      });

  });

// Edit company button
  $(document).on('click', '.function_edit a', function(e){
    e.preventDefault();
    // Get company information from database
    var id      = $(this).data('id');
    var request = $.ajax({
      url:          'php/data.php?job=get_company',
      cache:        false,
      data:         'id=' + id,
      dataType:     'json',
      contentType:  'application/json; charset=utf-8',
      type:         'get'
    });

    request.done(function(output){
      if (output.result == 'success'){
        window.location.replace('edit_listing.php?company_curr_info='+output.data[0])
      } else {
        show_message('Information request failed', 'error');
      }
    });

    request.fail(function(jqXHR, textStatus){
      show_message('Information request failed: ' + textStatus, 'error');
    });
  });

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at http://www.geodatasource.com                          :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: http://www.geodatasource.com                        :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2017            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

function distance(lat1, lon1, lat2, lon2, unit) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
  }


// MISC OUTPUT FUNCTIONS 

 // Show message
  function show_message(message_text, message_type){
    $('#message').html('<p>' + message_text + '</p>').attr('class', message_type);
    $('#message_container').show();
    if (typeof timeout_message !== 'undefined'){
      window.clearTimeout(timeout_message);
    }
    timeout_message = setTimeout(function(){
      hide_message();
    }, 8000);
  }
  // Hide message
  function hide_message(){
    $('#message').html('').attr('class', '');
    $('#message_container').hide();
  }

  // Show loading message
  function show_loading_message(){
    $('#loading_container').show();
  }
  // Hide loading message
  function hide_loading_message(){
    $('#loading_container').hide();
  }

  // Show lightbox
  function show_lightbox(){
    $('.lightbox_bg').show();
    $('.lightbox_container').show();
  }
  // Hide lightbox
  function hide_lightbox(){
    $('.lightbox_bg').hide();
    $('.lightbox_container').hide();
  }
  // Lightbox background
  $(document).on('click', '.lightbox_bg', function(){
    hide_lightbox();
  });
  // Lightbox close button
  $(document).on('click', '.lightbox_close', function(){
    hide_lightbox();
  });
  // Escape keyboard key
  $(document).keyup(function(e){
    if (e.keyCode == 27){
      hide_lightbox();
    }
  });
  
  // Hide iPad keyboard
  function hide_ipad_keyboard(){
    document.activeElement.blur();
    $('input').blur();
  }

});