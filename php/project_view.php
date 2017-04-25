<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/13
 * Time: 18:00
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

// //仅项目负责人或具有该项目管理权限的人可见
// $sql = "SELECT `project`.`id`, `project`.`name`, `project`.`start_time`, `project`.`man_hours`, `user`.`name` charge, `project`.`state`, `project`.`done` FROM `db_project`.`project` LEFT JOIN `db_platform`.`user` ON `project`.`charge` = `user`.`uid` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` WHERE `project`.`charge` = '{$uid}' OR (`project`.`charge` != '{$uid}' AND `project_developer`.`developer` = '{$uid}' AND `project_developer`.`isAdmin` = 1) GROUP BY `project`.`id` ORDER BY `project`.`id` DESC";

//仅项目负责人或具有该项目管理权限的人可见(department_manager表内的人可见)
$sql = "SELECT `project`.`id`, `project`.`name`, `project`.`start_time`, `project`.`man_hours`, `user`.`name` charge, `project`.`state`, `project`.`done` FROM `db_project`.`project` LEFT JOIN `db_platform`.`user` ON `project`.`charge` = `user`.`uid` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` WHERE `project`.`charge` = '{$uid}' OR (`project`.`charge` != '{$uid}' AND `project_developer`.`developer` = '{$uid}' AND `project_developer`.`isAdmin` = 1) OR EXISTS(SELECT * FROM `db_project`.`department_manager` WHERE `department_manager`.`uid` = '{$uid}') GROUP BY `project`.`id` ORDER BY `project`.`id` DESC";

$rs_sql = $mysqli -> query($sql);
$data = array();
$x = 0;
while($rs = mysqli_fetch_array($rs_sql))
{
    $data[$x] = $rs;
    $x++;
}
$data["sum"] = $x;
$data_json = json_encode($data);

echo $data_json;

//$sql = "SELECT project_manager.pm FROM db_project.project_manager WHERE 1";
//$rs_sql = $mysqli -> query($sql);
//if($rs = mysqli_fetch_array($rs_sql))
//{
//    if(in_array($uid, $rs))
//    {
//        //若为PM，返回所有项目
//        $sql = "SELECT `project`.`id`, `project`.`name`, `project`.`start_time`, `project`.`man_hours`, `user`.`name` charge, `project`.`state`, `project`.`done` FROM `db_project`.`project` LEFT JOIN `db_platform`.`user` ON `project`.`charge` = `user`.`uid` WHERE 1 ORDER BY `project`.`id` DESC";
//        //echo $sql;
//    }
//    else
//    {
//        //否则仅项目负责人或具有该项目管理权限的人可见
//        $sql = "SELECT `project`.`id`, `project`.`name`, `project`.`start_time`, `project`.`man_hours`, `user`.`name` charge, `project`.`state`, `project`.`done` FROM `db_project`.`project` LEFT JOIN `db_platform`.`user` ON `project`.`charge` = `user`.`uid` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` WHERE `project`.`charge` = '{$uid}' OR (`project`.`charge` != '{$uid}' AND `project_developer`.`developer` = '{$uid}' AND `project_developer`.`isAdmin` = 1) ORDER BY `project`.`id` DESC";
//        //echo $sql;
//    }
//    $rs_sql = $mysqli -> query($sql);
//    $data = array();
//    $x = 0;
//    while($rs = mysqli_fetch_array($rs_sql))
//    {
//        $data[$x] = $rs;
//        $x++;
//    }
//    $data["sum"] = $x;
//    $data_json = json_encode($data);
//
//    echo $data_json;
//
//
//}
//else
//{
//    echo "Get User Info Error";
//}