<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/15
 * Time: 11:20
 */

include 'comm.php';
include 'conn.php';



if(isset($_POST["action"]))
{
    $action = $_POST["action"];
    $para = $_POST["para"];
    switch ($action){
        case "showMemberList":
            showMemberList($para, $mysqli);
            break;
        case "showMemberInfo":
            showMemberInfo($para, $mysqli);
            break;
        default:
            break;
    }
}
else
{
    exit('Get Request Error');
}


function showMemberList($searchInfo, $mysqli){
    $sql = "SELECT name, uid FROM user WHERE name LIKE '%".$searchInfo."%' OR uid LIKE '%".$searchInfo."%' OR username LIKE '%".$searchInfo."%' ";
    $rs_sql = $mysqli -> query($sql);
    $data = array();
    $x = 0;
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data[$x] = $rs;
        $x++;
    }
    $data['sum'] = $x;
    $data_json = json_encode($data);
    echo $data_json;
}

function showMemberInfo($uid, $mysqli){
    $sql = "SELECT name, title, uid, tele, sex, email, department, date, team, top FROM user WHERE uid = '{$uid}'";
    $rs_sql = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($rs_sql))
    {
        $data = $rs;
    }
    $data_json = json_encode($data);
    echo $data_json;
}
