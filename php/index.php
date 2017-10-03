<?php

    
    if($_SERVER["REQUEST_METHOD"] === "POST")
    {
        //form submitted



        //verify captcha
        $recaptcha_secret = "6LcKtDIUAAAAAPVgc5VnnKSqehthAVuVY0K26ACZ";
        $response = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$recaptcha_secret."&response=".$_POST['g-recaptcha-response']);
        $response = json_decode($response, true);
        //check if other form details are correct
        error_log(print_r($response, TRUE), 3, '/var/tmp/errors.log');
        if($response["success"] === true)
        {
            echo "Logged In Successfully";
        }
        else
        {
            echo "You are a robot";
        }
    }
  ?>