<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/27
 * Time: 15:03
 */

include "comm.php";
$mysqli = new mysqli("localhost", "root", "Ilovewow123", "db_customer");
$mysqli->query("set names 'utf8'");

if(isset($_POST['customerId'])){
    $customer_id = $_POST['customerId'];
    $sql = "SELECT CONCAT(province.value, ' ', city.value, ' ', customer_info.detail_addr) addr FROM db_customer.customer_info LEFT JOIN db_addr.province ON db_addr.province.id = SUBSTRING(customer_info.id_0, 1, 2) LEFT JOIN db_addr.city ON db_addr.city.id = SUBSTRING(customer_info.id_0, 1, 4) WHERE CONCAT(customer_info.id_0, customer_info.id) = '{$customer_id}'";
    $rs_sql = $mysqli -> query($sql);

    $data = array();
    if($rs = mysqli_fetch_array($rs_sql)){
        $data['addr'] = $rs[0];
    }
    else{
        exit("Get Address Error");
    }


    $data['contact'] = array();
    $sql = "SELECT id, name FROM customer_contact WHERE CONCAT(customer_id_0, customer_id) = '{$customer_id}'";
    $rs_sql = $mysqli -> query($sql);

    while($rs = mysqli_fetch_array($rs_sql))
    {
        array_push($data['contact'], $rs);
    }
}
else if(isset($_POST['contactId'])){
    $contact_id = $_POST['contactId'];
    $sql = "SELECT tele, email FROM customer_contact WHERE id = '{$contact_id}'";
    $rs_sql = $mysqli -> query($sql);
    if($data = mysqli_fetch_array($rs_sql))
    {

    }
    else{
        exit("Get Contact Info Error");
    }

}
else if (isset($_POST['quote'])){
    $newCustomerId = $_POST['newCustomerId'];
    $newContactId = $_POST['newContactId'];
    $quote = $_POST['quote'];

    $sql = "UPDATE `db_platform`.`quote` SET `customer` = '{$newCustomerId}', `contact_id` = '{$newContactId}' WHERE `quote`.`id` = '{$quote}'";
    $mysqli -> query($sql);
    if(mysqli_affected_rows($mysqli) <= 0)
    {
        exit("Edit Quote's Customer Error");
    }

    exit("0");
}
else
{
    exit("illegal Request");
}


$data_json = json_encode($data);
echo $data_json;