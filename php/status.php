<?php
	// ottiene lo stato corrente della sessione
	session_start();

	if(isset($_SESSION["username"])) {
		echo json_encode(["username" => $_SESSION["username"]]);
	} else {
		echo json_encode("nologin");
	}
?>
