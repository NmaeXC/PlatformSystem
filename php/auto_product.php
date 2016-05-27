<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/20
 * Time: 17:45
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_product");
$mysqli->query("set names 'utf8'");

$keyword = "%".$_POST["keyword"]."%";
$sql = "SELECT disc title FROM product_info WHERE disc LIKE '{$keyword}' OR id LIKE '{$keyword}'";
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