<?php
$data = $_POST['jsonString'];
$data.="\r\n";
//set mode of file to writable.
//chmod("../search-strings.json",0777);
$f = fopen("../search-strings.txt", "a+") or die("fopen failed");
fwrite($f, $data);
fclose($f); 
?>