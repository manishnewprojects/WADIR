<!-- Copyright (C) 2017, Manish Vaidya --><!doctype html> <?php include 'php_includes/header.php'; ?><?php include 'php_includes/navbar.php'; ?> <!-- Add company submit form CAPTCHA callback function --><script type="text/javascript">function formSubmit() {  // submit the form which now includes a g-recaptcha-response input  captcha_valid = 1;  return captcha_valid;}</script> <!-- Primary Page Layout --><body class="landing-page"><?php #include 'php_includes/google_ad.php'; ?><div class="container"> <div class="main main-raised">    <form  class="form add" id="form_company" data-id="" novalidate>      <div class="header-primary text-center">          <h3>Add my business</h3>      </div>       <div class="content">                                   <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">business</i>                    </span>                    <input name="name" id="name" value="" type="text" class="form-control required" placeholder="Business...">                  </div>                   <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">place</i>                    </span>                    <input name="city" id="city" value="" type="text" class="form-control required" placeholder="City...">                  </div>                  <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">work</i>                    </span>                    <input name="type" id="type" value="" type="text" class="form-control required" placeholder="Type...">                  </div>                   <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">bookmark</i>                    </span>                    <input name="locality" id="locality" value="" type="text" class="form-control required" placeholder="Locality...">                  </div>                  <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">face</i>                    </span>                    <input name="owner" id="owner" value="" type="text" class="form-control" placeholder="Owner...">                  </div>                  <div class="input-group">                    <span class="input-group-addon">                      <i class="material-icons">web</i>                    </span>                    <input name="whatsapp" id="whatsapp" value="" type="text" class="form-control required" placeholder="WhatsApp...">                  </div>                  <div class="input-group">                    <span class="input-group-addon">                    </span>                    <input name="id" id="id" value ="<?php echo '0'; ?>" type="hidden" class="form-control required" placeholder="id...">                  </div>                       <div class="g-recaptcha" data-sitekey="6LcYuUEUAAAAAIvxVql8xQjQ7mJKF71BCLaBoD9q" data-size="invisible" data-callback="formSubmit">                  </div>                                   <div class="footer text-center">                      <div class="button_container btn btn-simple btn-primary btn-lg" id="send_button">                             <button type="submit">Add my business</button>                      </div>                  </div>                          </div>         </form>         </div></div><?php include 'php_includes/google_ad.php'; ?><?php include 'php_includes/footer.php'; ?></body></html>