// importa dall'interfaccia alcune costanti di dimensionamento e di stile
import { 
	gridSize, 
	pinRadius, 
	pinPercent, 
	pinStroke, 
	pinInterior 
} from "./interface.js";

// classe base per vettori 2d
class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// utilità aritmetiche per i vettori
function addVector(vec1, vec2) {
	res = new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
	return res;
}

// utilità per la quantizzazione di vettori alla griglia
function quantize(a, mod) {
	return Math.round(a / mod) * mod;
}

function quantizeVec(vec, mod) {
	return new Vector(quantize(vec.x, mod), 
										quantize(vec.y, mod));
}

// utilità per il rilevamento di hover
function rectHover(hoverPos, center, width, height) {
	let xFits = hoverPos.x < center.x + width / 2 && hoverPos.x > center.x - width / 2;
	let yFits = hoverPos.y < center.y + height / 2 && hoverPos.y > center.y - height / 2;
	
	return xFits && yFits;
}

function circleHover(hoverPos, center, radius) {
	let radiusSqr = radius ** 2;
	let distanceSqr = (center.x - hoverPos.x) ** 2 + (center.y - hoverPos.y) ** 2;
	
	return distanceSqr < radiusSqr;
}

// classe base per i pin
class Pin {
	constructor(component, index, position) {
		// riferimento al componente padre 
		this.component = component;
		// indice nel padre
		this.index = index;

		// posizione, relativa al componente padre
		this.position = position;
		
		this.connectedPin = null;
	}

	connect(pin) {
		// evita aliasing
		if(this.connectedPin !== pin) {
			this.connectedPin = pin;
			pin.connect(this);
		}
	}	

	// disegna il pin
	draw(ctx, base) {		
		// interno 
		ctx.beginPath();
		ctx.arc(this.position.x + base.x, this.position.y + base.y, 
						pinRadius, 0, 2 * Math.PI);
		ctx.fillStyle = pinInterior;
		ctx.fill();
		
		// esterno 
		ctx.beginPath();
		ctx.arc(this.position.x + base.x, this.position.y + base.y, 
						pinRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = pinStroke;
		ctx.stroke();
	}
}

// pin di ingresso
class InputPin extends Pin {
	constructor(component, index, position) {
		super(component, index, position);
	}

	get() {
		if(this.connectedPin) {
			return this.connectedPin.value;
		}
	}
}

// pin di uscita
class OutputPin extends Pin {
	constructor(component, index, position) {
		super(component, index, position);
		
		// il pin d i uscita tiene conto del suo valore
		this.value = false;
	}

	set(value) {
		this.value = value;
	}
} 

// classe base per i componenti
class Component {
	constructor(type, 
							inputNum, outputNum, 		// pin 
							width, height, 					// dimensioni
							position,								// posizione
							symbolSrc) {						// simbolo

		// tipo di componente (AND, OR, ecc...)
		this.type = type;

		// geometria 
		this.width = width;
		this.height = height;
		this.position = position;

		// simbolo
		this.symbol = new Image();
		this.symbol.src = symbolSrc;

		// inizializza le array di pin
		this.inputs = new Array(inputNum).fill(null);
		this.outputs = new Array(outputNum).fill(null);
		// genera i pin
		this.createPins();
	}

	// genera i pin
	createPins() {
		// i pin di input stanno a sinistra
		let pinX = -this.width / 2 * gridSize - pinRadius;
		// disposti verticalmente a intervalli regolari centrati sull'asse orizzontale 
		for(let i = 0; i < this.inputs.length; i++) {
			let pinY = (i - this.inputs.length / 2 + 0.5) * gridSize * this.height * pinPercent; 	
			
			let pinPosition = new Vector(pinX, pinY);
			this.inputs[i] = new InputPin(this, i, pinPosition);
		}
		
		// i pin di output stanno a destra
		pinX = this.width / 2 * gridSize + pinRadius;
		// come sopra
		for(let i = 0; i < this.outputs.length; i++) {
			let pinY = (i - this.outputs.length / 2 + 0.5) * gridSize * this.height * pinPercent; 	
			
			let pinPosition = new Vector(pinX, pinY);
			this.outputs[i] = new OutputPin(this, i, pinPosition);
		}
	}

	// ottieni la posizione del pin di input o output a un certo indice
	getPinPosition(type, i) {
		let pinPosition;

		if(type === "input") {
			// vogliamo che le posizioni siano oggetti indipendenti
			pinPosition = structuredClone(this.inputs[i].position);
		} else if(type === "output") {
			// come sopra
			pinPosition = structuredClone(this.outputs[i].position);
		}

		if(pinPosition) {
			// le posizioni dei pin sono relative rispetto ai componenti
			pinPosition = addVector(position, pinPosition);
			return pinPosition;
		}

		return null;
	}

	// controlla se si sta facendo hover su un pin e nel caso lo restituisce
	hoveringPin(mousePosition) {
		for(let pin of inputs) {
			let pinPosition = pin.position;
			if(circleHover(mousePosition, addVector(this.position, pinPosition), pinRadius)) {
				return pin;
			}
		}

		for(let pin of outputs) {
			let pinPosition = pin.position;	
			if(circleHover(mousePosition, addVector(this.position, pinPosition), pinRadius)) {
				return pin;
			}
		}

		return null;
	}

	// imposta la posizione del componente, allineandola alla griglia
	setPosition(newPosition) {
		// risulta più naturale se sposta newPosition nell'angolo in alto a sinistra
		newPosition.x -= gridSize * this.width / 2;
		newPosition.y -= gridSize * this.height / 2;

		let quantizedPosition = quantizeVec(newPosition, gridSize);

		// riporta la posizione al posto giusto
		quantizedPosition.x += gridSize * this.width / 2;
		quantizedPosition.y += gridSize * this.height / 2;

		this.position = quantizedPosition;
	}

	// controlla se si sta facendo hover sul componente
	hovering(mousePosition) {
		return rectHover(mousePosition,
										 this.position, 
										 this.width * gridSize, this.height * gridSize);
	}

	// ottiene un array di posizioni su cui controllare collisioni con altri componenti
	overlapPositions() {
		let positions = [];
		
		// sostanzialmente vogliamo tutte le caselle della griglia coperte dal componente 
		for(let x = 0; x < this.width; x++) {
			for(let y = 0; y < this.height; y++) {
				let posX = this.position.x + (x - this.width / 2 + 0.5) * gridSize;
				let posY = this.position.y + (y - this.height / 2 + 0.5) * gridSize;
				
				positions.push(new Vector(posX, posY));
			}
		}

		return positions;
	}

	// disegna il componente
	draw(ctx) {
		// riporta le posizioni nell'angolo in alto a sinistra
		let drawX = this.position.x - gridSize * this.width / 2;
		let drawY = this.position.y - gridSize * this.height / 2;

		// disegna il componente come un immagine vettoriale
    ctx.drawImage(this.symbol, 
									drawX, drawY, 
									gridSize * this.width, gridSize * this.height);

		// fai che i pin si disegnino 
		for(let pin of inputs) {
			pin.draw(ctx, this.position);
		}
		for(let pin of outputs) {
			pin.draw(ctx, this.position);
		}
	}
}

// morsetti di input / output
class Input extends Component {
	constructor(position) {
		super("IN", 
					0, 1, 		// pin 
					2, 1,			// dimensioni
					position,	// posizione
					"./assets/img/symbols/in.svg"); // simbolo

		// logic
		this.value = false;
	}

	evaluate() {
		this.outputs[0].set(false);
	}
}

class Output extends Component {
	constructor(position) {
		super("OUT", 
					1, 0, 		// pin 
					2, 1,			// dimensioni
					position, // posizione
					"./assets/img/symbols/out.svg"); // simbolo

		// valore logico 
		this.val = false;
	}	

	evaluate() {
		this.val = inputs[0].get();
	}
}

// porte logiche 
class NOTGate extends Component {
	constructor(position) {
		super("NOT", 
					1, 1, 		// pin 
					1, 1,			// dimensioni
					position, // posizione
					"./assets/img/symbols/not.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(!this.inputs[0].get());	
	}
}

class ANDGate extends Component {
	constructor(position) {
		super("AND",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position,	// posizione
					"./assets/img/symbols/and.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(this.inputs[0].get() && this.inputs[1].get());	
	}
}

class NANDGate extends Component {
	constructor(position) {
		super("NAND",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position,	// posizione
					"./assets/img/symbols/nand.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(!(this.inputs[0].get() && this.inputs[1].get()));	
	}
}

class ORGate extends Component {
	constructor(position) {
		super("OR",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position, // posizione
					"./assets/img/symbols/or.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(this.inputs[0].get() || this.inputs[1].get());	
	}
}

class NORGate extends Component {
	constructor(position) {
		super("NOR",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position, // posizione
					"./assets/img/symbols/nor.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(!(this.inputs[0].get() || this.inputs[1].get()));	
	}
}

class XORGate extends Component {
	constructor(position) {
		super("XOR",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position, // posizione
					"./assets/img/symbols/xor.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(this.inputs[0].get() != this.inputs[1].get());	
	}
}

class XNORGate extends Component {
	constructor(position) {
		super("XNOR",
					2, 1, 		// pin
					2, 2, 		// dimensioni
					position, // posizione
					"./assets/img/symbols/xnor.svg"); // simbolo
	}

	evaluate() {
		this.outputs[0].set(this.inputs[0].get() == this.inputs[1].get());	
	}
}

// tutti i componenti definiti sopra sono accessibili da qui all'interfaccia 
export const inoutComponents = [
	{ name: "Input", icon: "./assets/img/icons/in_icon.svg", type: Input },
	{ name: "Output", icon: "./assets/img/icons/out_icon.svg", type: Output }
];

export const gateComponents = [
	{ name: "NOT", icon: "./assets/img/icons/not_icon.svg", type: NOTGate },
	{ name: "AND", icon: "./assets/img/symbols/and.svg", type: ANDGate },
	{ name: "NAND", icon: "./assets/img/symbols/nand.svg", type: NANDGate },
	{ name: "OR", icon: "./assets/img/symbols/or.svg", type: ORGate },
	{ name: "NOR", icon: "./assets/img/symbols/nor.svg", type: NORGate },
	{ name: "XOR", icon: "./assets/img/symbols/xor.svg", type: XORGate },
	{ name: "XNOR", icon: "./assets/img/symbols/xnor.svg", type: XNORGate }
];
