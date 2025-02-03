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

		// variabili di stato del mouse
		this.mouseX = 0;
		this.mouseY = 0;
		this.mouseOnCanvas = false;

		this.hoveringInstance = null;
		this.selectedInstance = null;

		this.hoveringPin = null;
		this.selectedPin = null;
	}

	transition(event, payload) {
		switch(this.state) {
			case 'rest':
				// segnaposto
				break;
			
			case 'createComponent':
				// segnaposto
				break;
			
			case 'handleComponent':
				// segnaposto
				break;

		}
	}
}

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
		handler.mouseOnCanvas = true;
		updateCanvas(); // mousemove potrebbe non registrare subito TODO: verifica se serve
	});
	
	canvas.addEventListener("mouseleave", () => {
		handler.mouseOnCanvas = false;
		updateCanvas(); // come sopra, TODO: come sopra
	});

	canvas.addEventListener("mousemove", (event) => {
		mouseMoveHandler(event);
	});

	canvas.addEventListener("click", (event) => {
		mouseClickHandler();
	});
}

// utilità per le trasformazioni da schermo a canvas 
function screenToCanvas(x, y) {
  let rect = canvas.getBoundingClientRect();

	let posX = x - rect.left;
	let posY = y - rect.top;

	return { x: posX, y: posY};
}

function canvasToScreen(x, y) {
  let rect = canvas.getBoundingClientRect();

	let posX = x + rect.left;
	let posY = y + rect.top;

	return { x: posX, y: posY};
}

// funzioni di gestione del mouse 
function mouseMoveHandler(event) {
	let position = screenToCanvas(event.clientX, event.clientY);
	mouseX = position.x;
	mouseY = position.y;
}

function mouseClickHandler() {
	// resetta il pulsante di reset 
	deleteButtonElement.classList.add("hide");
	
	if(hoveringPin) {
		// check if holding component, if yes remove it
		if(currentComponent) {
			currentComponent = null;
			updateCanvas();
			return;
		}
		
		// check if pin is selected
		if(selectedPin) {
			// it is, test if input/output and make connection
			if(selectedPin.type != hoveringPin.type) {
				selectedPin.pin.connect(hoveringPin.pin);
			}

			selectedPin = null;
		} else {
			// select pin and try connection
			selectedPin = hoveringPin;
		}
	} else if(hoveringInstance) {
		// check if holding component, if yes remove it
		if(currentComponent) {
			currentComponent = null;
			updateCanvas();
			return;
		}

		// clear pin
		selectedPin = null;

		let canvasPosition = hoveringInstance.getPosition();
		let position = canvasToScreen(canvasPosition.x, canvasPosition.y);

		deleteButtonElement.classList.remove("hide");
		deleteButtonElement.style.top = `${position.y + iconOffset}px`;
		deleteButtonElement.style.left = `${position.x + iconOffset}px`;

		selectedInstance = hoveringInstance;

	} else {
		// clear pin
		selectedPin = null;

		// check if holding component, if yes try adding
		if(currentComponent) {
			// still have to check object overlaps 
			let positions = currentComponent.overlapPositions();
			
			// check each overlap position with each object, slow 
			// but ideally hoveringInstance will catch it first
			for(let position of positions) {
				for(let istance of componentInstances) {
					if(istance.isHovering(position.x, position.y)) {
						// can't add, remove it and return
						currentComponent = null;
						updateCanvas();
						return;
					}
				}
			}

			componentInstances.push(currentComponent);
			currentComponent = null;
		}
	}
	// might have done something, pointer is still
	updateCanvas();
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
