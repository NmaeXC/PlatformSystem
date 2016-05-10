<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/3
 * Time: 13:42
 */

include "comm.php";
include "conn.php";

$username = $_SESSION["username"];

$sql = "SELECT uid FROM user WHERE username = '{$username}'";
$rs_sql = $mysqli -> query($sql);
if($rs = $rs = mysqli_fetch_array($rs_sql))
{
    $uid = $rs[0];
}
else
{
    echo "Get User Info Error";
}

//报价单历史纪录
$sql = "SELECT db_platform.quote.id id, db_customer.customer_info.name customer,  db_customer.customer_contact.name contact, db_customer.customer_contact.id contact_id, db_platform.quote.validity_start, db_platform.quote.validity_end, db_platform.quote.state_id state FROM db_platform.quote LEFT JOIN user ON db_platform.quote.staff_uid = db_platform.user.uid LEFT JOIN db_customer.customer_info ON db_platform.quote.customer = db_customer.customer_info.id LEFT JOIN db_customer.customer_contact ON db_customer.customer_contact.id = db_platform.quote.contact_id WHERE user.uid = '{$uid}' ORDER BY quote.no DESC";
$rs_sql = $mysqli -> query($sql);

$data = array();
$x = 0;
while($rs = mysqli_fetch_array($rs_sql))
{
    $data[$x] = $rs;
    $x ++;
}
$data["sum"] = $x;
$data_json = json_encode($data);

echo $data_json;