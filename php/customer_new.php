<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/29
 * Time: 9:27
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

$customerName  = $_POST["customerName"];
$customerID  = $_POST["customerID"];
$customerTele  = $_POST["customerTele"];
$customerFox  = $_POST["customerFox"];
$customerEmail  = $_POST["customerEmail"];
$contactName = $_POST["contactName"];
$contactTele = $_POST["contactTele"];
$contactEmail = $_POST["contactEmail"];

$sql = "INSERT INTO customer_info (id, name, tele, fox, email) VALUES ('{$customerID}', '{$customerName}', '{$customerTele}', '{$customerFox}', '{$customerEmail}')";
//echo $sql;
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO customer_info Error");
}

$sql = "INSERT INTO customer_contact (customer_id, name, tele, email) VALUES ('{$customerID}', '{$contactName}', '{$contactTele}', '{$contactEmail}')";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO contact Error");
}

echo 0;
