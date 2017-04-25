<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/11/2
 * Time: 10:41
 */

include "comm.php";
include "conn.php";

if(!$keyword = $_POST['keyword'])     //操作指令
{
    exit("Get Keyword Error");
}

if(!$type = $_GET['type'])     //类型
{
    exit("Get Type Error");
}


switch ($type)
{
    case 'customer':
        $keyword = "%".$_POST["keyword"]."%";
        $sql = "SELECT name title, CONCAT(id_0, id) id FROM `db_customer`.`customer_info` WHERE name LIKE '{$keyword}'";
        break;
    case 'product':
        $keyword = "%".$_POST["keyword"]."%";
        $sql = "SELECT disc title FROM `db_product`.`product_info` WHERE disc LIKE '{$keyword}' OR id LIKE '{$keyword}'";
        break;
    case 'contact':

        break;
    case 'staff':
        $keyword = "%".$keyword."%";
        $sql = "SELECT `name` title, `uid` id FROM `db_platform`.`user` WHERE `name` LIKE '{$keyword}' OR `uid` LIKE '{$keyword}' OR `username` LIKE '{$keyword}'";
        break;



    default:
        $sql = "";
        break;
}

//echo $sql;
$rs_sql = $mysqli -> query($sql);
$data = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    $data[] = $rs;
}

$data_json = json_encode($data);
echo $data_json;