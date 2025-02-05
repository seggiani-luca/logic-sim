<?php
	include "config.php";

	if(!$_SERVER["REQUEST_METHOD"] === "POST") die("Expected POST request");

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	// genera una stringa casuale di 8 caratteri e la confronta nel database
	function generateUniqueId($connection, $len = 8, $tries = 10) {
		for($i = 0; $i < $tries; $i = $i + 1) {
			// genera la stringa
			$id = bin2hex(random_bytes($len / 2));			

			// prepara una query di verifica
			$query = "select * from circuits where id=?";

			if($statement = mysqli_prepare($connection , $query)) {
				// sostituisci il parametro in get
				mysqli_stmt_bind_param($statement, "s", $id);
				mysqli_stmt_execute($statement);

				// ottieni un result set
				$result = mysqli_stmt_get_result($statement);
				$row = mysqli_fetch_assoc($result);
				
				if(!$row) {
					// non ci sono collisioni, la stringa va bene
					break;
				}

				// libera lo statement
				mysqli_free_result($result);
				mysqli_stmt_close($statement);
			}

			if($i == $tries) {
				return "";
			}
		}

		return $id;
	}

	// ottieni il circuito
	$raw = file_get_contents("php://input");
	$data = json_decode($raw, true);

	if (json_last_error() !== JSON_ERROR_NONE) die("Invalid JSON data");

	$escapedData = mysqli_real_escape_string($connection, json_encode($data));
	
	// genera una chiave
	$id = generateUniqueId($connection);

	// inserisci nel database
	$query = "insert into circuits (id, circuit) values ('$id', '$escapedData')";

	if ($connection->query($query) === TRUE) {
		echo "Circuit stored succesfully";
	} else {
		echo "Failed to store circuit: " . $connection->error;
	}

	// chiudi la connessione
	mysqli_close($connection);
?>
