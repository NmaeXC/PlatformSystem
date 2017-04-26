<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/6/3
 * Time: 15:49
 */

include "comm.php";
include "conn.php";

$id = $_POST['expenseID'];

if (isset($_POST['action']))
{
    $action = $_POST['action'];
    switch ($action)
    {
        case 'reedit':
            $sql = "UPDATE `db_platform`.`expense` SET `expense`.`state` = '1' WHERE `expense`.`number` = '{$id}' AND `expense`.`state` = '4'";
//            echo $sql;
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                exit("Reedit Expense Error");
            }
            break;
        default:
            exit("Unrecognized Action Code");
    }
    echo '0';

    exit();
}

if (isset($_POST['delete_only']))
{
    //删除
    $old_date = $_POST['odate'];
    $old_site = $_POST['osite'];
    $old_type = $_POST['otype'];
    $old_amount = $_POST['oamount'];
    $old_attachment = $_POST['oattachment'];
    $old_remark = $_POST['oremark'];
    $sql = "DELETE FROM `db_platform`.`expense_item` WHERE `id` = '{$id}' AND `type` = '{$old_type}' AND `remark` = '{$old_remark}' AND `date` = '{$old_date}' AND `site` = '{$old_site}' AND `attachment` = '{$old_attachment}'";
    //echo $sql;
    $mysqli -> query($sql);
    if(mysqli_affected_rows($mysqli) <= 0)
    {
        exit("DELETE Expense's Item Error");
    }
}
else
{
    if (isset($_POST['edit']))
    {
        $edit_list = json_decode($_POST['edit']);
        foreach($edit_list as $val)
        {
            $old_date = $val ->item -> date;
            $old_site = $val ->item -> site;
            $old_type = $val ->item -> type_id;
            $old_amount = $val ->item -> amount;
            $old_attachment = $val ->item -> attachment;
            $old_remark = $val ->item -> remark;

            $new_date = $val ->_item -> date;
            $new_site = $val ->_item -> site;
            $new_type = $val ->_item -> type_id;
            $new_amount = $val ->_item -> amount;
            $new_attachment = $val ->_item -> attachment;
            $new_remark = $val ->_item -> remark;

            $sql = "UPDATE `db_platform`.`expense_item` SET `type` = '{$new_type}', `amount` = '{$new_amount}', `remark` = '{$new_remark}', `date` = '{$new_date}', `site` = '{$new_site}', `attachment` = '{$new_attachment}' WHERE `id` = '{$id}' AND `type` = '{$old_type}' AND `remark` = '{$old_remark}' AND `date` = '{$old_date}' AND `site` = '{$old_site}' AND `attachment` = '{$old_attachment}'";
            $mysqli -> query($sql);
        }
    }

    if (isset($_POST['add']))
    {
        $add_list = json_decode($_POST['add']);
        foreach($add_list as $val)
        {
            $new_date = $val -> date;
            $new_site = $val -> site;
            $new_type = $val -> type_id;
            $new_amount = $val -> amount;
            $new_attachment = $val -> attachment;
            $new_remark = $val -> remark;

            $sql = "INSERT INTO expense_item (`id`, `type`, `amount`, `remark`, `date`, `site`, `attachment`) VALUES ('{$id}', '{$new_type}', '{$new_amount}', '{$new_remark}', '{$new_date}', '{$new_site}', '{$new_attachment}')";
            $mysqli -> query($sql);
            if(mysqli_affected_rows($mysqli) <= 0)
            {
                exit("Edit Expense's Item Error");
            }
        }
    }

    if (isset($_POST['delete']))
    {
        $delete_list = json_decode($_POST['delete']);
        foreach($delete_list as $val)
        {
            $old_date = $val -> date;
            $old_site = $val -> site;
            $old_type = $val-> type_id;
            $old_amount = $val -> amount;
            $old_attachment = $val -> attachment;
            $old_remark = $val -> remark;
            $sql = "DELETE FROM `db_platform`.`expense_item` WHERE `id` = '{$id}' AND `type` = '{$old_type}' AND `remark` = '{$old_remark}' AND `date` = '{$old_date}' AND `site` = '{$old_site}' AND `attachment` = '{$old_attachment}'";
            $mysqli -> query($sql);
        }
    }
}

exit("0");