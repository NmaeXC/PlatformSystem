<?php
/**
 * Created by IntelliJ IDEA.
 * User: admin
 * Date: 2016/4/2
 * Time: 22:44
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

//报销单详情
$expenseId = $_POST['detailNumber'];
$data = array();

$sql = "SELECT user.name, user.uid, user.department, user.title FROM user LEFT JOIN expense ON user.uid = expense.uid WHERE expense.number = '{$expenseId}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $data["userInfo"] = $rs;
}
else
{
    echo "Get User Info Error";
}

//返回该条请假单的详细信息
$sql = "SELECT type type_id, expense_item_type.value type, amount, site, remark, date, attachment FROM expense_item, expense_item_type WHERE expense_item.id = '{$expenseId}' AND expense_item.type = expense_item_type.id order by date";
$rs_sql = $mysqli -> query($sql);

$x = 0;
while($rs = mysqli_fetch_array($rs_sql))
{
    $data["item"][$x] = $rs;
    $x ++;
}
$data["sum"] = $x;
$data_json = json_encode($data);

echo $data_json;