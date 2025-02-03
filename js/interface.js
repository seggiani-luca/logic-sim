// importa le definizioni dei componenti 
import * as Component from "./component.js"

// costanti di dimensionamento e stile 
export const gridSize = 30;
const gridColor = "#dddddd";

export const pinRadius = 5;
export const pinPercent = 0.5;

export const pinStroke = "#000000";
export const pinInterior = "#ffffff";

const iconOffset = 10;

// elementi html 
var deleteButtonElement;

// canvas
var canvas;
var ctx;

// lista componenti creati
var componentInstances = []; // TODO: probabilmente starebbe bene da qualche altra parte, 
														 // come si carica e salva?

// l'interfaccia è una macchina a stati così definita:
//
//	variabili di stato:
//		currentComponent: un componente sul canvas selezionato
//		selectedComponent: un nuovo componente da creare
//
//		currentComponent fa parte dei componenti definiti sul canvas e viene disegnato comunque,
//		selectedComponent va disegnato solo
//		
// - rest: non fare nulla
//		@ click componente lista componenti: -> createComponent, selectedComponent <- il componente cliccato
//		@ click componente su canvas: -> handleComponent, currentComponent <- il componente cliccato 
//
// - createComponent: se sul canvas, disegna il selectedComponent alla posizione del mouse
// 		@ click su canvas: se possibile crea il componente, altrimenti -> rest
// 		@ click fuori da canvas: -> rest
//
// - handleComponent: mostra i pulsanti di gestione del componente
//		@ click su deleteButton: elimina currentComponent, poi -> rest
//		@ click ovunque: -> rest

// dichiarazione della classe InterfaceHandler, che implementa la macchina a stati sopra definita
class InterfaceHandler {
	constructor() {
		this.state = 'rest';

		// variabili di stato della macchina a stati
		this.currentComponent = null;
		this.selectedComponent = null;
	}

	transition(event, payload) {
		switch(this.state) {
			case "rest":
				// segnaposto
				break;
			
			case "createComponent":
				// segnaposto
				break;
			
			case "handleComponent":
				// segnaposto
				break;

		}
	}
}

// variabili di stato del mouse
var mousePosition = new Vector();
var mouseOnCanvas = false;

// l'oggetto handler gestisce tutta l'interfaccia utente 
handler = new InterfaceHandler();

function init() {
	// ottieni gli elementi html 
	// pulsante di rimozione componenti
	deleteButtonElement = document.querySelector(".delete-button");
	deleteButtonElement.classList.add("hide");
	deleteButtonElement.addEventListener("click", deleteComponent);

	// lista dei componenti 
	let componentListElement = document.querySelector(".component-list");	
	initComponentList(componentListElement);

	// canvas
	canvas = document.querySelector(".workspace-canvas");
	ctx = canvas.getContext("2d");
	
	// inizializza il canvas
	resizeCanvas();
	// event listener per il ridimensionamento 
	window.addEventListener("resize", resizeCanvas);

	
	// il mouse si interfaccia con handler aggiornando le sue variabili di stato e chiamando gli eventi
	// corrispondenti, con annessi payload se serve
	canvas.addEventListener("mouseenter", () => {
		mouseOnCanvas = true;
		updateCanvas(); // mousemove potrebbe non registrare subito TODO: verifica se serve
	});
	
	canvas.addEventListener("mouseleave", () => {
		mouseOnCanvas = false;
		updateCanvas(); // come sopra, TODO: come sopra
	});

	canvas.addEventListener("mousemove", (event) => {
		mouseMoveHandler(event);
	});

	canvas.addEventListener("click", (event) => {
		// ferma la propagazione dell'evento (in bubble up) fino alla finestra
		event.stopPropagation();

		canvasClickHandler();
	});
	
	canvas.addEventListener("click", (event) => {
		windowClickHandler();
	});
}

// utilità per le trasformazioni da schermo a canvas 
function screenToCanvas(x, y) {
  let rect = canvas.getBoundingClientRect();

	let posX = x - rect.left;
	let posY = y - rect.top;

	return new Vector(posX, posY);
}

// TODO: sembrerebbe inutile
// function canvasToScreen(x, y) {
//   let rect = canvas.getBoundingClientRect();
// 
// 	let posX = x + rect.left;
// 	let posY = y + rect.top;
// 
// 	return { x: posX, y: posY};
// }

// funzioni di gestione del mouse
// getisce i movimenti del mouse (sul canvas, fuori non c'è nulla da fare)
function mouseMoveHandler(event) {
	mousePosition = screenToCanvas(event.clientX, event.clientY);
}

// gestisce i click del mouse, sul canvas
function canvasClickHandler() {
	for(let instance of componentInstances)	{
		// controlliamo prima se si facendo hover su un pin
		let hoveringPin = instance.isHoveringPin(mousePosition);
		if(hoveringPin) {
			payload = { type: "hoveringPin", hoveringPin };
			handler.transition("canvasClick", payload);
			return;
		}

		// e poi se si sta facendo hover su un componente
		if(instance.hovering(mousePosition)) {
			payload = { type: "hoveringComponent", instance };
			handler.transition("canvasClick");
			return;
		}
	}

	handler.transition("canvasClick", null);
}
// e sulla finestra 
function windowClickHandler() {
	handler.transition("windowClick", null);
}

// canvas
function updateCanvas() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	drawGrid();

	// draw actual components 
	hoveringInstance = null;
	hoveringPin = null;

	for(let instance of componentInstances) {
		// first check if hovering pin, then if hovering instance
		let thisHoveringPin = instance.isHoveringPin(mouseX, mouseY);
		if(thisHoveringPin) {	
			// hovering pin
			hoveringPin = thisHoveringPin;
			hoveringInstance = instance;
		} else if(instance.isHovering(mouseX, mouseY)) {
			// hovering instance
			hoveringInstance = instance;
		}

		instance.draw(ctx);
	}

	// draw dragged component
	if(currentComponent && mouseOnCanvas) {
		currentComponent.setPosition(mouseX,  mouseY);	
		currentComponent.draw(ctx);
	}

	// if making connection, draw temporary wire
	if(selectedPin && mouseOnCanvas) {
		let instance = selectedPin.pin.component;
		let pinPos = instance.getPinPosition(selectedPin.type, selectedPin.pin.index);
		drawWire(pinPos.x, pinPos.y, mouseX, mouseY);
	}
}

// disegna la griglia
function drawGrid() {
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

// disegna un filo di connessione fra pin TODO: temporaneo
function drawWire(startX, startY, endX, endY) {
  ctx.beginPath(); 
  ctx.moveTo(startX, startY);  
  ctx.lineTo(endX, endY);  
  ctx.stroke(); 
}

// quando la finestra viene ridimensionata si vuole ridimensionare anche il canvas 
function resizeCanvas() {
	// bruttino, dipende dal CSS 
	let canvasWidth = window.innerWidth * (5 / 6);
	let canvasHeight = window.innerHeight - 50;
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	updateCanvas();
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
		updateCurrentComponent(event, component.type)
	});

	return componentElement;
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

// gestisci il click su un componente 
function updateCurrentComponent(event, component) {
	// non propagare alla finestra 
	event.stopPropagation(); 

	currentComponent = new component;
	window.currentComponent = currentComponent;
}

// elimina un componente 
function deleteComponent() {
	let index = componentInstances.indexOf(selectedInstance);

	if (index !== -1) {
		componentInstances.splice(index, 1);
		selectedInstance = null;
		deleteButtonElement.classList.add("hide");
	}
}

// chiama la init quando il DOM è pronto 
document.addEventListener("DOMContentLoaded", init);
