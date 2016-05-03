<?php
	session_start();

	if (!isset($_POST['username'])) {
		exit('Illegal access !');
	}
	$username = htmlspecialchars($_POST['username']);
	$password = $_POST['password'];
	// echo $username;

	// echo "$username";
	// echo "$password";

	//�������ݿ�
	// include "conn.php";

	//����AD�������
	$host = "ldap://10.0.0.2";
 	$port = 389;
	
 	//���ӵ�LDAP������
	$ldapconn = ldap_connect($host, $port)
          or die("Could not connect to $ldaphost");
	
	//����ʹ�ð汾3
	ldap_set_option($ldapconn, LDAP_OPT_PROTOCOL_VERSION, 3);
	//ʹ��start TLS��ȫͨ�Ż���
	// ldap_start_tls($ldapconn);


	//��
	if(!@ldap_bind($ldapconn, "SYNTHFLEX\\".$username, $password))
	{
		echo -1;
		exit();
	}

	//��ȡLDAP����
	$result_ldap = ldap_search($ldapconn, "cn=USERS, dc=synthflex, dc=com", "(samaccountname=$username)", array('sn','givenname'));

	// echo "result_ldap".$result_ldap;
	// echo "<br />";
	
	//ͳ������ȡ����
	// echo $count = ldap_count_entries($ldapconn, $result_ldap);

	// echo "<br />";

	//�����صĶ�����	
	$result = ldap_get_entries($ldapconn, $result_ldap);
	// print_r($result);
	// echo $result[0]['displayname'][0];

	$_SESSION['sn'] = $result[0]['sn'][0];
	$_SESSION['givenname'] = $result[0]['givenname'][0];
	$_SESSION['username'] = $username;
//	$_SESSION['password'] = $password;
	$_SESSION['isLogin'] = 0;

	echo 0;



	// $cheak_query = $mysqli -> query("select uid, name from worker where username = '$username' and password = '$password'");
	// if($rs = @mysqli_fetch_array($cheak_query))
	// {
	// 	//��¼�ɹ�
	// 	$_SESSION["name"] = $rs["name"];
	// 	$_SESSION["uid"] = $rs["uid"];
	// 	$_SESSION["isLogin"] = 0;

	// 	echo "0";
	// }
	// else
	// {
	// 	echo "-1";
	// }

?>