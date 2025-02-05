<?php
	// ottiene tutti i circuiti legati all'utente corrente
	session_start();
	include "config.php";

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	// restituisci un array vuota se non c'è un utente in sessione
	if(!isset($_SESSION["username"])) {
		echo json_encode([]);
		exit;
	}
	
	$user = $_SESSION["username"];

	$query = "select * from circuits where user = ?";

	if($statement = mysqli_prepare($connection , $query)) {
		// sostituisci il parametro in get
		mysqli_stmt_bind_param($statement, "s", $user);
		mysqli_stmt_execute($statement);

		// ottieni un result set
		$result = mysqli_stmt_get_result($statement);

		$names = array();

		while ($row = mysqli_fetch_assoc($result)) {
			$names[] = array($row["name"]);
		}

		echo json_encode($names);

		// libera lo statement
		mysqli_free_result($result);
		mysqli_stmt_close($statement);
	}

	// chiudi la connessione
	mysqli_close($connection);
?>
