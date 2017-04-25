<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2017/1/11
 * Time: 10:40
 * disc: 检测所有项目的进度，当项目投入的时间超出了预计的时间，向项目负责人和所有的参与人员发送提示邮件
 */

include 'conn.php';


$sql = "SELECT project_alert.project_id, project_alert.level FROM db_project.project_alert WHERE project_alert.i = 0";
$rs_sql = $mysqli -> query($sql);
$overtime_list = array();
while($rs = mysqli_fetch_array($rs_sql))
{
    project_alert_email($rs['project_id'], $rs['level']);
}

$sql = "UPDATE db_project.project_alert SET project_alert.i = (project_alert.i + project_alert.cycle - 1) % project_alert.cycle";
$mysqli -> query($sql);

function project_alert_email($project_id, $level)
{

    global $mysqli;
    $sql = "SELECT project.name project_name, project.man_hours, project.charge, user.email charge_email, user.name charge_name FROM db_project.project LEFT JOIN db_platform.user ON user.uid = project.charge WHERE project.id = '{$project_id}'";
    $rs_sql = $mysqli -> query($sql);
    if ($data = mysqli_fetch_array($rs_sql))
    {
        $mailTo = $data['charge_email'];
        $project_name = $data['project_name'];
        switch(intval($level))
        {
            case 1:
                $subject = "项目80%提醒-".$project_name;
                $body = "尊敬的".$data['charge_name']."，您负责的项目（".$project_name."-".$project_id."）工时进度已超过80%。";
                break;
            case 2:
                $subject = "项目超时提醒-".$project_name;
                $body = "尊敬的".$data['charge_name']."，您负责的项目（".$project_name."-".$project_id."）工时进度已超出预算！";
                break;
            default:
                exit('level error');
        }
//        echo "mailTo: $mailTo\nsubject: $subject\nbody: $body";
        mail($mailTo, $subject, $body);

        $sql = "SELECT project_developer.developer uid, user.name, user.email FROM db_project.project_developer LEFT JOIN db_platform.user ON user.uid = project_developer.developer WHERE project_developer.project_id = '{$project_id}'";
        $rs_sql = $mysqli -> query($sql);
        while ($developer = mysqli_fetch_array($rs_sql))
        {
            $mailTo = $developer['email'];
            switch(intval($level))
            {
                case 1:
                    $subject = "项目80%提醒-".$project_name;
                    $body = "尊敬的".$developer['name']."，您参与的项目（".$project_name."-".$project_id."）工时进度已超过80%。";
                    break;
                case 2:
                    $subject = "项目超时提醒-".$project_name;
                    $body = "尊敬的".$developer['name']."，您参与的项目（".$project_name."-".$project_id."）工时进度已超出预算！";
                    break;
                default:
                    exit('level error');
            }
//            echo "mailTo: $mailTo\nsubject: $subject\nbody: $body";
            mail($mailTo, $subject, $body);
        }
    }
    else
    {
        exit('no data');
    }
}

