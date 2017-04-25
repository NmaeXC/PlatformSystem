<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/13
 * Time: 11:06
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

//$sql = "SELECT uid from `db_platform`.`user` WHERE username = '{$username}'";
//$rs_sql = $mysqli -> query($sql);
//if($rs = mysqli_fetch_array($rs_sql))
//{
//    $charge = $rs[0];
//}
//else
//{
//    echo "Get Your Info Error";
//}

if(!$name = $_POST['projectName'])
{
    exit("Get projectName Error");
}
if(!$charge = $_POST['projectCharge'])
{
    exit("Get projectCharge Error");
}
if(!$date = json_decode($_POST['projectDate']))
{
    exit("Get projectDate Error");
}
if(!$manhours = $_POST['projectManhour'])
{
    exit("Get projectManhour Error");
}

$milestone = json_decode($_POST['milestone']);

if(!$developer = json_decode($_POST['developer']))
{
    exit("Get developer Error");
}
else if(($n = count($developer)) <= 0)
{
    exit("No developer Error");
}
$disc = $_POST['projectDisc'];

$sql = "SELECT max(id) from `db_project`.`project`";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $id = ($rs[0] < 100)? 100 : $rs[0] + 1;
}
else
{
    echo "Get Project ID Info Error";
}
$start_time = $date[0];
$end_time = $date[1];
//插入项目条目
$sql = "INSERT INTO `db_project`.`project` (`id`, `name`, `start_time`,`end_time`, `man_hours`, `disc`, `charge`, `state`) VALUES ('{$id}', '{$name}', '{$start_time}','{$end_time}', '{$manhours}', '{$disc}', '{$charge}', '开发中')";
$mysqli -> query($sql);

if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Insert into Table project Error");
}

//插入里程碑
foreach ($milestone as $key => $value)
{
    $index = $key + 1;
    $date = $value -> date;
    $disc = $value -> disc;
    if($date != "")
    {
        $sql = "INSERT INTO `db_project`.`project_milestone` (`project_id`, `index`, `date`, `disc`) VALUES ('{$id}', '{$index}', '{$date}', '{$disc}')";
        $mysqli -> query($sql);
        if(mysqli_affected_rows($mysqli) <= 0)
        {
            echo "Insert Milestone (".$index.") Error";
            continue;
        }
    }
    else
    {
        echo "Insert Milestone (".$index.") Error";
    }

}

//插入项目开发人员
$admin = 0;              //暂定没有管理员权限
foreach ($developer as $value) {
    $uid = $value -> uid;
    $manhours = $value -> manhours;
    $sql = "INSERT INTO `db_project`.`project_developer` (`project_id`, `developer`, `man_hours`, `isAdmin`) VALUES ('{$id}', '{$uid}', '{$manhours}', '{$admin}')";
    $mysqli -> query($sql);
    if(mysqli_affected_rows($mysqli) <= 0)
    {
        echo "Insert Developer (".$value -> uid.") Error";
        continue;
    }
}

echo 0;

