<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/10
 * Time: 11:19
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

//报价单单号
$quoteId = $_POST['detailNumber'];
$contact = $_POST['contact'];

$data = array();

//客户联系人及报价单有效期信息
$sql = "SELECT quote.id, customer_info.name customer_name, CONCAT(customer_info.id_0, customer_info.id) customer_id, customer_contact.name contact_name, customer_contact.tele contact_tele, customer_contact.email contact_email, CONCAT(province.value, city.value, customer_info.detail_addr) customer_addr, quote.validity_start, quote.validity_end, quote.currency FROM db_customer.customer_info LEFT JOIN db_platform.quote ON quote.customer = CONCAT(customer_info.id_0, customer_info.id) LEFT JOIN db_customer.customer_contact ON customer_info.id = customer_contact.customer_id LEFT JOIN db_addr.province ON db_addr.province.id = substring(customer_info.id_0, 1, 2) LEFT JOIN db_addr.city ON db_addr.city.id = customer_info.id_0 WHERE quote.id = '{$quoteId}' AND customer_contact.id = '{$contact}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $data["quote"] = $rs;
}
else
{
    echo "Get User Info Error";
}

//报价单填写人信息
$sql = "SELECT user.name, user.tele, user.email FROM user LEFT JOIN quote ON user.uid = quote.staff_uid WHERE quote.id = '{$quoteId}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $data["userInfo"] = $rs;
}
else
{
    echo "Get User Info Error";
}

//返回报价单的产品列表
$sql = "SELECT quote_products.product_id, product_info.disc,  quote_products.orig_price, quote_products.discount, tax_rate.value tax_rate, quote_products.amount FROM db_platform.quote_products LEFT JOIN db_product.product_info ON db_platform.quote_products.product_id = db_product.product_info.id LEFT JOIN db_platform.tax_rate ON db_platform.tax_rate.id = db_platform.quote_products.tax_rate WHERE quote_products.quote_id = '{$quoteId}'";
$rs_sql = $mysqli -> query($sql);


$x = 0;
while($rs = mysqli_fetch_array($rs_sql))
{
    $data["products"][$x] = $rs;
    $x ++;
}
$data["sum"] = $x;
$data_json = json_encode($data);

echo $data_json;