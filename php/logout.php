<?php
	// chiude la sessione di un utente
	session_start();

	// annulla la sessione
	$_SESSION = [];
	session_destroy();

	// rimuovi il cookie al client
	setcookie(session_name(), '', time() - 3600, '/');

	echo "success";

	exit;
?>
