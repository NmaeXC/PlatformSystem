<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/24
 * Time: 10:20
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
$sex = $_POST['sex'];
$tele = $_POST['tele'];
$email = $_POST['email'];

$sql = "UPDATE `db_customer`.`customer_contact` SET `name` = '{$name}', `sex` = '{$sex}', `tele` = '{$tele}', `email` = '{$email}' WHERE `customer_contact`.`id` = '{$id}'";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit contact Error");
}

echo 0;
