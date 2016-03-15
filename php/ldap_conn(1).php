<?php

 	$host = "ldap://10.0.0.2";
 	$port = 389;

 	//连接到LDAP服务器
	if(!$connection = ldap_connect($host, $port))
	{
		echo 1;
		exit();
	}
	//声明使用版本3
	ldap_set_option($connection, LDAP_OPT_PROTOCOL_VERSION, 3);
	//使用start TLS安全通信机制
	// ldap_start_tls($connection);

	//绑定
	if(!ldap_bind($connection, "SYNTHFLEX\\".$_SESSION['username'], $_SESSION['password']))
	{
		echo -1;
		exit();
	}
?>