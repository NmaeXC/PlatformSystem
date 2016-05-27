<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/13
 * Time: 16:06
 */

include "comm.php";
include "conn.php";

if(!isset($_POST['customerId'])){
    exit("no customerId");
}

$id = str_split($_POST['customerId'], 4);
$area = substr($id[0], 0, 1);
$province = substr($id[0], 0, 2);
$city = $id[0];
$data = array();
$sql = "SELECT CONCAT(customer_info.id_0, customer_info.id) id, customer_info.name, customer_info.tele, customer_info.fox, customer_info.email, CONCAT(province.value, city.value) addr0, customer_info.detail_addr addr1 FROM db_customer.customer_info LEFT JOIN db_addr.province ON db_addr.province.id = '{$province}' LEFT JOIN db_addr.city ON db_addr.city.id = '{$city}' WHERE customer_info.id_0 = '{$id[0]}' AND customer_info.id = '{$id[1]}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql)){
    $data['customer'] = $rs;
}
else
{
    exit("Get Customer Info Error");
}
$data['contact'] = array();
$sql = "SELECT id, name, sex, tele, email FROM db_customer.customer_contact WHERE customer_id_0 = '{$id[0]}' AND customer_id = '{$id[1]}'";
$rs_sql = $mysqli -> query($sql);
while($rs = mysqli_fetch_array($rs_sql)){
    array_push($data['contact'], $rs);
}

echo json_encode($data);