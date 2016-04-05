<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/5
 * Time: 15:31
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

$sql = "SELECT SUM(TO_DAYS(endTime) - TO_DAYS(startTime)) FROM `leavenote` LEFT JOIN user ON leavenote.uid = user.uid WHERE user.username = '{$username}' AND (leavenote.state = '同意' OR leavenote.state = '未处理') AND leavenote.reason = '年休假'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $remain = $rs[0];
    $month = date("n");
    if($month < 8)
    {
        echo $month - $remain;
    }
    else
    {
        echo 8 - $remain;
    }

}
else
{
    echo "Query Error";
}

