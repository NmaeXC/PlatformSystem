<?php
/**
 * Created by IntelliJ IDEA.
 * User: admin
 * Date: 2016/5/30
 * Time: 21:47
 */
include "comm.php";
include "conn.php";

$id = $_POST['productID'];
$quote = $_POST['quote'];
if (isset($_POST['delete']))
{
    $sql = "DELETE FROM `db_platform`.`quote_products` WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote}'";
}
else
{
    $new_id = $_POST['id'];
    $new_name = $_POST['name'];
    $new_price = $_POST['price'];
    $new_discount = $_POST['discount'];
    $new_ps = $_POST['ps'];
    $new_tax = $_POST['tax'];
    $new_amount = $_POST['amount'];

    $sql = "UPDATE `db_platform`.`quote_products` SET `product_id` = '{$new_id}', `name` = '{$new_name}', `price` = '{$new_price}', `discount` = '{$new_discount}', `tax_rate` = '{$new_tax}', `amount` = '{$new_amount}', `ps` = '{$new_ps}' WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote}'";
}
$mysqli -> query($sql);
if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit Quote's Product Error");
}

exit("0");