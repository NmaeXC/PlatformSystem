<?php

	session_start();
	if(!isset($_SESSION["isLogin"]))
	{
		echo -2;

		exit();
	}

?>