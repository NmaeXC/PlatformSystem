<?php

	include 'comm.php';
	include 'conn.php';

	$newTele = $_POST["newTele"];
	$newEmail = $_POST["newEmail"];
	$newAvatar_src = $_POST["newAvatar"];
	$username = $_SESSION['username'];

	$rs_sql = $mysqli -> query("SELECT uid FROM user WHERE username = '{$username}'");
	if($rs = mysqli_fetch_array($rs_sql))
	{
		$uid = $rs["uid"];
	}
	else
	{
		echo "Get Info Error";
		exit();
	}


	if($newAvatar_src == null)
	{
		$sql = "UPDATE user SET tele = '{$newTele}', email = '{$newEmail}' WHERE username = '{$username}'";
		$mysqli -> query($sql);
		if(mysqli_affected_rows($mysqli) >= 0)
			echo "0";
		else
			echo "1";
	}
	else
	{
		$list = explode(",", $newAvatar_src);
		$newAvatar_header = $list[0];

		//确定文件的后缀名
		if($newAvatar_header == "data:image/png;base64")
		{
			$newAvatar_type = "png";
		}
		else if($newAvatar_header == "data:image/jpeg;base64")
		{
			$newAvatar_type = "jpg";
		}
		//提取bash64编码
		$newAvatar_bash64 = $list[1];
		//将bash64解析为图片并保存
		$newAvatar = base64_decode($newAvatar_bash64);
		$file_name = $uid."_avatar.".$newAvatar_type;
		$a = file_put_contents("..\\data\\avatar\\".$file_name, $newAvatar);//返回的是字节数
		if($a > 0 )
		{
			$sql = "UPDATE user SET tele = '{$newTele}', email = '{$newEmail}', img = '{$file_name}' WHERE username = '{$username}'";
			$mysqli -> query($sql);
			if(mysqli_affected_rows($mysqli) >= 0)
				echo "0";
			else
				echo "1";
		}
		else
		{
			echo "保存头像错误";
		}
	}



?>