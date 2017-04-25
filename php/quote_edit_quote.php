<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/5/27
 * Time: 17:50
 */

include "comm.php";
include "conn.php";

$validity_start = $_POST["validity"][0];
$validity_end = $_POST["validity"][1];
$currency = $_POST['c'];
$quote = $_POST['quote'];

$sql = "UPDATE `db_platform`.`quote` SET `validity_start` = '{$validity_start}', `validity_end` = '{$validity_end}', `currency` = '{$currency}' WHERE `quote`.`id` = '{$quote}'";

$mysqli -> query($sql);
if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit Quote's Quote Error");
}

exit("0");
