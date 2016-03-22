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
if($rs = $rs = mysqli_fetch_array($rs_sql))
{
    $uid = $rs[0];
}
else
{
    echo "Get User Info Error";
}


if (isset($_POST["detailNumber"]))
{
    //报销单详情
    $expenseId = $_POST['detailNumber'];
    //返回该条请假单的详细信息
    $sql = "SELECT type, amount, remark, date, attachment FROM expense_item WHERE id = '{$expenseId}'";
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

}
else
{
    //报销单历史纪录
    $sql = "SELECT number,accepted, submitDate, state FROM expense WHERE uid = '{$uid}' ORDER BY id DESC";
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

}
