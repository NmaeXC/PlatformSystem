<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/13
 * Time: 17:28
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

if(!isset($_POST['customer_id']))
{
    exit("illegal Request");
}

$customer_id = str_split($_POST['customer_id'], 4);
$name = $_POST['add_name'];
$sex = $_POST['add_sex'];
$tele = $_POST['add_tele'];
$email = $_POST['add_email'];

$sql = "INSERT INTO customer_contact (customer_id_0, customer_id, name, sex, tele, email) VALUES ('{$customer_id[0]}', '{$customer_id[1]}', '{$name}', '{$sex}', '{$tele}', '{$email}')";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO contact Error");
}

echo 0;
