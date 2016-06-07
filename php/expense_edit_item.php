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
if (isset($_POST['delete']))
{
    //删除
    $old_date = $_POST['odate'];
    $old_site = $_POST['osite'];
    $old_type = $_POST['otype'];
    $old_amount = $_POST['oamount'];
    $old_attachment = $_POST['oattachment'];
    $old_remark = $_POST['oremark'];
    $sql = "DELETE FROM `db_platform`.`expense_item` WHERE `id` = '{$id}' AND `type` = '{$old_type}' AND `amount` = '{$old_amount}' AND `remark` = '{$old_remark}' AND `date` = '{$old_date}' AND `site` = '{$old_site}' AND `attachment` = '{$old_attachment}'";
}
else
{
    $new_date = $_POST['date'];
    $new_site = $_POST['site'];
    $new_type = $_POST['type'];
    $new_amount = $_POST['amount'];
    $new_attachment = $_POST['attachment'];
    $new_remark = $_POST['remark'];

    if(isset($_POST['add']))
    {
        //添加
        $sql = "INSERT INTO expense_item (`id`, `type`, `amount`, `remark`, `date`, `site`, `attachment`) VALUES ('{$id}', '{$new_type}', '{$new_amount}', '{$new_remark}', '{$new_date}', '{$new_site}', '{$new_attachment}')";
    }
    else
    {
        //编辑
        $id = $_POST['expenseID'];
        $old_date = $_POST['odate'];
        $old_site = $_POST['osite'];
        $old_type = $_POST['otype'];
        $old_amount = $_POST['oamount'];
        $old_attachment = $_POST['oattachment'];
        $old_remark = $_POST['oremark'];
        $sql = "UPDATE `db_platform`.`expense_item` SET `type` = '{$new_type}', `amount` = '{$new_amount}', `remark` = '{$new_remark}', `date` = '{$new_date}', `site` = '{$new_site}', `attachment` = '{$new_attachment}' WHERE `id` = '{$id}' AND `type` = '{$old_type}' AND `amount` = '{$old_amount}' AND `remark` = '{$old_remark}' AND `date` = '{$old_date}' AND `site` = '{$old_site}' AND `attachment` = '{$old_attachment}'";

    }
}

$mysqli -> query($sql);
if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit Expense's Item Error");
}

exit("0");