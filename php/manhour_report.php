<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/21
 * Time: 11:23
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

if(!$data_json = $_POST["data"])
{
    exit("Get Data Error");
}

if(!$action = $_POST["action"])
{
    exit("Get Action Error");
}

$data_arr = json_decode($data_json);

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

if ($action == "report")
{
    //新建或更新工时信息，并保存为非草稿状态
    $isDraft = '0';
}
elseif ($action == "draft")
{
    //新建或更新工时信息，并保存为草稿状态
    $isDraft = '1';
}
else
{
    exit("操作指令错误！");
}

//print_r($data_arr);

$isChange = 1;
foreach($data_arr as $project_id => $value)
{
//    echo "project_id = ".$project_id;
//    echo "\n--------------\n";
//    print_r($value);
//    echo "\n--------------\n";

    $week = $value -> week;
    $d1 = $value -> d1;
    $d2 = $value -> d2;
    $d3 = $value -> d3;
    $d4 = $value -> d4;
    $d5 = $value -> d5;
    $d6 = $value -> d6;
    $d7 = $value -> d7;
    $note = $value -> note;
    $sql = "INSERT INTO `db_project`.`manhour` (`project_id`, `developer`, `week`, `d1`, `d2`, `d3`, `d4`, `d5`, `d6`, `d7`, `note`, `isDraft`) VALUES ('{$project_id}', '{$uid}', '{$week}', '{$d1}', '{$d2}', '{$d3}', '{$d4}', '{$d5}', '{$d6}', '{$d7}', '{$note}', '{$isDraft}') ON DUPLICATE KEY UPDATE `d1` = '{$d1}', `d2` = '{$d2}', `d3` = '{$d3}', `d4` = '{$d4}', `d5` = '{$d5}', `d6` = '{$d6}', `d7` = '{$d7}', `note` = '{$note}', `isDraft` = '{$isDraft}'";
//    echo $sql;
    $mysqli -> query($sql);
    if(mysqli_affected_rows($mysqli) > 0)
    {
        $isChange = 0;
    }
}

echo $isChange;

