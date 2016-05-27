<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/20
 * Time: 17:50
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_product");
$mysqli->query("set names 'utf8'");

if(!isset($_POST['product'])){
    exit("no product");
}

$product = "%".$_POST['product']."%";
$sql = "SELECT id, disc, price, currency FROM product_info WHERE disc LIKE '{$keyword}' OR id LIKE '{$keyword}'";
$rs_sql = $mysqli -> query($sql);

$data = array();

while($rs = mysqli_fetch_array($rs_sql))
{
    array_push($data, $rs);
}

$data_json = json_encode($data);
echo $data_json;