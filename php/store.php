<?php
	session_start();
	include "config.php";

	if(!$_SERVER["REQUEST_METHOD"] === "POST") die("Expected POST request");

	// connettiti al database
	$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
	if($connection->connect_error) {
		die("Connection to database failed: " . $connection->connect_error);
	}

	// ottieni nome utente
	if(!isset($_SESSION["username"])) die("No user session present");
	$username = $_SESSION["username"];

	// ottieni il circuito
	$raw = file_get_contents("php://input");
	$data = json_decode($raw, true);

	if(json_last_error() !== JSON_ERROR_NONE) die("Invalid JSON data");

	$name = $data["circuitName"];

	$escapedData = mysqli_real_escape_string($connection, json_encode($data));

	// inserisci nel database
	$query = "insert into circuits (user, name, circuit) values ('$username', '$name', '$escapedData') on duplicate key update circuit = values(circuit)";

	if ($connection->query($query) === TRUE) {
		echo "Circuit stored succesfully";
	} else {
		echo "Failed to store circuit: " . $connection->error;
	}

	// chiudi la connessione
	mysqli_close($connection);
?>
