<?php

    include "comm.php";
    include "conn.php";

    $username = $_SESSION["username"];

    //确定受理人
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

    //生成单号
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

    $expenseList = json_decode($_POST["expenseList"]);

    if(isset($expenseList))
    {
        //插入主表 expense
        $sql = "INSERT INTO expense (number, uid, accepted, submitDate, state) VALUES ('{$number}', '{$uid}', '{$accepted}', '" . date('Y-m-d') . "', '2')";
        $rs = $mysqli -> query($sql);

        if(mysqli_affected_rows($mysqli) <= 0)
        {
            exit("INSERT INTO expense Error");
        }

        //插入条目
        foreach ($expenseList as $value)
        {
            $type = $value -> type;
            $amount = $value -> amount;
            $remark = $value -> remark;
            $date = $value -> date;
            $attachment = $value -> attachment;
            $rs = $mysqli -> query("INSERT INTO expense_item (id, type, amount, remark, date, attachment) VALUES ('{$number}', '{$type}', '{$amount}', '{$remark}', '{$date}', '{$attachment}')");


            if(mysqli_affected_rows($mysqli) <= 0)
            {
                exit("INSERT INTO expense_item Error");
            }

        }
    }
    else
    {
        exit("Error");
    }

    echo 0;

?>