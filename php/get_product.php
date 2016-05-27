<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/10
 * Time: 16:58
 */

include "comm.php";
include "conn.php";

if(isset($_POST['key'])){
    $key = $_POST['key'];
    $sql = "SELECT disc, price FROM db_product.product_info WHERE id = '{$key}'";
    $rs_sql = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($rs_sql))
    {
        echo json_encode($rs);
    }
    else
    {
        echo "Get  Info Error";

    }
}
else
{
    $sql = "SELECT id FROM db_product.product_info ORDER BY id";
    $data = array();
    $x = 0;
    $rs_sql = $mysqli -> query($sql);
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data[$x] = $rs[0];
        ++$x;
    }

    echo json_encode($data);
}




