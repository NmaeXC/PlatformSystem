<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/29
 * Time: 11:53
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

$keyword = "%".$_POST["keyword"]."%";
$sql = "SELECT name title, id FROM customer_info WHERE name LIKE '{$keyword}'";
$rs_sql = $mysqli -> query($sql);

$data = array();
$j = 0;

while($rs = mysqli_fetch_array($rs_sql))
{
    $data[$j] = $rs;
    ++$j;
}

$data_json = json_encode($data);
echo $data_json;