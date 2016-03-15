<?php


	include "comm.php";
	if(isset($_SESSION["username"]))
	{

		include "conn.php";

		//从数据库获取信息
		$username = $_SESSION["username"];
		$sql = "SELECT username, name, tele, sex, email, date, department, team, title, top, uid FROM user WHERE username = '$username'";
		$rs_sql = $mysqli -> query($sql);
		// echo mysqli_num_rows($rs_sql);
		if (mysqli_num_rows($rs_sql) == 0)
		{
			//初始化用户，新建用户记录
			$time = date("Y-m-d");
			// echo $time;
			$sql = "INSERT INTO user (username, date) VALUES ('{$username}', '{$time}')";
			// echo $sql;
			$rs_sql = $mysqli -> query($sql);
			if(mysqli_affected_rows($mysqli) <= 0)
			{
				echo -3;
				exit();	
			}
			$sql = "SELECT username, date FROM user WHERE username = '$username'";
			$rs_sql = $mysqli -> query($sql);
			$result = mysqli_fetch_array($rs_sql);
			$num =  mysqli_num_rows($rs_sql);

			if($num > 0)
			{
				$data = array(
					"init" => true,
					"username" => $result["username"],
					"date" => $result["date"]
					);	
			}
		}
		else
		{
			
			$result = mysqli_fetch_array($rs_sql);
			$data = array(
				"username" => $result["username"],
				"givenname" => $_SESSION["givenname"],
				"name" => $result["name"],
				"uid" => $result["uid"],
				"tele" => $result["tele"],
				"sex" => $result["sex"],
				"email" => $result["email"],
				"date" => $result["date"],
				"department" => $result["department"],
				"team" => $result["team"],
				"title" => $result["title"],
				"top" => $result["top"]
				);
		}
		

		$json_data = json_encode($data);
		echo $json_data;
	}

?>