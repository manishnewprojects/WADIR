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
    "order":[[8,'asc']],
    "language": {
          "processing": "<img src='img/loading.gif'> Loading businessess...",
    }
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


$('#send_button').click( function() {       
  $("#form_company").validate({              
    rules: {
      whatsapp: {
        required: true,
        phonecheck: true
      }
    }
  }).form(); 
});

$.validator.addMethod("phonecheck", 
                       function(value, element){
                          console.log (element.value);
                          var access_key = '2f5fa0093e2cc0e3efa308356180f644';

                          // verify phone number via AJAX call
                          var phone_check = $.ajax({
                            url: 'http://apilayer.net/api/validate?access_key=' + access_key + '&number=' + element.value,   
                            dataType: 'json',
                            success: function(json) {
                              console.log("Got here1", json.line_type );
                              if (json.line_type == 'mobile')
                                return true;
                            }

                          });

                         // function check_phone_validity(response){
                         // console.log("Got here1", response );
                         // console.log("Got here2", response );
                           
                          // if response === "mobile"
                          //return true;

                          //}

                          //return check_phone_validity();

                          return phone_check;

                       }, 
                       "Please enter a valid phone number");

 

$(document).on('submit', '#form_company.add', function(e){
    // Validate form 
    //grecaptcha.reset();
    //grecaptcha.execute();

    e.preventDefault();
    var form_data = $('#form_company').serialize();
    var form_fields=JSON.stringify(form_data);
    var whatsapp_entered = form_fields.substring(form_fields.lastIndexOf("whatsapp=")+9,form_fields.lastIndexOf("&id"));

  

 
    if (form_company.valid() == true) {
    
      // Send company information to database


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
                              window.open('http://phonezoo.com', '_self');
                        });
          }
         else {
           
          bootbox.alert("Add request failed1!");

         }

      });

  });


function formSubmit() {
  // submit the form which now includes a g-recaptcha-response input
}

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
                              window.open('http://whats411.com', '_self');
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
                              window.open('http://whats411.com', '_self');
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
        show_message('Information request failed', 'error');
      }
    });

    request.fail(function(jqXHR, textStatus){
      show_message('Information request failed: ' + textStatus, 'error');
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




});