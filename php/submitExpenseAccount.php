<?php

    include "comm.php";
    include "conn.php";

    if(!$type = $_POST["expenseType"])
    {
        exit("Error");
    }
    $amount = $_POST["expenseAmount"];
    $remark = $_POST["expenseRemark"];

    $username = $_SESSION["username"];

    $idHeader = date("Y")."0".ceil(date("m")/3);
    $sql = "select max(id) from expense";
    $sql_rs = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($sql_rs))
    {
        $idFooter = sprintf("%04d", ($rs[0] + 1));//生成4位数，不足前面补0
        $number = $idHeader.$idFooter;
    }
    else
    {
        echo "Get Info Error";
        exit();
    }

    $rs_sql = $mysqli -> query("SELECT top, uid FROM user WHERE username = '{$username}'");
    if (mysqli_num_rows($rs_sql) > 0)
    {
        $rs = mysqli_fetch_array($rs_sql);
        $uid = $rs["uid"];
        $top = $rs["top"];

        if($top == null)
        {
            $accepted = $uid;
        }
        else
        {
            $accepted = $top;
        }

    }
    else
    {
        echo "User Info Error";
    }

    $sql = "INSERT INTO expense (number, uid, type, amount, remark, accepted, submitDate, state) VALUES ('{$number}', '{$uid}', '{$type}', '{$amount}', '{$remark}', '{$accepted}', '" . date('Y-m-d') . "','未处理')";
    $rs = $mysqli -> query($sql);

    if(mysqli_affected_rows($mysqli) > 0)
        echo "0";
    else
        echo "1";




?>