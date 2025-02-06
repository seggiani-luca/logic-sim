<?php
	// effettua il signup di un utente
	session_start();
	include "config.php";

	if(!$_SERVER["REQUEST_METHOD"] === "POST") die("Expected POST request");

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	$input = file_get_contents("php://input");
	$data = json_decode($input, true);

	$username = mysqli_real_escape_string($connection, $data["username"]);
	$password = mysqli_real_escape_string($connection, $data["password"]);

	// valida
	if (empty($username) || empty($password)) {
		echo "failure";
		die("Invalid data");
	}

	$query = "select * from users where username = ?";

	if($statement = mysqli_prepare($connection , $query)) {
		mysqli_stmt_bind_param($statement, "s", $username);
		mysqli_stmt_execute($statement);

		$result = mysqli_stmt_get_result($statement);
		$row = mysqli_fetch_assoc($result);

		if($row) {
			// l'utente esiste già
			echo "failure";
			die("User already exists");
		} else {
			// non esiste, crealo
			$hashed_password = password_hash($password, PASSWORD_DEFAULT);

			// inserisci nel database
			$query = "insert into users (username, password) values ('$username', '$hashed_password')";

			if (mysqli_query($connection, $query)) {
				echo "success";
			} else {
				echo "failure";
			}
		}

		// libera lo statement
		mysqli_free_result($result);
		mysqli_stmt_close($statement);
	}

	// chiudi la connessione
	mysqli_close($connection);
?>
