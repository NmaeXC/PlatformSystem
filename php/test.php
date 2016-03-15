<?php
	
	ini_set('date.timezone','Asia/Shanghai');
	echo date("Ymd");
	echo "<br />";
	echo "111".sprintf("%04d", 2);
	echo "<br />";

		
	function foo(){
		static $lastDate = 1;
		echo $lastDate;
		$lastDate++;
		echo $lastDate;
	}

	foo();
	foo();
		
?>