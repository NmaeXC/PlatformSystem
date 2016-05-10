<?php

	include "comm.php";

	if (isset($_POST["reason"])) {
		
		include "conn.php";

		// print_r($_FILES["LeaveFile"]);

		$startTime = $_POST["startTime"];
		$endTime = $_POST["endTime"];
		$reason = $_POST["reason"];
		$remark = $_POST["remark"];

		$username = $_SESSION["username"];
		$name = $_SESSION["sn"].$_SESSION["givenname"];

		$idHeader = date("Y")."0".ceil(date("m")/3);
		$sql = "select max(id) from leavenote";
		$sql_rs = $mysqli -> query($sql);
		if($rs = mysqli_fetch_array($sql_rs))
		{
			$idFooter = sprintf("%04d", ($rs[0] + 1));//生成4位数，不足前面补0 
			$number = $idHeader.$idFooter;
		}
		else
		{
			echo "Get Info Error";
			exit();
		}

		$days=abs((strtotime($endTime)-strtotime($startTime))/86400);
		

		$rs_sql = $mysqli -> query("SELECT top, uid FROM user WHERE username = '{$username}'");
		if (mysqli_num_rows($rs_sql) > 0) 
		{
			$rs = mysqli_fetch_array($rs_sql);
			$uid = $rs["uid"];
			$accepted = $uid;
			if (($top = $rs["top"])!= null) 
			{
				if($days <= 2)
				{
					$accepted = $top;
				}
				else 
				{
					$rs_sql = $mysqli -> query("SELECT top, uid FROM user WHERE username = '{$top}'");
					if(mysqli_num_rows($rs_sql) > 0)
					{
						$rs = mysqli_fetch_array($rs_sql);
						$accepted = $top;
						if (($topTop = $rs["top"])!= null)
						{
							if($days <= 5)
							{
								$accepted = $topTop;
							}
							else
							{
								$rs_sql = $mysqli -> query("SELECT top, uid FROM user WHERE username = '{$topTop}'");
								if (mysqli_num_rows($rs_sql) > 0) 
								{
									$rs = mysqli_fetch_array($rs_sql);
									if (($topTopTop = $rs["top"])!= null) 
									{
										$accepted = $topTopTop;
									}
								}
								else
								{
									echo "User's Top's Top Info Error";
								}
							}
						}
					}
					else
					{
						echo "User's Top Info Error";
					}

				}
			}
		}
		else
		{
			echo "User Info Error";
		}


		if (isset($_FILES["LeaveFile"]))
		{
			$accessory_error = $_FILES["LeaveFile"]["error"];
			$accessory_type = $_FILES["LeaveFile"]["type"];
			// echo "type:".$accessory_type."<br/>";
			$accessory_size = $_FILES["LeaveFile"]["size"];
			$accessory_tmp_name = $_FILES["LeaveFile"]["tmp_name"];
			$accessory_name = $_FILES["LeaveFile"]["name"];
			if($accessory_error > 0)
			{
				echo -1; //文件上传失败
				exit();
			}
			// $accessory_fp = fopen($accessory_tmp_name, 'r');
			// $accessory_content = fread($accessory_fp, $accessory_size);
			// fclose($accessory_fp);
			// echo $accessory;

			// $accessory_content = addslashes($accessory_content);

			//检测上传文件
			if($accessory_type != 'image/png' && $accessory_type != 'image/jpeg')
			{
				echo "File Type Error";
				exit();
			}
			if ($accessory_size > 8 * 1024 * 1024) {
				echo "File Size Error";
				exit();
			}
			$file_name = $number.".".pathinfo($accessory_name)["extension"];
			move_uploaded_file($accessory_tmp_name, "..\\data\\leavenote\\".$file_name);
		}
		else
		{
			$file_name = null;
		}
		

		// echo date('Y-m-d');

		$sql = "INSERT INTO leavenote (number, uid, name, startTime, endTime, reason, attachment, remark, accepted, submitDate, state) VALUES ('{$number}', '{$uid}', '{$name}', '{$startTime}', '{$endTime}', '{$reason}', '{$file_name}', '{$remark}','{$accepted}','" . date('Y-m-d') . "','未处理')";
		// echo $sql;
		$rs = $mysqli -> query($sql);


		if(mysqli_affected_rows($mysqli) > 0)
			echo "0";
		else

			echo "1";
	}

?>