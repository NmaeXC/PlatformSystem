<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/20
 * Time: 9:43
 */



include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_product");
$mysqli->query("set names 'utf8'");

$productID = $_POST['productID'];
$productDisc = $_POST['productDisc'];
$productPrice = $_POST['productPrice'];

$sql = "INSERT INTO product_info (id, disc, price) VALUES ('{$productID}', '{$productDisc}', '{$productPrice}')";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO product_info Error");
}

echo 0;