<?php
/**
 * Created by IntelliJ IDEA.
 * User: admin
 * Date: 2016/5/30
 * Time: 21:47
 */
include "comm.php";
include "conn.php";


$quote = $_POST['quote'];
if(isset($_POST['productID']))
{
    $id = $_POST['productID'];
    if (isset($_POST['delete']))
    {
        //删除
        $sql = "DELETE FROM `db_platform`.`quote_products` WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote}'";
    }
    else
    {
        //修改
        $new_id = $_POST['id'];
        $new_name = $_POST['name'];
        $new_price = $_POST['price'];
        $new_discount = $_POST['discount'];
        $new_ps = $_POST['ps'];
        $new_tax = $_POST['tax'];
        $new_amount = $_POST['amount'];

        $sql = "UPDATE `db_platform`.`quote_products` SET `product_id` = '{$new_id}', `name` = '{$new_name}', `price` = '{$new_price}', `discount` = '{$new_discount}', `tax_rate` = '{$new_tax}', `amount` = '{$new_amount}', `ps` = '{$new_ps}' WHERE `quote_products`.`id` = '{$id}' AND `quote_products`.`quote_id` = '{$quote}'";
    }

}
else
{
    //添加
    $new_id = $_POST['id'];
    $new_name = $_POST['name'];
    $new_price = $_POST['price'];
    $new_discount = $_POST['discount'];
    $new_ps = $_POST['ps'];
    $new_tax = $_POST['tax'];
    $new_amount = $_POST['amount'];

    $rs_sql = $mysqli -> query("SELECT max(id) FROM quote_products WHERE quote_id = '{$quote}'");
    if($rs = mysqli_fetch_array($rs_sql))
    {
        $numeber = $rs[0] + 1;
    }
    else
    {
        exit("Search Error");
    }
    $sql = "INSERT INTO quote_products (id, quote_id, product_id, name, price, discount, tax_rate, amount, ps) VALUES ('{$numeber}', '{$quote}', '{$new_id}', '{$new_name}', '{$new_price}', '{$new_discount}', '{$new_tax}', '{$new_amount}', '{$new_ps}')";

}
$mysqli -> query($sql);
if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit Quote's Product Error");
}

exit("0");