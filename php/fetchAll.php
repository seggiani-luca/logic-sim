<?php
	session_start();
	include "config.php";

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	if(!isset($_SESSION["username"])) die("Expected user session");
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
