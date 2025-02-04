// importa le definizioni dei componenti 
import * as Component from "./component.js"

// costanti di dimensionamento e stile 
export const gridSize = 30;
const gridColor = "#dddddd";

export const pinRadius = 10;
export const pinPercent = 0.5;
export const pinStrokeWidth = 2;

export const pinStrokeColor = "#555555";
export const pinInteriorDefault = "#ffffff";
export const pinInteriorHover = "#cccccc";

const wireWidth = 5;
const hizColor = "#555555";
const bezierOffset = 100;

export const componentFade = 0.6;

export const ledRadius = 10;
export const onColor = "#3fff00";
export const offColor = "#ff2400";

// elementi html 
var deleteButtonElement;

// canvas
var canvas;
var ctx;

// lista componenti creati
var componentInstances = []; // TODO: probabilmente starebbe bene da qualche altra parte,
														 // come si carica e salva?
window.componentInstances = componentInstances; // TODO: debug

// l'interfaccia è una macchina a stati così definita:
//
//	variabili di stato:
//		currentComponent: un componente sul canvas selezionato
//		toCreateComponent: un nuovo componente da creare
//		currentPin: un pin di un componente sul canvas selezionato
//
//		currentComponent fa parte dei componenti definiti sul canvas e viene disegnato comunque,
//		toCreateComponent va disegnato solo quando si è su createComponent
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

	transition(event, payload) {
		console.debug("InterfaceHandler received event %c" + event + "%c, payload is:", "font-weight: bold;");
		console.debug(payload);
		
		switch(this.state) {
			case "rest":
				switch(event) {
					case "newComponent":
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;
						
						this.state = "createComponent";
						break;

					case "canvasClick":
						if(!payload) {
							break;
						}

						if(payload.type == "hoveringComponent") {
							this.currentComponent = payload.which;
							this.state = "handleComponent";
						}

						if(payload.type == "hoveringButton") {
							let component = payload.which;
							component.toggle();

							updateLogic();
						}

						if(payload.type == "hoveringPin") {
							let pin = payload.which;

							console.debug("Selected pin " + pin.type + " at index " + pin.index + " of object " 
								+ pin.component.type);

							// ci comportiamo diversamente per pin di input e di output:
							if(pin.type == "input") {
								// i pin di input devono trovare il loro pin di output e scollegarlo
								let connectedPin = pin.connectedPin;

								// se non c'è pin di output collegato non facciamo nulla
								if(!connectedPin) break;

								console.debug("Input pin is connected to " + connectedPin.type + " at index " 
									+ connectedPin.index + " of object " + connectedPin.component.type)
								
								// prendiamo il pin di output come pin di partenza
								this.currentPin = connectedPin;
								// e lo scolleghiamo
								connectedPin.disconnect(pin);
							} else if(pin.type == "output") {
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
							createComponent(this.toCreateComponent)
						}
						this.state = "rest";
						break;
				
					case "newComponent":
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;
							
						updateLogic();
						break;

					default:
						this.state = "rest";
				}
				break;
			
			case "handleComponent":
				switch(event) {
					case "newComponent":
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;
						
						this.state = "createComponent";
						break;
				
					case "canvasButtonClick":
						switch(payload.which) {
							case "delete":
								deleteComponent(this.currentComponent);
								this.state = "rest";
								break;
						}
						break;

					default:
						this.state = "rest";
						break;
				}

			case "dragPin":
				switch(event) {
					case "newComponent":
						let componentClass = payload.which;
						this.toCreateComponent = new componentClass;
						
						this.state = "createComponent";
						break;
				
					case "canvasClick":
						if(payload && payload.type == "hoveringPin") {
							let otherPin = payload.which;
						
							this.currentPin.connect(otherPin);
						}
						
						updateLogic();
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
window.handler = handler;

// variabili di stato del mouse
var mousePosition = new Component.Vector();
var mouseOnCanvas = false;

function init() {
	// ottieni gli elementi html 
	// pulsante di rimozione componenti
	deleteButtonElement = document.querySelector(".delete-button");
	deleteButtonElement.classList.add("hide");
	deleteButtonElement.addEventListener("click", (event) => {
		canvasButtonHandler(event, "delete") 
	});

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
	window.addEventListener("resize", resizeCanvas);
	
	// il mouse si interfaccia con handler aggiornando le sue variabili di stato e chiamando gli eventi
	// corrispondenti, con annessi payload se serve
	canvas.addEventListener("mouseenter", () => {
		mouseOnCanvas = true;
		updateCanvas(); // mousemove potrebbe non registrare subito
	});
	
	canvas.addEventListener("mouseleave", () => {
		mouseOnCanvas = false;
		updateCanvas(); // come sopra
	});

	canvas.addEventListener("mousemove", (event) => {
		mouseMoveHandler(event);
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
function screenToCanvas(x, y) {
  let rect = canvas.getBoundingClientRect();

	let posX = x - rect.left;
	let posY = y - rect.top;

	return new Component.Vector(posX, posY);
}

function canvasToScreen(pos) {
  let rect = canvas.getBoundingClientRect();

	let posX = pos.x + rect.left;
	let posY = pos.y + rect.top;

	return { x: posX, y: posY};
}

// funzioni di gestione del mouse
// getisce i movimenti del mouse (sul canvas, fuori non c'è nulla da fare)
function mouseMoveHandler(event) {
	mousePosition = screenToCanvas(event.clientX, event.clientY);

	updateCanvas();
}

// gestisce i click del mouse sul canvas
function canvasClickHandler() {
	for(let instance of componentInstances)	{
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

		// e poi se si sta facendo hover su un componente
		if(instance.hovering(mousePosition)) {
			let payload = { type: "hoveringComponent", which: instance };
			handler.transition("canvasClick", payload);
			return;
		}
	}

	handler.transition("canvasClick", null);
}

// gestisce i click del mouse sulla finestra
function windowClickHandler() {
	handler.transition("windowClick", null);
}

// gestisce i pulsanti sul canvas 
function canvasButtonHandler(event, which) {
	// ferma la propagazione dell'evento (in bubble up) fino alla finestra
	event.stopPropagation();

	handler.transition("canvasButtonClick", { which: which });
}

// disegna la griglia
function drawGrid() {
	ctx.lineWidth = 1;
	
	for(let y = 0; y <= canvas.height; y += gridSize) {
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(canvas.width, y);
		ctx.strokeStyle = gridColor;
		ctx.stroke();
	}

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

	let calcOffset = (endPos.x - startPos.x) / 2;
	let offset = calcOffset >= 0 ? Math.min(bezierOffset, calcOffset) : bezierOffset;

	let cp1 = { x: startPos.x + offset, y: startPos.y };
  let cp2 = { x: endPos.x - offset, y: endPos.y };

  ctx.moveTo(startPos.x, startPos.y);
  ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, endPos.x, endPos.y);
  
	ctx.stroke(); 
}

// aggiorna il canvas in fase di hover su di esso
function updateCanvas() {
	// ripulisci tutto
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// disegna la griglia
	drawGrid();

	// disegna i componenti
	for(let instance of componentInstances) {
		instance.draw(ctx, mousePosition);
	}

	// disegna il componente in creazione se esiste
	if(handler.state == "createComponent" && mouseOnCanvas) {
		let component = handler.toCreateComponent;
	
		component.setPosition(mousePosition);
		component.draw(ctx, mousePosition, true);
	}

	// disegna le connessioni fra i pin
	for(let instance of componentInstances) {
		for(let pin of instance.inputs) {
			let connectedPin = pin.connectedPin;

			if(connectedPin) {
				let color = connectedPin.value ? onColor : offColor;
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

// aggiorna la logica dei componenti
function updateLogic() {
	// aggiorna tutti i componenti
	for(let i = 0; i < 10; i++) {	
		// TODO: questo approccio supporta le asincrone, per me anche troppo. domani rendi meno dispendioso
		for(let instance of componentInstances) {
			instance.evaluate();
		}
	}
}

// trasferisce un istanza di component in componentInstances
function createComponent(instance) {
	// prima vogliamo controllare "collisioni", cioè caselle già coperte da altre istanze su cui si 
	// andrebbe a sovrapporre instance 
	let overlapPositions = instance.overlapPositions();

	for(let position of overlapPositions) {
		for(let checkingInstance of componentInstances) {
			if(checkingInstance.hovering(position)) {
				console.debug("Couldn't create component because of overlap");
				return;
			}
		}
	}

	// tutto ok, crea
	componentInstances.push(instance);
}

// elimina un istanza di componente
function deleteComponent(instance) {
	// trova l'indice dell'istanza
	let index = componentInstances.indexOf(instance);

	if (index !== -1) {
		// elimina i pin
		instance.clearPins();

		// rimuovi l'istanza
		componentInstances.splice(index, 1);
		deleteButtonElement.classList.add("hide");
	} else {
		console.error("Cannot delete component instance " + instance);
	}
}

// quando la finestra viene ridimensionata si vuole ridimensionare anche il canvas 
function resizeCanvas() {
	// bruttino, dipende dal CSS 
	let canvasWidth = window.innerWidth - 200;
	let canvasHeight = window.innerHeight - 50;
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

	for(let component of Component.inoutComponents) {
		let componentElement = createComponentElement(component); 
		componentList.appendChild(componentElement);
	}
	
	// gate
	let gatesCategory = document.createElement("p");
	gatesCategory.classList.add("spacer");
	gatesCategory.textContent = "Gates";
	componentList.appendChild(gatesCategory);	

	for(let component of Component.gateComponents) {
		let componentElement = createComponentElement(component); 
		componentList.appendChild(componentElement);
	}
}

// chiama la init quando il DOM è pronto 
document.addEventListener("DOMContentLoaded", init);
