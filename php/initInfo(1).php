<?php
	include 'comm.php';
	include 'conn.php';

	$name = $_POST["name"];
	$sex = $_POST["sex"];
	$uid = $_POST["uid"];
	$department = $_POST["department"];
	$team = $_POST["team"];
	$title = $_POST["title"];
	$tele = $_POST["tele"];
	$email = $_POST["email"];

	$sql = "UPDATE user SET name = '{$name}', sex = '{$sex}', uid = '{$uid}', department = '{$department}', team = '{$team}', title = '{$title}', tele = '{$tele}', email = '{$email}' WHERE username = '{$_SESSION['username']}'";

	$mysqli -> query($sql);
	if(mysqli_affected_rows($mysqli) >= 0)
		echo "0";
	else
		echo "1";



?>