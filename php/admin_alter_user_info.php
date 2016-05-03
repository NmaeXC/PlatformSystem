<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2016/4/19
 * Time: 16:22
 */

include 'comm.php';
include 'conn.php';

if(isset($_POST['uidAlter']))
{
    $newName = $_POST['nameAlter'];
    $newTitle = $_POST['titleAlter'];
    $newUid = $_POST['uidAlter'];
    $newTele = $_POST['teleAlter'];
    $newSex = $_POST['sexAlter'];
    $newEmail = $_POST['emailAlter'];
    $newDepartment = $_POST['departmentAlter'];
    $newDate = $_POST['dateAlter'];
    $newTeam = $_POST['teamAlter'];
    $newTop = $_POST['topAlter'];

    $sql = "UPDATE user SET name = '{$newName}', title = '{$newTitle}', tele = '{$newTele}', sex = '{$newSex}',  email = '{$newEmail}', department = '{$newDepartment}', date = '{$newDate}', team = '{$newTeam}', top = '{$newTop}' WHERE uid = '{$newUid}'";
//    echo $sql;
    $mysqli -> query($sql);
    if(mysqli_affected_rows($mysqli) >= 0)
        echo 0;
    else
        exit("No Update");
}
else
{
    exit("Get Request Error");
}