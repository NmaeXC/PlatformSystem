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
$customerTele  = $_POST["customerTele"];
$customerFox  = $_POST["customerFox"];
$customerEmail  = $_POST["customerEmail"];
$customerID_0 = $_POST["addr_code"];
$detail_addr = $_POST["detail_addr"];

$sql = "SELECT max(id) FROM customer_info WHERE id_0 = '{$customerID_0}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $customerID = sprintf("%04d", (intval($rs[0]) + 1));
}
else
{
    exit("Get Previous ID Error");
}

$sql = "INSERT INTO customer_info (id_0, id, name, tele, fox, email, detail_addr) VALUES ('{$customerID_0}', '{$customerID}', '{$customerName}', '{$customerTele}', '{$customerFox}', '{$customerEmail}', '{$detail_addr}')";
//echo $sql;
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO customer_info Error");
}



echo 0;
