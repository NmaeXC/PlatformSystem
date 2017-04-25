<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/10/30
 * Time: 11:35
 */

include "comm.php";
include "conn.php";

if(!$type = $_POST['type'])
{
    exit("Get Type Error");
}
if(!$value = $_POST['value'])
{
    exit("Get Value Error");
}

switch ($type){
    case 'project_name':
        $sql = "SELECT `project`.`id` FROM `db_project`.`project` WHERE `project`.`name` = '{$value}'";
        $rs_sql = $mysqli -> query($sql);
        echo mysqli_num_rows($rs_sql);
        break;




    default:
        break;
}