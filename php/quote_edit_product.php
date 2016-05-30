<?php
/**
 * Created by IntelliJ IDEA.
 * User: admin
 * Date: 2016/5/30
 * Time: 21:47
 */
include "comm.php";
include "conn.php";

$new_id = $_POST['']
$quote = $_POST['quote'];
if (isset($_POST['delete']))
{
    $sql = " WHERE `quote`.`id` = '{$quote}'";
}
else
{
    $sql = " WHERE `quote`.`id` = '{$quote}'";
}
$sql = " WHERE `quote`.`id` = '{$quote}'";
$mysqli -> query($sql);
if(mysqli_affected_rows($mysqli) <= 0)
{
    exit("Edit Quote's Product Error");
}

exit("0");