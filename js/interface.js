// importa da component.js 
import {
	Vector,						// classe vettore 2d 
	inoutComponents,	// componenti di input/output e gate
	gateComponents,
	updateLogic	// funzione per l'aggiornamento della logica
} from "./component.js"

// importa da serialize.js
import {
	serializeCircuit,
	rebuildCircuit
} from "./serialize.js"

// costanti di dimensionamento e stile 
export const gridSize = 30;	// dimensioni e colore griglia
const gridColor = "#dddddd";

export const pinRadius = 10;		// dimensioni pin
export const pinPercent = 0.5;
export const pinStrokeWidth = 2;

export const pinStrokeColor = "#555555";	// colori pin
export const pinInteriorDefault = "#ffffff";
export const pinInteriorHover = "#cccccc";

const wireWidth = 5;	// dimensioni e forma fili di connessione

export const componentFade = 0.6;	// sfumatura dei componenti in creazione

export const ledRadius = 10;	// dimensioni e colori di led e fili di connessione
export const onColor = "#3fff00";
export const offColor = "#ff2400";
export const hizColor = "#555555";

const componentListWidth = 200;	// dimensioni elementi html
const headerHeight = 50;

// elementi html 
var deleteButtonElement;

var loginMenu;
var signupMenu;
var saveMenu;

// canvas
var canvas;
var ctx;

// lista componenti creati
var currentCircuit = { circuitName: null, componentInstances: [] };

window.currentCircuit = currentCircuit; // TODO: debug

// l'interfaccia è una macchina a stati così definita:
//
//	variabili di stato:
//		currentComponent: un componente sul canvas selezionato
//		toCreateComponent: un nuovo componente da creare
//		currentPin: un pin di un componente sul canvas selezionato
//
//		currentComponent fa parte dei componenti definiti sul canvas e viene disegnato comunque,
//		toCreateComponent va disegnato solo quando si è nello stato createComponent
//		
// - rest: 
// 		non fare nulla
//
//		@ click componente lista componenti: 
//			-> createComponent, 
//			createComponent <- il componente cliccato
//
//		@ click pulsante componente:
//			aggiorna componente
//			-> rest
//
//		@ click pin di INGRESSO di un componente su canvas
//			-> dragPin
//			currentPin <- se esiste, il pin collegato al pin cliccato (che viene disconnesso)
//
//		@ click pin di USCITA di un componente su canvas
//			-> dragPin
//			currentPin <- il pin cliccato
//
//		@ click componente su canvas: 
//			-> handleComponent, 
//			currentComponent <- il componente cliccato 
//
// - createComponent: 
// 		se sul canvas, disegna il createComponent alla posizione del mouse
// 		
// 		@ click su canvas:
// 		se possibile crea il componente 
// 			-> rest
// 	
// 		@ click componente lista componenti:
// 			currentComponent <- il componente cliccato
// 		
// 		@ click fuori da canvas: -> rest
//
// - handleComponent: 
// 		mostra i pulsanti di gestione del componente
//		
//		@ click componente lista componenti: 
//			-> createComponent, 
//			createComponent <- il componente cliccato
//
//		@ click su deleteButton: 
//			elimina currentComponent,
//			-> rest
//		
//		@ click ovunque:
//			-> rest
//
// - dragPin:
// 		disegna un connettore da currentPin a mousePosition
//
//		@ click componente lista componenti: 
//			-> createComponent, 
//			createComponent <- il componente cliccato
//
// 		@ click su un pin non corrispondente a currentPin:
//			chiudi la connessione
//			-> rest
//
//		@ click ovunque:
//			-> rest

// dichiarazione della classe InterfaceHandler, che implementa la macchina a stati sopra definita
class InterfaceHandler {
	constructor() {
		this.state = 'rest';

		// variabili di stato
		this.currentComponent = null;
		this.toCreateComponent = null;	
		this.currentPin = null;

		console.debug("InterfaceHandler instantiated at state %c" + this.state, "font-weight: bold;");
	}

	// gestisce le transizioni sulla base di eventi e payload (che sono null o contengono dati 
	// correlati all'evento)
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

							// metti in coda un aggiornamento della logica (hai cambiato una variabile logica)
							updateLogic(currentCircuit.componentInstances);
						}

						if(payload.type == "hoveringPin") {
							// sei su un pin, inizia a trascinare
							let pin = payload.which;

							console.debug("Selected pin " + pin.type + " at index " + pin.index + " of object " 
								+ pin.component.type);

							// ci comportiamo diversamente per pin di input e di output:
							if(pin.type == "input") {
								// i pin di input devono trovare il loro pin di output
								let connectedPin = pin.connectedPin;

								// se non c'è pin di output collegato non facciamo nulla
								if(!connectedPin) break;

								console.debug("Input pin is connected to " + connectedPin.type + " at index " 
									+ connectedPin.index + " of object " + connectedPin.component.type)
								
								// prendiamo il pin di output come pin di partenza
								this.currentPin = connectedPin;
								// e lo scolleghiamo (questo scollegerà il pin selezionato inizialmente)
								connectedPin.disconnect(pin);


								// metti in coda un aggiornamento della logica (hai disconnesso due componenti)
								updateLogic(currentCircuit.componentInstances);
							} else if(pin.type == "output") {
								// queste informazioni sono per il debug
								let connectedPins = pin.connectedPins;
								
								console.debug("Input pin is connected to:");
								for(let conPin of connectedPins) {
									console.debug("Pin " + conPin.type + " at index " + conPin.index + " of object "
										+ conPin.component.type);
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
							// click su una zona vuota, prova a creare il componente (altre collisioni vengono 
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
						
						// metti in coda un aggiornamento della logica (hai eliminato un componente)
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
					
							// metti in coda un aggiornamento della logica (hai collegato dei componenti)
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

// l'oggetto handler gestisce tutta l'interfaccia utente 
var handler = new InterfaceHandler();

window.handler = handler; // TODO: debug

// variabili di stato del mouse
var mousePosition = new Vector();
var mouseOnCanvas = false;

function init() {
	// ottieni gli elementi html 
	// pulsante di rimozione componenti
	deleteButtonElement = document.querySelector(".delete-button");
	
	// gli altri pulsanti chiamano direttamente le loro funzioni
	window.beginLogin = beginLogin;
	window.beginSignup = beginSignup;
	window.saveCircuit = saveCircuit;
	window.seeStored = seeStored;

	// menu a comparsa
	loginMenu = document.querySelector(".login-menu");
	loginMenu.classList.add("hide");
	signupMenu = document.querySelector(".signup-menu");
	signupMenu.classList.add("hide");
	saveMenu = document.querySelector(".save-menu");
	saveMenu.classList.add("hide");

	// lista dei componenti 
	let componentListElement = document.querySelector(".component-list");
	initComponentList(componentListElement);

	// canvas
	canvas = document.querySelector(".workspace-canvas");
	ctx = canvas.getContext("2d");
	
	// inizializza il canvas
	resizeCanvas();
	updateCanvas();

	// event listener per il ridimensionamento del canvas
	window.addEventListener("resize", () => {
		resizeCanvas();
		updateCanvas();
	});
	
	// il mouse si interfaccia con handler aggiornando le sue variabili di stato e chiamando gli 
	// eventi corrispondenti, con annessi payload se serve
	canvas.addEventListener("mouseenter", (event) => {
		mouseOnCanvas = true;
		mouseHandler(event); // come sopra, mousemove potrebbe non registrare subito
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
		windowClickHandler();
	});
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
	// aggiorna il canvas
	updateCanvas();
}

// gestisce i click del mouse sul canvas
function canvasClickHandler() {
	for(let instance of currentCircuit.componentInstances)	{
		// controlliamo prima se si sta facendo hover su un pulsante del componente
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

	// non stiamo facendo hover su nulla, lo rappresentiamo con u payload a null
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

// gestisce il pulsante di login 
function beginLogin() {
}

// gestisce il pulsante di signup
function beginSignup() {
}

// gestisce il pulsante di salvataggio
function saveCircuit() {
	let json = serializeCircuit(currentCircuit);
	
	console.debug("Current circuit JSON is:");
	console.debug(JSON.parse(json));

	let obj = rebuildCircuit(json);

	console.debug("Rebuilt circuit is:");
	console.debug(obj);

	console.debug("Swapping current circuit with rebuilt one... wish me luck!");
	currentCircuit = obj;

	updateLogic(currentCircuit.componentInstances);
}

// gestisce il pulsante del menu circuiti salvati
function seeStored() {
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
	let offset = Math.abs((endPos.x - startPos.x) / 2);

	let cp1 = new Vector(startPos.x + offset, startPos.y);
  let cp2 = new Vector(endPos.x - offset, endPos.y);

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
		let component = handler.currentComponent;
		let center = canvasToScreen(component.position);

		console.debug("Button placed at " + center.x + ", " + center.y);

		deleteButtonElement.style.left = `${center.x}px`;
		deleteButtonElement.style.top = `${center.y}px`;

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

	// tutto ok, crea
	currentCircuit.componentInstances.push(instance);
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
		console.error("Cannot delete component instance " + instance);
	}
}

// quando la finestra viene ridimensionata si vuole ridimensionare anche il canvas 
function resizeCanvas() {
	// dipende dal CSS 
	let canvasWidth = window.innerWidth - componentListWidth;
	let canvasHeight = window.innerHeight - headerHeight;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
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
	// ingresso/uscita 
	let inoutsCategory = document.createElement("p");
	inoutsCategory.classList.add("spacer");
	inoutsCategory.textContent = "Input/Output";
	componentList.appendChild(inoutsCategory);	

	for(let component of inoutComponents) {
		let componentElement = createComponentElement(component); 
		componentList.appendChild(componentElement);
	}
	
	// gate
	let gatesCategory = document.createElement("p");
	gatesCategory.classList.add("spacer");
	gatesCategory.textContent = "Gates";
	componentList.appendChild(gatesCategory);	

	for(let component of gateComponents) {
		let componentElement = createComponentElement(component); 
		componentList.appendChild(componentElement);
	}
}

// chiama la init quando il DOM è pronto 
document.addEventListener("DOMContentLoaded", init);
