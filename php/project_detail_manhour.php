<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/19
 * Time: 14:31
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

if(!$project_id = $_POST['project_id'])     //项目编号
{
    exit("Get project_id Error");
}
if(!$developer = $_POST['developer'])      //开发者uid
{
    exit("Get developer uid Error");
}
$week = $_POST['week'];

$sql = "SELECT uid from `db_platform`.`user` WHERE username = '{$username}'";
$rs_sql = $mysqli -> query($sql);
if($rs = mysqli_fetch_array($rs_sql))
{
    $user = $rs[0];
}
else
{
    echo "Get Your Info Error";
}

$data = null;

//验证用户的合法性,仅项目负责人和具有权限的开发人员可见(department_manager表内的人可见)
$sql = "SELECT `project`.`id` FROM `db_project`.`project` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` WHERE (`project`.`charge` = '{$user}' AND `project`.`id` = '{$project_id}') OR (`project_developer`.`developer` = '{$user}' AND `project`.`id` = '{$project_id}' AND `project_developer`.`isAdmin` = 1) OR EXISTS(SELECT * FROM `db_project`.`department_manager` WHERE `department_manager`.`uid` = '{$user}')";
$rs_sql = $mysqli -> query($sql);
if (mysqli_num_rows($rs_sql) < 0)
{
    //不具有权限，立即返回
    $data['tag'] = null;
    $data_json = json_encode($data);
    echo $data_json;
    exit();
}

$data['tag'] = 'permission';

//查询开发者的工时信息
if($week == null)
{
    //未指定周的情况下默认返回最近4周（一个月）的工时信息
    $sql = "SELECT  `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note` FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` WHERE project_id = '{$project_id}' AND developer = '{$developer}' ORDER BY week DESC LIMIT 4";
    $rs_sql = $mysqli -> query($sql);
    $data['manhour'] = array();
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data['manhour'][] = $rs;
    }
}
else
{
    //返回指定周的工时信息
}

$data_json = json_encode($data);
echo $data_json;