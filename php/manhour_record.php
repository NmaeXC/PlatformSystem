<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/20
 * Time: 14:40
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

$data = null;

//查询所有项目，包括默认项目
//$sql = "SELECT `project`.`id`, `project`.`name` FROM `db_project`.`project` LEFT JOIN `db_project`.`project_developer` ON `project`.`id` = `project_developer`.`project_id` WHERE (`project`.`state` = '其它' OR `project`.`state` = '开发中') GROUP BY `project`.`id` ORDER BY `project`.`id`";
$sql = "SELECT `project`.`id`, `project`.`name` FROM `db_project`.`project` WHERE (`project`.`state` = '其它' OR `project`.`state` = '开发中') GROUP BY `project`.`id` ORDER BY `project`.`id`";
$rs_sql = $mysqli -> query($sql);
$data['project'] = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    $data['project'][] = $rs;
}

//查询用户最近4周的工时表
$sql = "SELECT  `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note`, `manhour`.`isDraft`  FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` WHERE developer = '{$uid}' AND TO_DAYS(NOW()) - TO_DAYS(`manhour`.`week`) <= 27 ORDER BY week DESC";
$rs_sql = $mysqli -> query($sql);
$data['manhour'] = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    $data['manhour'][] = $rs;
}

$data_json = json_encode($data);
echo $data_json;