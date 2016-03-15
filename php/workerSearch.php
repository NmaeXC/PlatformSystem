<?php
	// $SearchText = "小明";
	// echo $SearchText;
	include "comm.php";
	if(isset($_GET["SearchText"]))
	{

		header("Content-type: text; charset=utf-8");
		include "conn.php";

		$SearchText = trim($_GET["SearchText"]);
		
		$sql = "SELECT name, uid, tele, sex, email, date, department, team, title FROM user WHERE name = '$SearchText'";


		$rs_sql = $mysqli -> query($sql);
		if (mysqli_num_rows($rs_sql) == 0)
		{
		    $data = "";
		}
		else
		{
		    $rs = mysqli_fetch_array($rs_sql);
		    $data = array(
            				"name" => $rs["name"],
            				"uid" => $rs["uid"],
            				"tele" => $rs["tele"],
            				"sex" => $rs["sex"],
            				"email" => $rs["email"],
            				"date" => $rs["date"],
            				"department" => $rs["department"],
            				"team" => $rs["team"],
            				"title" => $rs["title"]
            				);
		}

		$json_data = json_encode($data);
		echo $json_data;
		

		
	}
		

?>
