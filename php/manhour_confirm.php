<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/11/20
 * Time: 12:01
 */

include "comm.php";
include "conn.php";
$username = $_SESSION['username'];
$data = new stdClass();

if(isset($_POST['staff_id']))
{
    $staff_id = $_POST['staff_id'];
}
else
{
    $data -> state = 'error';
    $data -> tag = "Get Staff ID Error";
    echo json_encode($data);
    exit();
}

if(isset($_POST['action']))
{
    $action = $_POST['action'];
}
else
{
    $data -> state = 'error';
    $data -> tag = "Get Action Code Error";
    echo json_encode($data);
    exit();
}

switch ($action)
{
    case 'init':
        permission($username, $mysqli);
        get_staff_brief_info($staff_id, $mysqli);
        get_manhour($staff_id, $mysqli);
        break;

    case 'search':
        if(isset($_POST['start_week']))
        {
            $start_week = $_POST['start_week'];
        }
        else
        {
            $data -> state = 'error';
            $data -> tag = "Get Start Week Error";
            echo json_encode($data);
            exit();
        }
        if(isset($_POST['end_week']))
        {
            $end_week = $_POST['end_week'];
        }
        else
        {
            $data -> state = 'error';
            $data -> tag = "Get End Week Error";
            echo json_encode($data);
            exit();
        }
        permission($username, $mysqli);
        search_manhour($staff_id, $start_week, $end_week, $mysqli);
        break;

    case 'confirm':
        if(isset($_POST['week']))
        {
            $week = $_POST['week'];
        }
        else
        {
            $data -> state = 'error';
            $data -> tag = "Get Week Error";
            echo json_encode($data);
            exit();
        }
        permission($username, $mysqli);
        confirm_manhour($staff_id, $week, $mysqli);

}

echo json_encode($data);


//验证用户的合法性，仅部门经理可见各自部门的人力规划信息（目前部门系统尚未健全，部门经理表内的用户允许对所有员工信息进行访问）
function permission($username, $mysqli)
{
    global $data;
    $sql = "SELECT `department_manager`.`uid` FROM `db_project`.`department_manager` LEFT JOIN `db_platform`.`user` ON `user`.`uid` = `department_manager`.`uid` WHERE `user`.`username` = '{$username}'";
    $rs_sql = $mysqli -> query($sql);
    if(mysqli_num_rows($rs_sql) > 0)
    {
        $data -> state = 'permit';
    }
    else
    {
        $data -> state = 'reject';
        $data -> tag = "您不具有该操作权限";
        echo json_encode($data);
        exit();
    }
}

//查询员工简要信息
function get_staff_brief_info($staff_id, $mysqli){
    global $data;
    $sql = "SELECT `uid`, `name`, `department`, `team`, `title`, `email`, `top` FROM `user` WHERE `uid` = '{$staff_id}'";
    $rs_sql = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($rs_sql))
    {
        $data -> staff = $rs;
    }
    else
    {
        $data -> state = 'error';
        $data -> tag = 'Query Staff Info Error';
        echo json_encode($data);
        exit();
    }
}

//查询员工最近四周的工时记录(时间逆序)
function get_manhour($staff_id, $mysqli)
{
    global $data;
    $sql = "SELECT  `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note`, `manhour`.`isDraft`  FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` WHERE developer = '{$staff_id}' AND TO_DAYS(NOW()) - TO_DAYS(`manhour`.`week`) <= 27 AND `manhour`.`isDraft` = 0 ORDER BY week DESC";
    $rs_sql = $mysqli -> query($sql);
    $data -> manhour = array();
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data -> manhour[] = $rs;
    }
}


//查询目标时间区间内的工时表（时间顺序）
function search_manhour($staff_id, $start_week, $end_week, $mysqli)
{
    global $data;
    $sql = "SELECT  `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note`, `manhour`.`isDraft`  FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` WHERE developer = '{$staff_id}' AND `manhour`.`week` >= '{$start_week}' AND `manhour`.`week` <= '{$end_week}' AND `manhour`.`isDraft` = 0 ORDER BY week";
//    echo $sql;
    $rs_sql = $mysqli -> query($sql);
    $data -> manhour = array();
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data -> manhour[] = $rs;
    }
}


//批准
function confirm_manhour($staff_id, $week, $mysqli)
{

}


//驳回
function reject_manhour($staff_id, $week, $mysqli)
{

}