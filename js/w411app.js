
// Copyright (C) 2017, Manish Vaidya 

$(document).ready(function(){

// Get location of the user  
 
// Show loading message
  function show_loading_message(){
    $('#loading_container').show();
  }
  // Hide loading message
  function hide_loading_message(){
    $('#loading_container').hide();
  }


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

// Function to provide fake lat/long if none are available - resolves to middle of Pacific Ocean  

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

// Show initial table as a success calback from GetLocation()  
function send_values(position) {
   show_loading_message();
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
            {
                "targets": 3,
                render: function ( data, type, row ) {
                    return data.substr( 0, 15 );
                }
            },
            {
                "targets": 2,
                render: function ( data, type, row ) {
                    return data.substr( 0, 20 );
                }
            }
    ],
    "order":[[8,'asc']],
    "processing": true,
    "language": {
          "processing": '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading..n.</span> ',
          "searchPlaceholder": "Wedding, Courier, Plumber ...."

      },
      
  });
    hide_loading_message();
  
}

//Code block to send search terms back to the server, greater than length of 10
$('#wadir_companies').on('search.dt', function() {
    var value = $('.dataTables_filter input').val();
    if (value.length > 10)
      saveToFile(value); // <-- the value
      //console.log(value);

}); 

function saveToFile(data){
  jsonString = JSON.stringify(data);
  $.ajax({
    url: 'php/savetofile.php',
    data : {'jsonString':jsonString},
    type: 'POST'
  });
}

// Edit listing code block  

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

// Add listing code block  

var form_company = $('#form_company'); 
$(document).on('submit', '#form_company.add', function(e){
    
    e.preventDefault();
    var form_data = $('#form_company').serialize();
    var form_fields=JSON.stringify(form_data);
    var whatsapp_entered = form_fields.substring(form_fields.lastIndexOf("whatsapp=")+9,form_fields.lastIndexOf("&id"));

   form_fully_valid = 0; captcha_valid = 1;
   // Validate form 
    grecaptcha.reset();
    grecaptcha.execute();

    //console.log("captcha_valid", captcha_valid);

    if ((form_company.valid() == true) && (captcha_valid == 1)) {
    
      // Send company information to database

                          var access_key = '2f5fa0093e2cc0e3efa308356180f644';

                          var phone_check=$.ajax(
                            {
                            url: 'https://apilayer.net/api/validate?access_key=' + access_key + '&number=' + whatsapp_entered,   
                            dataType: 'json',
                           }


                            ).done(function(result){

                            //console.log("phone_check", phone_check);
                            //console.log("result", result);


                             var phone_details=JSON.stringify(result);

                            //console.log("phone_detils", phone_details);
                            
                           var line_type=phone_details.substring(phone_details.lastIndexOf("line_type")+12,phone_details.lastIndexOf("}")-1);
                              //console.log("lintyoe", line_type);

                              if (line_type == "mobile") form_fully_valid =1;


                              if (form_fully_valid) {

                                var request   = $.ajax({
                                      url:          'php/data.php?job=add_company',
                                      cache:        false,
                                      data:         form_data,
                                      dataType:     'json',
                                      contentType:  'application/json; charset=utf-8',
                                      type:         'get'
                                    });
                                    
                                    request.done(function(output){
                                        if (output.result == 'success'){
                                          var dialog=JSON.stringify(form_data);

                                          var dialog_name=dialog.substring(dialog.lastIndexOf("name=")+5,dialog.lastIndexOf("&city"));
                                          dialog_name = dialog_name.replace(/\+/g," ");
                                          dialog_name = dialog_name.replace(/\%2C/g,",");

                                          var bootbox_message = 'Your business <b>'+ dialog_name +'</b> added succesfully!';
                                          bootbox.alert(bootbox_message, 
                                                      function(){
                                                            window.open('http://justmessage.in', '_self');
                                                      });
                                        }
                                       else {
                                         
                                        bootbox.alert("Add request failed1!");

                                       }

                                    });
                                   } // IF FORM_FULLY_VALID

                                   else
                                   {
                                      bootbox.alert("Enter a valid mobile number");

                                   }
                            
                            }).fail(function() {
                               console.log( "error - phone check failed" );
                             } );
     }
  });


var form_company = $('#form_company');
  // Add company submit form
  $(document).on('submit', '#form_company.update', function(e){
     // Validate form 
    e.preventDefault();
    if (form_company.valid() == true){
      // Send company information to database
      var form_data = $('#form_company').serialize();
      var request   = $.ajax({
        url:          'php/data.php?job=edit_company',
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

            var bootbox_message = 'Listing for your business <b>'+ dialog_name +'</b> updated succesfully!';
            bootbox.alert(bootbox_message, 
                        function(){
                              window.open('http://justmessage.in', '_self');
                        });
          }
         else {
           
          bootbox.alert("Add request failed1!");

         }

      });

  });

 

// FUNCTION TO PROCESS DELETE FROM EDIT_DELETE_LISTING.PHP

var form_company = $('#form_company');
  // Add company submit form
  $(document).on('submit', '#form_company.delete', function(e){
     // Validate form 
    e.preventDefault();
    if (form_company.valid() == true){
      // Send company information to database
      var form_data = $('#form_company').serialize();
      var request   = $.ajax({
        url:          'php/data.php?job=delete_company',
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

            var bootbox_message = 'Listing for your business <b>'+ dialog_name +'</b> DELETED!';
            bootbox.alert(bootbox_message, 
                        function(){
                              window.open('http://justmessage.in', '_self');
                        });
          }
         else {
           
          bootbox.alert("Add request failed1!");

         }

      });

  });

String.prototype.escapeSpecialChars = function() {
    return this.replace(/&/g,"%26");
               
 };


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
      var company_curr_info_parsed=JSON.stringify(output.data[0]);

      //console.log(company_curr_info_parsed);

      var company_curr_info = company_curr_info_parsed.escapeSpecialChars();

      //console.log(company_curr_info);


      window.location.replace('edit_listing.php?company_curr_info=' + company_curr_info + '&id=' + id)

      } else {
        //show_message('Information request failed', 'error');
      }
    });

    request.fail(function(jqXHR, textStatus){
      //show_message('Information request failed: ' + textStatus, 'error');
    });
  });

// Edit company button
$(document).on('click', '.function_delete a', function(e){
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
      var company_curr_info=JSON.stringify(output.data[0]);
      window.location.replace('delete_listing.php?company_curr_info=' + company_curr_info + '&id=' + id)

      } else {
        //show_message('Information request failed', 'error');
      }
    });

    request.fail(function(jqXHR, textStatus){
      //show_message('Information request failed: ' + textStatus, 'error');
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




});