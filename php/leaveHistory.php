<?php

	include "comm.php";
	include "conn.php";
	$username = $_SESSION["username"];

	$sql = "SELECT uid FROM user WHERE username = '{$username}'";
		$rs_sql = $mysqli -> query($sql);
		if($rs = $rs = mysqli_fetch_array($rs_sql))
		{
			$uid = $rs[0];
		}
		else
		{
			echo "Get User Info Error";
		}

	if (isset($_POST['number'])) {
		$leavenoteId = $_POST['number'];
		//返回该条请假单的详细信息
		$sql = "SELECT number, startTime, endTime, reason, attachment, remark, accepted, submitDate, state FROM leavenote WHERE number = '{$leavenoteId}'";
		$rs_sql = $mysqli -> query($sql);
		if($data1 = mysqli_fetch_array($rs_sql))
		{
			$accepted = $data1["accepted"];
			$sql = "SELECT name FROM user WHERE uid = '{$accepted}'";
			$rs_sql = $mysqli -> query($sql);
			if ($data2 = mysqli_fetch_array($rs_sql))
			{
				$data =  $data1 + Array('acceptedName' => $data2[0]);
				$data_json = json_encode($data);
				echo $data_json;
			}
		}
		else{
			echo "-1";
		}
	}
	else{
		//返回该用户请假单历史纪录
		$sql = "SELECT number, startTime, endTime, reason, state FROM leavenote WHERE uid = '{$uid}' ORDER BY id DESC";
		$rs_sql = $mysqli -> query($sql);
	
		$data = array();
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

	


?>