// il modulo interface.js si occupa di inizializzare e gestire l'interfaccia utente, riferendosi al
// modulo component.js per i componenti del circuito e la gestione della simulazione, e al modulo 
// session.js per interfacciarsi col server

// importa da component.js
import {
	// classi dei componenti
	Input,
	Output,
	// classe vettori 2d
	Vector,
	// liste di componenti di input/output e gate
	inoutComponents,
	gateComponents,
	// funzione per l'aggiornamento della logica
	updateLogic,
  miscComponents
} from "./component.js"

// importa da session.js
import {
	// funzioni di gestione degli accessi
	login,
	signup,
	logout,
	statusRequest,
	// l'utente connesso
	loggedInUser,
	// funzioni di gestione dei circuiti
	loadCircuit,
	uploadCircuit,
	fetchCircuits
} from "./session.js";

// costanti di dimensionamento e stile
// dimensioni e colore griglia
export const gridSize = 30;
const gridColor = "#dddddd";

// dimensioni pin
export const pinRadius = 10;
export const pinPercent = 0.5;
export const pinStrokeWidth = 2;

// colori pin
export const pinStrokeColor = "#555555";
export const pinInteriorDefault = "#ffffff";
export const pinInteriorHover = "#cccccc";

// dimensioni fili di connessione
const wireWidth = 5;

// sfumatura dei componenti in creazione
export const componentFade = 0.6;

// dimensioni e colori di led e fili di connessione
export const ledRadius = 10;
export const onColor = "#3fff00";
export const offColor = "#ff2400";
export const hizColor = "#555555";

// scostamento verticale fili
let verticalWireSeparation = 100;
let verticalWireSensitivity = 50;

// elementi html
// pulsante di rimozione componenti
var deleteButtonElement;

// pulsanti di accesso ai menu a comparsa
var saveButton;
var loginButton;
var logoutButton;

// menu a comparsa
var loginMenu;
var signupMenu;
var saveMenu;
var storedMenu;

// lista dei circuiti dell'utente
var userCircuits;

// nome circuito da salvare
var saveText;
// segnalatore di circuito salvato
var saveTooltip;

// campi di input del menu di login
var loginUsernameText;
var loginPasswordText;

// campi di input del menu di signup
var signupUsernameText;
var signupPasswordText;

// segnalatore dell'utente connesso
var loggedUserText;

// avviso nessun circuito creato
var emptyCircuitText;

// validazione
const nameRegex = /^[A-Za-z1-9 ]+$/;

// canvas
var canvasContainer;
var canvas;
var ctx;

// il circuito in elaborazione
var currentCircuit = { circuitName: null, componentInstances: [] };

// variabili di stato del mouse
var mousePosition = new Vector();    // la posizione sul canvas
var rawMousePosition = new Vector(); // la posizione assoluta
var mouseOnCanvas = false;

// dichiarazione della classe InterfaceHandler, che implementa la macchina a stati che gestisce
// l'interfaccia
class InterfaceHandler {
	constructor() {
		this.state = 'rest';

		// variabili di stato
		this.currentComponent = null;
		this.toCreateComponent = null;
		this.currentPin = null;

		console.debug("InterfaceHandler instantiated at state %c" + this.state, "font-weight: bold;");
	}

	// gestisce le transizioni della macchina a stati sulla base di eventi e payload (che sono null o
	// contengono dati correlati all'evento)
	transition(event, payload) {
		console.debug("InterfaceHandler received event %c" + event + "%c, payload is:",
		              "font-weight: bold;");
		console.debug(payload);

		switch(this.state) {
			case "rest":
				switch(event) {
					case "newComponent":
						// istanzia la classe del componente da creare
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;

						this.state = "createComponent";
						break;

					case "canvasClick":
						if(!payload) {
							// click a vuoto
							break;
						}

						if(payload.type == "hoveringComponent") {
							// sei su un componente, selezionalo
							this.currentComponent = payload.which;
							this.state = "handleComponent";
						}

						if(payload.type == "hoveringButton") {
							// sei su un pulsante, aggiorna il valore
							let component = payload.which;
							// (component è sicuramente di tipo IN)
							component.toggle();

							// ordina un aggiornamento della logica (hai cambiato una variabile logica)
							updateLogic(currentCircuit.componentInstances);
						}

						if(payload.type == "hoveringPin") {
							// sei su un pin, inizia a trascinare
							let pin = payload.which;

							console.debug("Selected pin " + pin.type + " at index " + pin.index + " of object " +
							              pin.component.type);

							// ci comportiamo diversamente per pin di input e di output:
							if(pin.type == "input") {
								// i pin di input devono trovare il loro pin di output
								let connectedPin = pin.connectedPin;

								// se non c'è pin di output collegato non facciamo nulla
								if(!connectedPin) break;

								console.debug("Input pin is connected to " + connectedPin.type + " at index " +
								              connectedPin.index + " of object " + connectedPin.component.type)

								// prendiamo il pin di output come pin di partenza
								this.currentPin = connectedPin;
								// e lo scolleghiamo (questo scollegerà il pin selezionato inizialmente)
								connectedPin.disconnect(pin);

								// ordina un aggiornamento della logica (hai disconnesso due componenti)
								updateLogic(currentCircuit.componentInstances);
							} else if(pin.type == "output") {
								// queste informazioni sono per il debug
								let connectedPins = pin.connectedPins;

								console.debug("Input pin is connected to:");
								for(let conPin of connectedPins) {
									console.debug("Pin " + conPin.type + " at index " + conPin.index +
									              " of object " + conPin.component.type);
								}

								// i pin di output si prendono così come sono
								this.currentPin = pin;
							} else break;

							this.state = "dragPin";
						}

						break;
				}
				break;

			case "createComponent":
				switch(event) {
					case "canvasClick":
						if(!payload) {
							// click su una zona vuota, prova a creare il componente (le collisioni vengono
							// verificate nella funzione createComponent())
							createComponent(this.toCreateComponent)
						}

						this.state = "rest";
						break;

					case "newComponent":
						// si vuole creare un altro componente, interrompi e istanzialo
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;

						break;

					default:
						this.state = "rest";
				}
				break;

			case "handleComponent":
				switch(event) {
					case "newComponent":
						// si vuole creare un altro componente, interrompi e istanzialo
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;

						this.state = "createComponent";
						break;

					case "deleteButtonClick":
						// si è premuto il tasto di rimozione del componente, rimuovilo
						deleteComponent(this.currentComponent);

						// ordina un aggiornamento della logica (hai eliminato un componente)
						updateLogic(currentCircuit.componentInstances);
						this.state = "rest";
						break;

					default:
						this.state = "rest";
						break;
				}

			case "dragPin":
				switch(event) {
					case "newComponent":
						// si vuole creare un altro componente, interrompi e istanzialo
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;

						this.state = "createComponent";
						break;

					case "canvasClick":
						if(payload && payload.type == "hoveringPin") {
							// si è fatto click su un altro pin, prova a collegarlo
							let otherPin = payload.which;
							// le connessioni si fanno sempre input -> output, e la funzione connect() saprà da
							// sola se ci sono errori di aliasing o di tipi
							this.currentPin.connect(otherPin);

							// ordina un aggiornamento della logica (hai collegato dei componenti)
							updateLogic(currentCircuit.componentInstances);
						}

						this.state = "rest";
						break;

					default:
						this.state = "rest";
						break;
				}
		} // switch(this.state)

		// probabilmente si è fatto qualcosa, aggiorna
		updateCanvas();

		console.debug("InterfaceHandler transitioned to state %c" + this.state, "font-weight: bold;");
	}
}

// un'istanza dell'oggetto handler gestisce tutta l'interfaccia utente
var handler = new InterfaceHandler();

// inizializza l'interfaccia
function init() {
	// ottieni gli elementi html
	// pulsante di rimozione componenti
	deleteButtonElement = document.querySelector(".delete-button");
	deleteButtonElement.addEventListener("click", deleteButtonHandler);

	// gli altri pulsanti chiamano direttamente le loro funzioni
	// nasconde tutti i componenti, chiamata dallo sfondo dei menu a comparsa
	window.hidePopups = hidePopups;

	// chiamate dai pulsanti nell'header
	window.beginLogin = beginLogin;
	window.beginSignup = beginSignup;
	window.saveCircuit = saveCircuit;
	window.seeStored = seeStored;
	window.newCircuit = newCircuit;

	// chiamate dai pulsanti dei menu a comparsa
	window.saveConfirm = saveConfirm;
	window.loginConfirm = loginConfirm;
	window.signupConfirm = signupConfirm;

	// chiamata dal pulsante di logOut
	window.logoutConfirm = logoutConfirm;

	// il pulsante di salvataggio può essere disattivato
	saveButton = document.querySelector(".save-button");

	// i pulsanti di login/logout possono essere disattivati
	loginButton = document.querySelector(".login-button");
	logoutButton = document.querySelector(".logout-button");

	// menu a comparsa
	loginMenu = document.querySelector(".login-menu");
	signupMenu = document.querySelector(".signup-menu");
	saveMenu = document.querySelector(".save-menu");
	storedMenu = document.querySelector(".stored-menu");

	// menu salvataggio
	saveText = document.querySelector(".save-text");
	saveTooltip = document.querySelector(".save-tooltip");

	// menu login
	loginUsernameText = document.querySelector(".login-username-text");
	loginPasswordText = document.querySelector(".login-password-text");

	// menu signup
	signupUsernameText = document.querySelector(".signup-username-text");
	signupPasswordText = document.querySelector(".signup-password-text");

	// segnalatore dell'utente connesso
	loggedUserText = document.querySelector(".logged-user");

	// menu circuiti salvati
	userCircuits = document.querySelector(".user-circuits");
	emptyCircuitText = document.querySelector(".empty-circuits");

	// lista dei componenti
	let componentListElement = document.querySelector(".component-list");
	initComponentList(componentListElement);

	// canvas
	canvasContainer = document.querySelector(".canvas-container");
	canvas = document.querySelector(".workspace-canvas");
	ctx = canvas.getContext("2d");

	// inizializza il canvas
	updateCanvas();

	// il mouse si interfaccia con handler aggiornando le sue variabili di stato e chiamando gli
	// eventi corrispondenti, con annessi payload se serve
	canvas.addEventListener("mouseenter", (event) => {
		mouseOnCanvas = true;
		mouseHandler(event); // mousemove potrebbe non registrare subito
	});

	canvas.addEventListener("mouseleave", (event) => {
		mouseOnCanvas = false;
		mouseHandler(event); // come sopra, mousemove potrebbe non registrare subito
	});

	canvas.addEventListener("mousemove", (event) => {
		mouseHandler(event);
	});

	canvas.addEventListener("click", (event) => {
		// ferma la propagazione dell'evento (in bubble up) fino alla finestra
		event.stopPropagation();

		canvasClickHandler();
	});

	window.addEventListener("click", () => {
		// gestisce i click sulla finestra (per la macchina a stati sono tutti a vuoto, eventuali 
		// operazioni vengono svolte dalle funzioni chiamate dai pulsanti premuti) 
		windowClickHandler();
	});

	// se ci si sposta sul canvas bisogna ricalcolare la posizione del mouse e ridisegnare
	canvasContainer.addEventListener("scroll", () => {
		// non abbiamo informazioni sul mouse, usa le precedenti
		let mouse = {};
		mouse.clientX = rawMousePosition.x;
		mouse.clientY = rawMousePosition.y;

		mouseHandler(mouse);
	});
}

// controlla la sessione
async function checkSession() {
	let username = await statusRequest();
	if(username) {
		// c'è un utente connesso
		setupLoggedSession(username);
	}
}

// ottiene i circuiti dell utente
async function setupCircuits() {
	// ripulisci la lista circuiti
	userCircuits.innerHTML = "";

	let circuits = await fetchCircuits();

	// in caso fosse stato nascosto
	emptyCircuitText.classList.remove("hide");

	// se l'utente non ha circuiti, esci
	if(circuits.length == 0) return;

	// nascondi l'avviso di nessun circuito creato
	emptyCircuitText.classList.add("hide");

	// crea un link per ogni circuito
	for(let circuit of circuits) {
		addCircuitElement(circuit);
	}
}

// crea un nuovo elemento circuito nel menu dei circuiti salvati
function addCircuitElement(circuit) {
	let circuitElement = document.createElement("a");
	circuitElement.textContent = circuit;

	// il circuito si raggiunge con una stringa di query comprendente di nome utente e circuito
	circuitElement.setAttribute("href", "?user=" + loggedInUser + "&name=" + circuit);

	userCircuits.appendChild(circuitElement);
}

// carica la pagina vuota
function newCircuit() {
	console.debug("Clearing circuit");

	// carica la pagina senza stringhe di query
	window.location.href = window.location.pathname;
}

// carica un eventuale circuito all'avvio della pagina
async function handleCircuitLoad() {
	let params = new URLSearchParams(window.location.search);

	let user = params.get("user");
	let name = params.get("name");
	if(user != null & name != null) {
		// è stata fornita la stringa di query, ottieni il circuito
		let circuit = await loadCircuit(user, name);

		if(circuit) {
			// c'è qualcosa da caricare
			currentCircuit = circuit;

			console.debug("Circuit fetched");

			// aggiorna dopo il caricamento
			updateLogic(currentCircuit.componentInstances);
			updateCanvas();
		}
	}
}

// utilità per le trasformazioni da schermo a canvas
function screenToCanvas(x, y) { // questa prende una coppia di numeri e non un vettore, perchè è
                                // quello che ci restituisce l'evento di spostamento del mouse
	let rect = canvas.getBoundingClientRect();

	let posX = x - rect.left;
	let posY = y - rect.top;

	return new Vector(posX, posY);
}

function canvasToScreen(pos) {
	let rect = canvas.getBoundingClientRect();

	let posX = pos.x + rect.left;
	let posY = pos.y + rect.top;

	return new Vector(posX, posY);
}

// funzioni di gestione del mouse
// getisce i movimenti del mouse (sul canvas, fuori non c'è nulla da fare)
function mouseHandler(event) {
	// converti la posizione
	mousePosition = screenToCanvas(event.clientX, event.clientY);

	// tieni traccia dell'ultima posizione
	rawMousePosition = new Vector(event.clientX, event.clientY);
	
	// aggiorna il canvas
	updateCanvas();
}

// gestisce i click del mouse sul canvas
function canvasClickHandler() {
	for(let instance of currentCircuit.componentInstances) {
		// controlliamo prima se si sta facendo hover su un pulsante di un componente
		if(instance.type == "IN" && instance.hoveringButton(mousePosition)) {
			let payload = { type: "hoveringButton", which: instance };
			handler.transition("canvasClick", payload);
			return;
		}

		// poi se si sta facendo hover su un pin
		let hoveringPin = instance.hoveringPin(mousePosition);
		if(hoveringPin) {
			let payload = { type: "hoveringPin", which: hoveringPin };
			handler.transition("canvasClick", payload);
			return;
		}

		// e infine se si sta facendo hover su un componente
		if(instance.hovering(mousePosition)) {
			let payload = { type: "hoveringComponent", which: instance };
			handler.transition("canvasClick", payload);
			return;
		}
	}

	// non stiamo facendo hover su nulla, lo rappresentiamo con un payload a null
	handler.transition("canvasClick", null);
}

// gestisce i click del mouse sulla finestra
function windowClickHandler() {
	// il payload è sempre a null (non ci interessa sapere dove siamo)
	handler.transition("windowClick", null);
}

// gestisce il pulsante di rimozione sul canvas
function deleteButtonHandler(event) {
	// ferma la propagazione dell'evento (in bubble up) fino alla finestra
	event.stopPropagation();

	handler.transition("deleteButtonClick", null);
}

// chiude tutti i menu a comparsa
function hidePopups() {
	loginMenu.classList.add("hide");
	signupMenu.classList.add("hide");
	saveMenu.classList.add("hide");
	storedMenu.classList.add("hide");
}

// gestisce il pulsante di login
function beginLogin() {
	hidePopups();
	loginMenu.classList.remove("hide");
}
async function loginConfirm() {
	// ottieni username e password
	let username = loginUsernameText.value;
	let password = loginPasswordText.value;

	let result = await login(username, password);

	switch(result) {
		case "user-invalid":
			loginUsernameText.setCustomValidity("Invalid username, use digits, letters spaces or " +
			                                    "underscores");
			loginUsernameText.reportValidity();
			break;
		case "pass-invalid":
			loginPasswordText.setCustomValidity("Invalid password, use digits, letters, spaces or " +
			                                    "underscores");
			loginPasswordText.reportValidity();
			break;
		case "success":
			setupLoggedSession(username);
			break;
		case "failure":
			alert("Couldn't log in");
		default:
			console.debug("Login failed");
	}
}

// imposta la sessione dell'utente
function setupLoggedSession(username) {
	// mostra l'utente corrente
	loggedUserText.textContent = "Logged in as " + username;
	loggedUserText.classList.remove("hide");

	// ora si può salvare
	saveButton.removeAttribute("disabled");

	// non vogliamo più fare login ma logout
	loginButton.classList.add("hide");
	logoutButton.classList.remove("hide");

	// chiudiamo il menu di login
	loginMenu.classList.add("hide");

	// ottieni i circuiti dell'utente
	setupCircuits();
}

// gestisce il pulsante di signup
function beginSignup() {
	hidePopups();
	signupMenu.classList.remove("hide");
}
async function signupConfirm() {
	let username = signupUsernameText.value;
	let password = signupPasswordText.value;

	let result = await signup(username, password);

	switch(result) {
		case "user-invalid":
			signupUsernameText.setCustomValidity("Invalid username, use digits, letters, spaces or " +
			                                     "underscores");
			signupUsernameText.reportValidity();
			break;
		case "pass-invalid":
			signupPasswordText.setCustomValidity("Invalid password, use digits, letters, spaces or " + 
			                                     "underscores");
			signupPasswordText.reportValidity();
			break;
		case "success":
			alert("Signed up succesfully, log in with your new credentials");

			// mostra il menu di login
			signupMenu.classList.add("hide");
			loginMenu.classList.remove("hide");
			break;
		case "failure":
			alert("Couldn't sign up");
		default:
			console.debug("Signup failed");
	}
}

// gestisce il pulsante di salvataggio
async function saveCircuit() {
	if(currentCircuit.circuitName == null) {
		// se non c'è un nome, apri il menu
		hidePopups();
		saveMenu.classList.remove("hide");
	} else {
		// altrimenti carica e basta
		await uploadCircuit(currentCircuit);
		
		// aggiorna i circuiti dell'utente (potrebbe servire comunque se un utente sta copiando il 
		// circuito di un altro utente)
		setupCircuits();

		// segnala il salvataggio per 3 secondi
		saveTooltip.classList.remove("hide");
		setTimeout(() => {
			saveTooltip.classList.add("hide");
		}, 3000);
	}
}
async function saveConfirm() {
	let name = saveText.value;

	// controlla se il nome è vallido
	if(name != "" && nameRegex.test(name)) {
		// è valido, assegnalo e salva
		currentCircuit.circuitName = name;
		await uploadCircuit(currentCircuit);

		// aggiorna i circuiti dell'utente
		setupCircuits();

		// chiudi il menu
		saveMenu.classList.add("hide");
	} else {
		saveText.setCustomValidity("Invalid name, use digits, letters or spaces");
		saveText.reportValidity();
	}
}

// gestisce il pulsante del menu circuiti salvati
function seeStored() {
	storedMenu.classList.remove("hide");
}

// gestisce il logout
async function logoutConfirm() {
	hidePopups();
	let result = await logout();

	switch(result) {
		case "success":
			// sei disconnesso, ritorna allo stato di default
			saveButton.setAttribute("disabled", "");
			loginButton.classList.remove("hide");
			logoutButton.classList.add("hide");
			loggedUserText.classList.add("hide");

			// dimenticati i circuiti
			setupCircuits();
			break;
		case "failure":
			alert("Couldn't logout");
		default:
			console.debug("Logout failed");
	}
}

// disegna la griglia
function drawGrid() {
	ctx.lineWidth = 1;

	// linee orizzontali
	for(let y = 0; y <= canvas.height; y += gridSize) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}

	// linee verticali
	for(let x = 0; x <= canvas.width; x += gridSize) {
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, canvas.height);
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}
}

// disegna un filo di connessione fra pin
function drawWire(startPos, endPos, color) {
	ctx.beginPath();

	ctx.lineWidth = wireWidth;
	ctx.strokeStyle = color;

	// l'idea è di usare una bezier con due punti di controllo: uno a destra del pin di uscita e uno
	// a sinistra del pin di ingresso
	let xDelta = endPos.x - startPos.x;
	let yDelta = endPos.y - startPos.y;

	let horizOffset = Math.abs((xDelta) / 2);
	let vertOffset = 0;

	if(xDelta < 0) {
		let sens = (verticalWireSensitivity - Math.abs(yDelta)) / verticalWireSensitivity;
		vertOffset = Math.min(Math.max(sens, 0), 1) * verticalWireSeparation * Math.sign(yDelta);
	}

	let cp1 = new Vector(startPos.x + horizOffset, startPos.y + vertOffset);
	let cp2 = new Vector(endPos.x - horizOffset, endPos.y + vertOffset);

	ctx.moveTo(startPos.x, startPos.y);
	ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPos.x, endPos.y);

	ctx.stroke();
}

// aggiorna il canvas
export function updateCanvas() {
	// ripulisci tutto
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// disegna la griglia
	drawGrid();

	// disegna i componenti
	for(let instance of currentCircuit.componentInstances) {
		instance.draw(ctx, mousePosition);
	}

	// disegna il componente in creazione se esiste
	if(handler.state == "createComponent" && mouseOnCanvas) {
		let component = handler.toCreateComponent;

		// spostalo sul mouse
		component.setPosition(mousePosition);
		component.draw(ctx, mousePosition, true);
	}

	// disegna le connessioni fra i pin
	for(let instance of currentCircuit.componentInstances) {
		for(let pin of instance.inputs) {
			let connectedPin = pin.connectedPin;

			if(connectedPin) {
				let color;

				// decidi il colore in base al valore di connectedPin
				switch(connectedPin.value) {
					case false:
						color = offColor;
						break;
					case true:
						color = onColor;
						break;
					default:
						color = hizColor; // null rappresenta l'alta impedenza
						break;
				}

				drawWire(connectedPin.getPosition(), pin.getPosition(), color);
			}
		}
	}

	// disegna la connessione in trascinamento se esiste
	if(handler.state == "dragPin") {
		let pin = handler.currentPin;

		if(pin.type == "input") {
			drawWire(mousePosition, pin.getPosition(), hizColor);
		} else {
			drawWire(pin.getPosition(), mousePosition, hizColor);
		}
	}

	// disegna il pulsante di rimozione componenti
	if(handler.state == "handleComponent") {
		// centralo sul componente selezionato
		let component = handler.currentComponent;
		let center = canvasToScreen(component.position);

		deleteButtonElement.style.left = `${center.x}px`;
		deleteButtonElement.style.top = `${center.y}px`;

		console.debug("Button placed at " + center.x + ", " + center.y);

		deleteButtonElement.classList.remove("hide");
	} else {
		deleteButtonElement.classList.add("hide");
	}
}

// trasferisce un'istanza di component in currentCircuit.componentInstances
function createComponent(instance) {
	// prima vogliamo controllare "collisioni", cioè caselle già coperte da altre istanze su cui si
	// andrebbe a sovrapporre instance
	let overlapPositions = instance.overlapPositions();

	for(let position of overlapPositions) {
		for(let checkingInstance of currentCircuit.componentInstances) {
			if(checkingInstance.hovering(position)) {
				console.debug("Couldn't create component because of overlap");
				return;
			}
		}
	}

	// tutto ok
	// se è del testo, chiedi una stringa all'utente
	if(instance.type == "Text") {
		let input = prompt("Enter your text:");
		if(input != null && input.trim() != "") {
			instance.text = input;
		}
	}
	
	// inserisci il componente
	currentCircuit.componentInstances.push(instance);

	// ordina i componenti
	currentCircuit.componentInstances.sort((a, b) => {
		function getTypePriority(component) {
			if (component instanceof Input) return 0;   // gli input vanno per primi
			if (component instanceof Output) return 2;  // gli output per ultimi
			return 1;                                   // tutto il resto a metà
		}

		return getTypePriority(a) - getTypePriority(b);
	});
}

// elimina un'istanza di componente
function deleteComponent(instance) {
	// trova l'indice dell'istanza
	let index = currentCircuit.componentInstances.indexOf(instance);

	if (index !== -1) {
		// elimina i pin
		instance.clearPins();

		// rimuovi l'istanza
		currentCircuit.componentInstances.splice(index, 1);
		deleteButtonElement.classList.add("hide");
	} else {
		console.error("Cannot delete component instance ", instance);
	}
}

// crea un elemento della lista componenti
function createComponentElement(component) {
	let componentElement = document.createElement("a");
	componentElement.classList.add("component");

	let componentIcon = document.createElement("img");
	componentIcon.src = component.icon;
	componentIcon.alt = `${component.name} icon`;
	componentElement.appendChild(componentIcon);

	let componentName = document.createElement("p");
	componentName.textContent = component.name;
	componentElement.appendChild(componentName);

	componentElement.addEventListener("click", (event) => {
		// chiama l'handler per i nuovi componenti con il suo tipo di componente
		newComponentHandler(event, component.type)
	});

	return componentElement;
}

// gestisce i pulsanti della lista componenti
function newComponentHandler(event, component) {
	// ferma la propagazione dell'evento (in bubble up) fino alla finestra
	event.stopPropagation();

	handler.transition("newComponent", { which: component });
}

// inizializza la lista di componenti
function initComponentList(componentList) {
	function unrollComponents(components) {
		for(let component of components) {
			let componentElement = createComponentElement(component);
			componentList.appendChild(componentElement);
		}
	}

	// ingresso/uscita
	let inoutsCategory = document.createElement("p");
	inoutsCategory.classList.add("spacer");
	inoutsCategory.textContent = "Input/Output";
	componentList.appendChild(inoutsCategory);

	unrollComponents(inoutComponents);

	// gate
	let gatesCategory = document.createElement("p");
	gatesCategory.classList.add("spacer");
	gatesCategory.textContent = "Gates";
	componentList.appendChild(gatesCategory);

	unrollComponents(gateComponents);

	// misc
	let miscCategory = document.createElement("p");
	miscCategory.classList.add("spacer");
	miscCategory.textContent = "Misc.";
	componentList.appendChild(miscCategory);

	unrollComponents(miscComponents);
}

// chiama la init quando il DOM è pronto
document.addEventListener("DOMContentLoaded", init);

// gestisce la sessione all'apertura della pagina
window.onload = () => {
	// prima controlla la sessione
	checkSession();
	// poi carica il circuito, se serve
	handleCircuitLoad();
}
