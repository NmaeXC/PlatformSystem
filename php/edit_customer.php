<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/24
 * Time: 16:39
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

if(!isset($_POST['id']))
{
    exit("illegal Request");
}

$id = $_POST['id'];
$name = $_POST['name'];
$addr = $_POST['addr'];
$tele = $_POST['tele'];
$email = $_POST['email'];

$sql = "UPDATE `db_customer`.`customer_info` SET `name` = '{$name}', `tele` = '{$tele}', `email` = '{$email}', `detail_addr` = '{$addr}' WHERE CONCAT(id_0, id) = '{$id}'";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit contact Error");
}

echo 0;
