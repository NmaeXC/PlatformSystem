<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/23
 * Time: 17:12
 */

include "comm.php";
include "conn.php";
$username = $_SESSION["username"];

if(!$action = $_POST['action'])     //操作指令
{
    exit("Get Action Error");
}

$data = null;

switch($action){
    case 'init':
    {
        init($username, $mysqli);
        break;
    }
    case 'staff':
    {
//        init($username, $mysqli);
        $data['tag'] = 'permit';    //允许所有人进行此项操作
        if(!$staff_uid = $_POST['staff_uid'])
        {
            exit("Get Staff UID Error");
        }
        if($staff_uid != null)
        {
            get_staff_info($staff_uid, $mysqli);
//            $plan_week =  get_staff_manhour_plan($staff_uid, $mysqli);
            get_staff_manhour_plan($staff_uid, $mysqli);
//            if($plan_week != null)
//            {
//                get_manhour_info($staff_uid, $plan_week, $mysqli);
//            }
        }
        break;
    }
    case 'manhour':
    {
//        init($username, $mysqli);
        $data['tag'] = 'permit';    //允许所有人进行此项操作
        if(!$staff_uid = $_POST['staff_uid'])
        {
            exit("Get Staff UID Error");
        }
        if(!$plan_week = $_POST['plan_week'])
        {
            exit("Get Plan Week Error");
        }
        get_manhour_info($staff_uid, $plan_week, $mysqli);
        break;
    }
    case 'project':
    {
        init($username, $mysqli);
        get_project_list($mysqli);
        break;
    }
    case 'create':
    {
        init($username, $mysqli);
        if(!$staff_uid = $_POST['staff_uid'])
        {
            exit("Get Staff UID Error");
        }
        if(!$plans = $_POST['plans'])
        {
            exit("Get Plans Error");
        }
        create_plan(json_decode($plans), $staff_uid, $mysqli);
        break;
    }
    case 'create_plans_init':
    {
        init($username, $mysqli);
        get_project_list($mysqli);
        get_all_staff_sinfo($mysqli);
        break;
    }
    case 'create_plans':
    {
        init($username, $mysqli);
        if(!$planData = $_POST['planData'])
        {
            exit("Get Plan Data Error");
        }
        create_plans(json_decode($planData), $mysqli);
        break;
    }




    default:
        $data['tag'] = "Action Code Error";
        break;
}

$data_json = json_encode($data);
echo $data_json;




//验证用户的合法性，仅部门经理可见各自部门的人力规划信息（目前部门系统尚未健全，部门经理表内的用户允许对所有员工信息进行访问）
function init($username, $mysqli)
{
    global $data;
    $sql = "SELECT `department_manager`.`uid` FROM `db_project`.`department_manager` LEFT JOIN `db_platform`.`user` ON `user`.`uid` = `department_manager`.`uid` WHERE `user`.`username` = '{$username}'";
    $rs_sql = $mysqli -> query($sql);
    if(mysqli_num_rows($rs_sql) > 0)
    {
        $data['tag'] = 'permit';
    }
    else
    {
        $data['tag'] = 'reject';
        $data_json = json_encode($data);
        echo $data_json;
        exit();
    }
}

//获取员工的基本信息
function get_staff_info($uid, $mysqli)
{
    global $data;
    $sql = "SELECT `uid`, `name`, `sex`, `tele`, `department`, `team`, `title`, `email`, `top` FROM `user` WHERE `uid` = '{$uid}'";
    $rs_sql = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($rs_sql))
    {
        $data['staff'] = $rs;
    }
    else
    {
        $data['tag'] = 'Get Staff Info Error';
    }
}

//获取员工近120天的人力规划表
function get_staff_manhour_plan($uid, $mysqli)
{
    global $data;
    $data['plan'] = array();
    $sql = "SELECT `manhour_planning`.`project_id`, `project`.`name` project_name, `manhour_planning`.`week`, `manhour_planning`.`timelong`, IFNULL(SUM(`manhour`.`d1` + `manhour`.`d2` + `manhour`.`d3` + `manhour`.`d4` + `manhour`.`d5` + `manhour`.`d6` + `manhour`.`d7`), 0) practice, `manhour_planning`.`plan` FROM `db_project`.`manhour_planning` LEFT JOIN `db_project`.`project` ON `manhour_planning`.`project_id` = `project`.`id` LEFT JOIN `db_project`.`manhour` ON (`manhour`.`project_id` = `manhour_planning`.`project_id` AND `manhour`.`developer` = `manhour_planning`.`developer`AND `manhour`.`isDraft` = 0 AND `manhour`.`week` >= `manhour_planning`.`week` AND `manhour`.`week` < date_add(`manhour_planning`.`week`, interval (`manhour_planning`.`timelong` * 7) day)) WHERE `manhour_planning`.`developer` = '{$uid}' AND TO_DAYS(NOW()) - TO_DAYS(`manhour_planning`.`week`) <= 120 GROUP BY `manhour_planning`.`project_id`, `manhour_planning`.`week` ORDER BY `manhour_planning`.`week` DESC";
//    echo $sql;
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data['plan'][] = $rs;
    }

//    if(!empty($data['plan']))
//    {
//        return $data['plan'][0]['week'];
//    }
//    else
//    {
//        return null;
//    }
}


//获取计划时间内员工的工时表
function get_manhour_info($uid, $plan_week, $mysqli)
{
    global $data;
    $data['manhour'] = array();
//    $sql = "SELECT `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note`, `manhour`.`isDraft` FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` LEFT JOIN `db_project`.`manhour_planning` ON (`manhour`.`project_id` = `manhour_planning`.`project_id` AND `manhour`.`developer` = `manhour_planning`.`developer` AND `manhour`.`week` >= `manhour_planning`.`week` AND `manhour`.`week` < date_add(`manhour_planning`.`week`, interval (`manhour_planning`.`timelong` * 7) day)) WHERE `manhour_planning`.`developer` = '{$uid}' AND `manhour_planning`.`week` = '{$plan_week}' AND `manhour`.`isDraft` = 0 ORDER BY `manhour`.`week` DESC";
    $sql = "SELECT `project`.`name` project_name, `manhour`.`project_id`, `manhour`.`week`, `manhour`.`d1`, `manhour`.`d2`, `manhour`.`d3`, `manhour`.`d4`, `manhour`.`d5`, `manhour`.`d6`, `manhour`.`d7`, `manhour`.`note`, `manhour`.`isDraft` FROM `db_project`.`manhour` LEFT JOIN `db_project`.`project` ON `manhour`.`project_id` = `project`.`id` LEFT JOIN `db_project`.`manhour_planning` ON (`manhour`.`developer` = `manhour_planning`.`developer` AND `manhour`.`week` >= `manhour_planning`.`week` AND `manhour`.`week` < date_add(`manhour_planning`.`week`, interval (`manhour_planning`.`timelong` * 7) day)) WHERE `manhour_planning`.`developer` = '{$uid}' AND `manhour_planning`.`week` = '{$plan_week}' AND `manhour`.`isDraft` = 0 GROUP BY `manhour`.`project_id`, `manhour`.`week` ORDER BY `manhour`.`week` DESC";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data['manhour'][] = $rs;
    }
}

function get_project_list($mysqli){
    global $data;
    $data['project'] = array();
    //查询所有项目，不包括默认项目
    $sql = "SELECT `project`.`id`, `project`.`name` FROM `db_project`.`project` WHERE (`project`.`state` = '开发中') GROUP BY `project`.`id` ORDER BY `project`.`id`";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data['project'][] = $rs;
    }
}

function create_plan($plans, $uid, $mysqli){
    global $data;
    $data['error'] = array();
    $week = $plans -> week;
    $timelong = $plans -> timelong;
//    print_r($plans -> plan);
    foreach($plans -> plan as $project_id => $plan){
        $sql = "INSERT INTO `db_project`.`manhour_planning` (`project_id`, `developer`, `week`, `timelong`, `plan`) VALUES ('{$project_id}', '{$uid}', '{$week}', '{$timelong}', '{$plan}')";
//        echo $sql;
        $mysqli -> query($sql);
        if(mysqli_affected_rows($mysqli) <= 0){
            $data['error'][] = $project_id;
        }
    }
}

//获取所有研发部员工的uid和name信息
function get_all_staff_sinfo($mysqli){
    global $data;
    $data['staffs'] = array();
    $sql = "SELECT `uid`, `name` FROM `db_platform`.`user` WHERE `department` = '研发部' ORDER BY `username`";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data['staffs'][] = $rs;
    }
}

//
function create_plans($planData, $mysqli)
{
    global $data;
    $data['error'] = array();
    $week = $planData -> week;
    $timelong = $planData -> timelong;
    foreach($planData -> plans as $project_id => $item){
        foreach($item as $uid => $plan){
            $sql = "INSERT INTO `db_project`.`manhour_planning` (`project_id`, `developer`, `week`, `timelong`, `plan`) VALUES ('{$project_id}', '{$uid}', '{$week}', '{$timelong}', '{$plan}')";
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0){
                $data['error'][] = $project_id;
            }
        }
    }
}























