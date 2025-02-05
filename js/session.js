// il modulo session.js si occupa di gestire la sessione utente, l'autenticazione e il caricamento
// dei circuiti su e da server

// importa da serialize.js
import {
	// funzioni per la serializzazione e deserializzazione di circuiti
	serializeCircuit,
	rebuildCircuit
} from "./serialize.js"

// validazione
const usernameRegex = /^[A-Za-z1-9 _]+$/;
const passwordRegex = /^[A-Za-z1-9 _]+$/;

// sessione
export var loggedInUser = null;

// controlla la sessione
export async function statusRequest() {
	return fetch("php/status.php", {
		method: "GET"
	})
	.then(response => response.json())
	.then(data => {
		let username = data.username;

		if(username) {
			// c'è un utente
			loggedInUser = username;
			return username;
		}

		// non c'è nessuno
		return null;
	})
	.catch(error => {
		console.error("Login error:", error);
	});
}

// effettua il login
export async function login(username, password) {
	// convalida username
	if(username == "" || !usernameRegex.test(username)) {
		return Promise.resolve("user-invalid");
	}

	// convalida password
	if(password == "" || !passwordRegex.test(username)) {
		return Promise.resolve("pass-invalid");
	}

	// tutto valido, prova il login
	return fetch("php/login.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: username, password: password })
	})
	.then(response => response.text())
	.then(data => {
		if(data == "success") {
			// login effettuato con successo
			loggedInUser = username;

			return "success";
		} else if(data == "failure") {
			// login fallito
			return "failure";
		}
	})
	.catch(error => {
		console.error("Login error:", error);
	});
}

// effettua il signup
export async function signup(username, password) {
	if(username == "" || !usernameRegex.test(username)) {
		return Promise.resolve("user-invalid");
	}

	if(password == "" || !passwordRegex.test(username)) {
		return Promise.resolve("pass-invalid");
	}

	// tutto valido, prova il signup
	return fetch("php/signup.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({ username: username, password: password })
	})
	.then(response => response.text())
	.then(data => {
		if(data == "success") {
			// signup effettuato con successo
			return "success";
		} else if(data == "failure") {
			// signup fallito
			return "failure";
		}
	})
	.catch(error => {
		console.error("Login error:", error);
	});
}

// effettua il logout
export async function logout() {
	if(loggedInUser == null) return Promise.resolve();

	console.debug("Logging out user");

	return fetch("php/logout.php", {
		method: "GET",
		headers: {
			"Content-Type": "application/json"
		}
	})
	.then(response => response.text())
	.then(data => {
		if(data == "success") {
			// sei disconnesso
			loggedInUser = null;

			return "success";
		} else if(data == "failure") {
			// non sei riuscito a disconnetterti
			return "failure";
		}
	})
	.catch(error => {
		console.error("Logout error: ", error);
	})
}

// carica un circuito dal server
export async function loadCircuit(user, name) {
	console.debug("Loading circuit of user " + user + ", named " + name);

	return fetch("php/fetch.php/?user=" + user + "&name=" + name, {
		method: "GET"
	})
	.then(response => response.json())
	.then(data => {
		console.debug("Fetched JSON: ");
		console.debug(data);

		if(data == "empty") {
			console.debug("No circuit to load, skipping...");
			return null;
		}

		// carica il circuito
		return rebuildCircuit(data);
	})
	.catch(error => {
		console.error("Circuit fetching error:", error);
	});
}

// carica un circuito sul server
export async function uploadCircuit(circuit) {
	// prima serializza il circuito
	let json = serializeCircuit(circuit);

	console.debug("Current circuit JSON is:");
	console.debug(JSON.parse(json));

	return fetch("php/store.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: json
	})
	.then(response => response.text())
	.then(data => {
		console.debug("Stored circuit: " + data);
	})
	.catch(error => {
		console.error("Circuit storing error: ", error);
	});
}

// carica tutti i circuiti dell'utente collegato dal server
export async function fetchCircuits() {
	console.debug("Loading circuits of user");

	return fetch("php/fetchAll.php", {
		method: "GET"
	})
	.then(response => response.json())
	.then(data => {
		console.debug(data);
		return data;
	})
	.catch(error => {
		console.error("Circuit fetching error:", error);
	});
}
