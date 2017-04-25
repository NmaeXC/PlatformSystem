<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/3/15
 * Time: 11:58
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

$sql = "SELECT uid FROM user WHERE username = '{$username}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $uid = $rs[0];
}
else
{
    echo "Get User Info Error";
}



$sql = "SELECT expense.number number, user.name accepted, submitDate, state FROM expense, user WHERE expense.uid = '{$uid}' AND user.uid = expense.accepted ORDER BY expense.id DESC";
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
