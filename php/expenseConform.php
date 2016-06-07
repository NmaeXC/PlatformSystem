<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/3/22
 * Time: 16:23
 */

include "comm.php";
include "conn.php";


if(isset($_POST["init"]))
{
    //初始化页面
    $username = $_SESSION["username"];

    $sql = "SELECT number, c_u.name, submitDate, expense.state FROM expense LEFT JOIN user s_u ON accepted = s_u.uid LEFT JOIN user c_u ON c_u.uid = expense.uid WHERE state != 1 AND s_u.username = '{$username}'";
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
else if (isset($_POST["detailNumber"]))
{
    //返回该条请假单的详细信息
    $expenseId = $_POST['detailNumber'];
    $data = array();
    $sql = "SELECT user.name, user.department, user.uid, user.title FROM expense, user WHERE expense.number = '{$expenseId}' AND user.uid = expense.uid";
    $rs_sql = $mysqli -> query($sql);
    if($rs = mysqli_fetch_array($rs_sql))
    {
        $data["name"] = $rs["name"];
        $data["department"] = $rs["department"];
        $data["uid"] = $rs["uid"];
        $data["title"] = $rs["title"];
    }

    $sql = "SELECT expense_item_type.value, expense_item.amount, expense_item.remark, expense_item.date, expense_item.attachment FROM expense_item, expense_item_type, expense WHERE expense_item.id = '{$expenseId}' AND expense_item_type.id = expense_item.type AND expense.number = expense_item.id";
    $rs_sql = $mysqli -> query($sql);
    $x = 0;
    while($rs = mysqli_fetch_array($rs_sql))
    {
        $data[$x] = $rs;
        $x ++;
    }
    $data["sum"] = $x;
    $data_json = json_encode($data);

    echo $data_json;
}
else
{
    //审核报销

    $type = $_POST["type"];
    $conformed = json_decode($_POST["conformed"]);
    $ret = array();
    if($type == "agree")
    {
        foreach ($conformed as $value) {
            $mysqli -> query("UPDATE expense SET state = 3 WHERE number = '{$value}' AND state = 2");
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                $ret[] = $value;
            }
        }

    }
    else
    {
        foreach ($conformed as $value) {
            $mysqli -> query("UPDATE expense SET state = 4 WHERE number = '{$value}' AND state = 2");
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                $ret[] = $value;
            }
            else
            {
                //驳回后向用户发送提请邮件
                $sql_rs = $mysqli -> query("SELECT submitUser.name submitName, submitUser.email submitEmail, acceptedUser.name acceptedName from user submitUser, expense, user acceptedUser WHERE submitUser.uid = expense.uid AND acceptedUser.uid = expense.accepted AND expense.number = '{$value}'");
                if ($rs = mysqli_fetch_array($sql_rs))
                {
                    $mailTo = $rs["submitEmail"];
                    $acceptedName = $rs["acceptedName"];
                    $submitName = $rs["submitName"];
                    $subject = "报销单驳回提醒（来自：".$acceptedName.":".$_POST["rejectInfo"]."）";
                    $body = "尊敬的".$submitName."：\n    您提交的报销单(".$value.")未能通过审核。(点击进入个人历史记录查看  http://10.0.0.2:880/PlatformSystem/pages/expense/expense_history.html)。";
                    mail($mailTo, $subject, $body);
                }
                else
                {
                    echo "send Email Error";
                }
            }

        }


    }

    $ret_json = json_encode($ret);
    echo $ret_json;

}