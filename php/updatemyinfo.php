<?php

	include 'comm.php';
	include 'conn.php';

	$newTele = $_POST["newTele"];
	$newEmail = $_POST["newEmail"];

	// echo $_POST["newInfo['tele']"];

	$sql = "UPDATE user SET tele = '{$newTele}', email = '{$newEmail}' WHERE username = '{$_SESSION['username']}'";
	$mysqli -> query($sql);
	if(mysqli_affected_rows($mysqli) >= 0)
		echo "0";
	else
		echo "1";


?>