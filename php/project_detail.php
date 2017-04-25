<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/17
 * Time: 10:26
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

//项目编号
$project_id = $_POST['project_id'];

$data = null;

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

//验证用户的合法性,仅项目负责人和具有权限的开发人员可见(department_manager表内的人可见)
$sql = "SELECT `project`.`id` FROM `db_project`.`project` WHERE (`project`.`charge` = '{$uid}' AND `project`.`id` = '{$project_id}') OR EXISTS(SELECT * FROM `db_project`.`department_manager` WHERE `department_manager`.`uid` = '{$uid}')";
$rs_sql = $mysqli -> query($sql);
if (mysqli_num_rows($rs_sql) > 0)
{
    $data['tag'] = "charge";
}
else
{
    $sql = "SELECT `project`.`id` FROM `db_project`.`project` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` LEFT JOIN `db_platform`.`user` ON `user`.`uid` = `project_developer`.`developer` WHERE `user`.`username` = '{$username}' AND `project`.`id` = '{$project_id}' AND `project_developer`.`isAdmin` = 1";
    $rs_sql = $mysqli -> query($sql);
    if (mysqli_num_rows($rs_sql) > 0)
    {
        $data['tag'] = "admin";
    }
    else
    {
        //不具有权限，立即返回
        $data['tag'] = null;
        $data_json = json_encode($data);
        echo $data_json;
        exit();
    }
}

//基本信息
$sql = "SELECT `project`.`id`, `project`.`name`, `project`.`start_time`, `project`.`end_time`, `project`.`man_hours`, `user`.`name` charge, `project`.`state`, `project`.`done`, `project`.`disc` FROM `db_project`.`project` LEFT JOIN `db_platform`.`user` ON `user`.`uid` = `project`.`charge` WHERE `project`.`id` = '{$project_id}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $data['info'] = $rs;
}
else
{
    $data['info'] = null;
}

//里程碑列表
$sql = "SELECT `project_milestone`.`date`, `project_milestone`.`disc` FROM `db_project`.`project_milestone` WHERE `project_milestone`.`project_id` = '{$project_id}' ORDER BY `project_milestone`.`date`";
$rs_sql = $mysqli -> query($sql);
$data['milestone'] = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    $data['milestone'][] = $rs;
}

//开发者列表
$sql = "SELECT `project_developer`.`developer` uid, `user`.`name`, `project_developer`.`man_hours`, `project_developer`.`done`, `project_developer`.`isAdmin` FROM `db_project`.`project_developer` LEFT JOIN `db_platform`.`user` ON `user`.`uid` = `project_developer`.`developer` WHERE `project_id` = '{$project_id}'";
$rs_sql = $mysqli -> query($sql);
$data['developer'] = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    $data['developer'][] = $rs;
}

$data_json = json_encode($data);
echo $data_json;