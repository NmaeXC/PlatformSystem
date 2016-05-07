<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/23
 * Time: 12:03
 */

include "comm.php";
include "conn.php";

$username = $_SESSION["username"];
$sql = "SELECT uid FROM user WHERE username = '{$username}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $staff_uid = $rs[0];
}
$customer = json_decode($_POST["customer"]);
$customer_id = $customer -> id;
$contact_id = $customer -> contact;
$validity_start = $_POST["validity"][0];
$validity_end = $_POST["validity"][1];
$currency = $_POST["currency"];
$product = json_decode($_POST["product"]);

//生成报价单号 demo:Q2016Q3M08001
$idHead = "Q".date("Y")."Q".ceil(date("m")/3)."M".date("m");

$sql = "SELECT id, no FROM quote ORDER BY no DESC limit 0,1";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $lastest = $rs[0];
    $no = $rs[1];
}
else
{
    $lastest = 0;
}

if(substr($lastest, 0, 10) == $idHead)
{
    $no = $no + 1;
    $id = $idHead.sprintf("%03d", $no);
}
else
{
    $id = $idHead."001";
}

$sql = "INSERT INTO quote (id, validity_start, validity_end, customer, contact_id, staff_uid, state_id, currency) VALUES ('{$id}', '{$validity_start}', '{$validity_end}', '{$customer_id}', '{$contact_id}', '{$staff_uid}', 1, '{$currency}')";
$rs = $mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("INSERT INTO quote Error");
}
foreach($product as $item)
{
    $product_id = $item -> id;
    $product_origPrice = $item -> origPrice;
    $product_discount = $item -> discount;
    $product_taxRate = $item -> taxRate;
    $product_amount = $item -> amount;
    $sql = "INSERT INTO quote_products (quote_id, product_id, orig_price, discount, tax_rate, amount) VALUES ('{$id}', '{$product_id}', '{$product_origPrice}', '{$product_discount}', '{$product_taxRate}', '{$product_amount}')";

    $rs = $mysqli -> query($sql);

    if(mysqli_affected_rows($mysqli) <= 0)
    {
        exit("INSERT INTO quote_products Error\nProduct ID:".$product_id);
    }
}

echo 0;