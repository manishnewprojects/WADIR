 
$(document).ready(function(){


 var form_company = $('#form_company'); 

// Add company submit form


$(document).on('submit', '#form_company.add', function(e){
  
    e.preventDefault();

    var form_data = $('#form_company').serialize();
    var form_fields=JSON.stringify(form_data);
    //console.log ("from fields",form_fields);

    var whatsapp_entered = form_fields.substring(form_fields.lastIndexOf("whatsapp=")+9,form_fields.lastIndexOf("\""));

       whatsapp_entered = whatsapp_entered.replace(/[^0-9]/, '');

      whatsapp_entered = whatsapp_entered.replace(/\D/g,'');


    //console.log ("into substr",form_fields);

    whatsapp_entered = whatsapp_entered.substr(whatsapp_entered.indexOf("91"));




                          // verify phone number via AJAX call
                          

    //console.log ("extracted ",whatsapp_entered);
              
   
      // Send company information to database

window.open('https://api.whatsapp.com/send?phone=' + whatsapp_entered, '_self');

                          
 




     });

})


     


