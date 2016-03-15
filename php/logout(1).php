<?php

	include "comm.php";

	// $name = $_SESSION["givenname"];

	// $_SESSION=array();

	if(isset($_SESSION[session_name()])){
		setcookie(session_name(), '', time() - 60, '/');
	}

	session_destroy();

	echo 0;


?>