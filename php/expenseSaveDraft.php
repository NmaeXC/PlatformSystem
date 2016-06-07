<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/3/17
 * Time: 16:42
 */

include "comm.php";
include "conn.php";

$username = $_SESSION["username"];

//确定受理人
$rs_sql = $mysqli -> query("SELECT name, top, uid FROM user WHERE username = '{$username}'");
if (mysqli_num_rows($rs_sql) > 0)
{
    $rs = mysqli_fetch_array($rs_sql);
    $uid = $rs["uid"];
    $top = $rs["top"];
    $name = $rs["name"];

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
    exit("User Info Error");
}

if(isset($_POST['submit']))
{
    //提交

    $id = $_POST['expenseID'];
    $today = date("Y-m-d");
    $sql = "UPDATE `db_platform`.`expense` SET `state` = '2', `submitDate` = '{$today}' WHERE `expense`.`number` = '{$id}'";
    $mysqli -> query($sql);

    if(mysqli_affected_rows($mysqli) <= 0)
    {
        exit("Submit Error");
    }
    else
    {
        //给受理人发送提醒邮件
        $sql_rs = $mysqli -> query("SELECT name, email from user WHERE uid = '{$top}'");
        if ($rs = mysqli_fetch_array($sql_rs))
        {
            $mailTo = $rs["email"];
            $acceptedName = $rs["name"];
            $subject = "报销单审核提醒（来自：".$name."）";
            $body = "尊敬的".$acceptedName."：\n    ".$name."(".$uid.")已经向您提交了一份报销单，请您尽快审核(点击进入审核页面http://10.0.0.2:880/PlatformSystem/pages/expense/expense_conform.html)。";
            mail($mailTo, $subject, $body);
        }
        else
        {
            echo "send Email Error";
        }

    }

    echo '0';
}
else
{

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
        exit("Get Info Error");
    }

    $expenseList = json_decode($_POST["expenseList"]);

    if(isset($expenseList))
    {
        //插入主表 expense
        $sql = "INSERT INTO expense (number, uid, accepted, submitDate, state) VALUES ('{$number}', '{$uid}', '{$accepted}', '" . date('Y-m-d') . "', '1')";
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
            $site = $value -> site;
            $attachment = $value -> attachment;
            $rs = $mysqli -> query("INSERT INTO expense_item (id, type, amount, remark, date, site, attachment) VALUES ('{$number}', '{$type}', '{$amount}', '{$remark}', '{$date}', '{$site}', '{$attachment}')");

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

    echo '0';

}

