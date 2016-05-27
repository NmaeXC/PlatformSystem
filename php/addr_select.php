<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/17
 * Time: 15:42
 */

include "comm.php";
include "conn.php";

$data = array();
if(isset($_POST['province']))
{
    //城市信息
    $province = $_POST['province']."%";
    $sql = "SELECT * FROM db_addr.city WHERE id LIKE '{$province}' ORDER BY id";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        array_push($data, $rs);
    }
}
elseif(isset($_POST['area']))
{
    //省（直辖市，自治区）信息
    $area = $_POST['area']."%";
    $sql = "SELECT * FROM db_addr.province WHERE id LIKE '{$area}' ORDER BY id";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        array_push($data, $rs);
    }
}
else
{
    //区域信息
    $sql = "SELECT * FROM db_addr.area ORDER BY id";
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        array_push($data, $rs);
    }
}

echo json_encode($data);