<?php

class MyDB extends SQLite3
{
    function __construct()
    {
      $this->open('MedicalDB.db');
     
    }
	//echo $this->getMethods();
//	var_dump($this->getMethods());
}
//var_dump($at);
//$at=new SQLite3('MedicalDB.db',0,"zhu2003$$kao@163.com.xzfvd*");
//var_dump($at);
//exit;
$db = new MyDB();
$con = mysqli_connect("localhost","root","root");
$select_db = mysqli_select_db($con,'crmeb');
$rd=mysqli_query($con,'SELECT * FROM eb_article');
var_dump($rd);
//$db->exec('CREATE TABLE foo (bar STRING)');
//$db->exec("INSERT INTO foo (bar) VALUES ('This is a test')");

$result = $db->query('SELECT * FROM tCate');
var_dump($result->fetchArray());
?>