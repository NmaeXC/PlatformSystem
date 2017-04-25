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

//本年剩余

$sql = "SELECT leave_balance.last_year,leave_balance.this_year FROM leave_balance WHERE leave_balance.uid = '{$username}'";
$rs_sql = $mysqli -> query($sql);

$month = date("n");
$remain = $month * 8 * 8 / 12;
if($rs = mysqli_fetch_array($rs_sql))
{
    $last_year = floatval($rs['last_year']);
    $this_year = $remain - (64 - floatval($rs['this_year']));
}
else
{
    exit("error");
}




//while($rs = mysqli_fetch_array($rs_sql)) {
//    $start = split("[- :]", $rs['startTime']);
//    $end = split("[- :]", $rs['endTime']);
//    $m1 = intval($start[3]) * 60 + intval($start[4]);
//    $m2 = intval($end[3]) * 60 + intval($end[4]);
//    //确定与工作时间相交的时间区间
//    if ($m1 <= (8 * 60 + 30) || $m1 >= 18 * 60) {
//        $m1 = 0;
//    } else if ($m1 >= (12 * 60) && $m1 <= (13 * 60 + 30)) {
//        $m1 = 3.5;
//    } else if ($m1 <= (12 * 60)) {
//        $m1 = ($m1 - (8 * 60 + 30)) / 60;
//    } else {
//        $m1 = ($m1 - (8 * 60 + 30) - (1.5 * 60)) / 60;
//    }
//
//    if ($m2 <= (8 * 60 + 30) || $m2 >= 18 * 60) {
//        $m2 = 0;
//    } else if ($m2 >= (12 * 60) && $m2 <= (13 * 60 + 30)) {
//        $m2 = 3.5;
//    } else if ($m2 <= (12 * 60)) {
//        $m2 = ($m2 - (8 * 60 + 30)) / 60;
//    } else {
//        $m2 = ($m2 - (8 * 60 + 30) - (1.5 * 60)) / 60;
//    }
//
//    $t = ($m2 - $m1) < 0 ? ($m2 - $m1 + 8) : ($m2 - $m1);
////    $d = (strtotime($rs['endTime']) - strtotime($rs['startTime'])) / (60 * 60);
//    $d = floor((strtotime($rs['endTime']) - strtotime($rs['startTime'])) / (60 * 60 * 24)) * 8;
//
//    $remain = $remain - $t - $d;
//
//}

//$sql = "SELECT balance FROM leave_balance WHERE username = '{$username}'";
//$rs_sql = $mysqli -> query($sql);
//$balance = mysqli_fetch_array($rs_sql)[0];
//if($balance > 0){
//    $remain += $balance;
//}

if ($last_year >= 0 && $this_year >= 0)
{
    echo $last_year + $this_year;
}
else
{
    exit("Error");
}


