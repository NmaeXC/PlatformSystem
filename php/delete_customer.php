<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/24
 * Time: 17:38
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

//if(!isset($_POST['id']))
//{
//    exit("illegal Request");
//}
//
//$id = $_POST['id'];
//
//$sql = "DELETE FROM `db_customer`.`customer_contact` WHERE `customer_contact`.`id` = '{$id}'";
//$rs = $mysqli -> query($sql);
//
//if(mysqli_affected_rows($mysqli) <= 0)
//{
//    exit("Delete contact Error");
//}
//
//echo 0;