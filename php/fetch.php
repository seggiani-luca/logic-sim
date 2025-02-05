<?php
	include "config.php";

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	// cerca il circuito
	$query = "select * from circuits where id = ?";
	$id = $_GET["id"];

	if($statement = mysqli_prepare($connection , $query)) {
		// sostituisci il parametro in get
		mysqli_stmt_bind_param($statement, "s", $id);
		mysqli_stmt_execute($statement);

		// ottieni un result set
		$result = mysqli_stmt_get_result($statement);
		$row = mysqli_fetch_assoc($result);
		
		if($row) {
			// se esiste, restituisci il json
			echo $row["circuit"];
		} else {
			// altrimenti restituisci un oggetto vuoto
			echo json_encode("empty");
		}

		// libera lo statement
		mysqli_free_result($result);
    mysqli_stmt_close($statement);
	}

	// chiudi la connessione
	mysqli_close($connection);
?>
