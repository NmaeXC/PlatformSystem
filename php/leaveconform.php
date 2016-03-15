<?php

	include "comm.php";
	include "conn.php";

	if(isset($_POST["conformedleave"]))
	{
		//将待审核的请假条发送给前端
		$username = $_SESSION["username"];

		$sql = "SELECT number, user.name, startTime, endTime, reason, attachment, remark, submitDate, user.username, state FROM leavenote LEFT JOIN user ON accepted = user.uid WHERE state = '未处理' AND user.username = '{$username}'";		
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
	else
	{
		//处理已审核的记录
		$type = $_POST["type"];
		$ret = array();
		if($type == "agree")
		{
			foreach ($_POST["conformed"] as $value) {
				$mysqli -> query("UPDATE leavenote SET state = '同意' WHERE number = '{$value}'");
				if(mysqli_affected_rows($mysqli) <= 0)
				{
					$ret[] = $value;
				}
			}
			
		}
		else
		{
			foreach ($_POST["conformed"] as $value) {
				$mysqli -> query("UPDATE leavenote SET state = '驳回' WHERE number = '{$value}'");
				if(mysqli_affected_rows($mysqli) <= 0)
				{
					$ret[] = $value;
				}
			}
		}

		$ret_json = json_encode($ret);
		echo $ret_json;
	}

?>