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
				//确定与工作时间相交的时间区间
				$start = split("[- :]",$data1['startTime']);
				$end = split("[- :]",$data1['endTime']);
				$m1 = intval($start[3]) * 60 + intval($start[4]);
				$m2 = intval($end[3]) * 60 + intval($end[4]);

				if ($m1 <= (8 * 60 + 30)){
					$m1 = 0;
				}else if ($m1 >= (12 * 60) && $m1 <= (13 * 60 + 30)){
					$m1 = 3.5;
				}else if($m1 <= (12 * 60)){
					$m1 = ($m1 - (8 * 60 + 30)) / 60;
				}else if($m1 >= 18 * 60){
					$m1 = 8;
				}else{
					$m1 = ($m1 - (8 * 60 + 30) - (1.5 * 60)) / 60;
				}

				if ($m2 <= (8 * 60 + 30)){
					$m2 = 0;
				}else if ($m2 >= (12 * 60) && $m2 <= (13 * 60 + 30)){
					$m2 = 3.5;
				}else if($m2 <= (12 * 60)){
					$m2 = ($m2 - (8 * 60 + 30)) / 60;
				}else if($m2 >= 18 * 60){
					$m2 = 8;
				}else{
					$m2 = ($m2 - (8 * 60 + 30) - (1.5 * 60)) / 60;
				}

				$t = ($m2 - $m1) < 0? ($m2 - $m1 + 8) : ($m2 - $m1);
				$d = floor((strtotime($data1['endTime']) - strtotime($data1['startTime'])) / (60 * 60 * 24)) * 8;


				$data =  $data1 + Array('acceptedName' => $data2[0], 'leavetime' => $t + $d);
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