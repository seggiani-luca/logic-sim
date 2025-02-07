// il modulo component.js si occupa di dichiarare i componenti e gestirne le connessioni e la 
// simulazione 

// importa da interface.js
import {
	// dimensioni griglia
	gridSize,
	// dimensioni pin
	pinRadius,
	pinPercent,
	pinStrokeWidth,
	// colori pin
	pinStrokeColor,
	pinInteriorDefault,
	pinInteriorHover,
	// sfumatura componenti in creazione
	componentFade,
	// dimensioni e colori di led
	ledRadius,
	onColor,
	offColor,
	hizColor,
	// funzione per l'aggiornamento dell'interfaccia (è il modo più veloce per
	// aggiornare l'interfaccia in fase di aggiornamento della logica)
	updateCanvas
} from "./interface.js";

// costanti di simulazione
const simMaxIters = 50;

// classe base per vettori 2d
export class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

// utilità aritmetiche per i vettori
function addVector(vec1, vec2) {
	let res = new Vector(vec1.x + vec2.x, vec1.y + vec2.y);
	return res;
}

// utilità per la quantizzazione di vettori alla griglia
function quantize(a, mod) {
	return Math.round(a / mod) * mod;
}
function quantizeVec(vec, mod) {
	return new Vector(quantize(vec.x, mod), quantize(vec.y, mod));
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

// classe base per i pin dei componenti
class Pin {
	constructor(type, component, index, position) {
		// tipo di pin (input, output)
		this.type = type;

		// riferimento al componente padre
		this.component = component;
		// indice nel padre
		this.index = index;

		// posizione, relativa al componente padre
		this.position = position;

		// la logica di connessione è piuttosto asimmetrica e viene implementata nelle specializzazioni
		// l'idea di base è che OutputPin si connette ad InputPin, e non viceversa (sia qui che
		// nell'interfaccia)
	}

	// ottiene la posizione assoluta del pin
	getPosition() {
		return this.component.getPinPosition(this.type, this.index);
	}

	// disegna il pin
	draw(ctx, base, style) {
		let xPos = this.position.x + base.x;
		let yPos = this.position.y + base.y;

		// interno
		ctx.beginPath();
		ctx.arc(xPos, yPos, pinRadius, 0, 2 * Math.PI);

		// disegna diversamente l'interno a seconda dello stato corrente
		switch(style) {
			case "hover":
				ctx.fillStyle = pinInteriorHover;
				break;

			default:
				ctx.fillStyle = pinInteriorDefault;
		}

		ctx.fill();

		// esterno
		ctx.beginPath();
		ctx.arc(xPos, yPos, pinRadius, 0, 2 * Math.PI);
		ctx.lineWidth = pinStrokeWidth;
		ctx.strokeStyle = pinStrokeColor;
		ctx.stroke();
	}
}

// pin di ingresso
class InputPin extends Pin {
	constructor(component, index, position) {
		super("input", component, index, position);

		// il pin connesso, per InputPin solo uno
		this.connectedPin = null;
	}

	// la funzione connect() degli InputPin verrà chiamata da un OutputPin. tutto quello che vogliamo
	// fare qui è segnalare a un eventuale pin già connesso che ci stiamo disconnettendo e 
	// connetterci al nuovo pin
	connect(pin) {
		// se sei connesso a un pin, disconnettiti
		if(this.connectedPin) {
			this.connectedPin.disconnect(this);
		}

		// connettiti al nuovo pin
		this.connectedPin = pin;
	}

	// la funzione disconnect() degli InputPin verrà, come sopra, chiamata da un OutputPin. ci
	// aspettiamo che lato OutputPin sia tutto in ordine, quindi ci limitiamo ad annullare il
	// riferimento
	disconnect() {
		this.connectedPin = null;
	}

	// se sei connesso ad un pin restituisci il suo valore, altrimenti restituisci alta impedenza
	get() {
		if(this.connectedPin) {
			// leggi dall'OutputPin e restituisci
			return this.connectedPin.value;
		} else {
			return null; // null rappresenta l'alta impedenza
		}
	}
}

// pin di uscita
class OutputPin extends Pin {
	constructor(component, index, position) {
		super("output", component, index, position);

		// l'OutputPin tiene conto del suo valore
		this.value = null;

		// possiamo connetterci a più di un InputPin
		this.connectedPins = [];
	}

	// la funzione connect() degli OutputPin si occupa di connettere un InputPin e segnalargli la
	// connessione
	connect(pin) {
		// evita aliasing
		let index = this.connectedPins.indexOf(pin);
		if(index != -1) {
			console.debug("Avoided pin connection because of same connection aliasing");
			return;
		}

		if(this === pin) {
			console.debug("Avoided pin connection because of self-self aliasing");
			return;
		}

		// evita di connettere pin dello stesso tipo
		if(pin.constructor == this.constructor) {
			console.debug("Avoided pin connection because of type mismatch");
			return;
		}

		// aggiungi il pin ai pin connessi
		this.connectedPins.push(pin);
		// segnala che ti sei connesso
		pin.connect(this);
	}

	// la funzione disconnect() deglli OutputPin prende un riferimento ad un pin, e lo disconnette se
	// gli è connesso, segnalandogli la disconnessione
	disconnect(pin) {
		let index = this.connectedPins.indexOf(pin);

		if (index !== -1) {
			// c'è, rimuovilo
			this.connectedPins.splice(index, 1);
			// segnala che ti sei disconnesso
			pin.disconnect();
		} else {
			console.error("Cannot disconnect pin ", pin);
		}
	}

	// disconnette tutti i pin connessi
	disconnectAll() {
		for(let pin of this.connectedPins) {
			pin.disconnect();
		}
	}

	// imposta il valore del pin e restituisce true se è cambiato qualcosa
	set(value) {
		console.debug("Pin at index " + this.index + " of component " + this.component.type +
		              " is being set to value " + value);

		// rileva cambiamenti
		let changed = value != this.value;
		// aggiorna il valore
		this.value = value;

		updateCanvas(); // dobbiamo aggiornare qui
		return changed;
	}
}

// classe base per i componenti
class Component {
	constructor(type,
	            inputNum, outputNum, // pin
	            width, height,       // dimensioni
	            position,            // posizione
	            symbolSrc) {         // simbolo

		// tipo di componente (AND, OR, ecc...)
		this.type = type;

		// geometria
		this.width = width;
		this.height = height;
		this.position = position;

		// simbolo
		if(symbolSrc != "") {
			this.symbol = new Image();
			this.symbol.src = symbolSrc;
		}

		// inizializza le array di pin
		this.inputs = new Array(inputNum).fill(null);
		this.outputs = new Array(outputNum).fill(null);
		// genera i pin
		this.createPins();
	}

	// genera i pin
	createPins() {
		// i pin di input stanno a sinistra
		let pinX = -this.width / 2 * gridSize - gridSize / 2;
		// disposti verticalmente a intervalli regolari centrati sull'asse orizzontale
		for(let i = 0; i < this.inputs.length; i++) {
			let pinY = (i - this.inputs.length / 2 + 0.5) * gridSize * this.height * pinPercent;

			let pinPosition = new Vector(pinX, pinY);
			this.inputs[i] = new InputPin(this, i, pinPosition);
		}

		// i pin di output stanno a destra
		pinX = this.width / 2 * gridSize + gridSize / 2;
		// come sopra, disposti verticalmente a intervalli regolari centrati sull'asse orizzontale
		for(let i = 0; i < this.outputs.length; i++) {
			let pinY = (i - this.outputs.length / 2 + 0.5) * gridSize * this.height * pinPercent;

			let pinPosition = new Vector(pinX, pinY);
			this.outputs[i] = new OutputPin(this, i, pinPosition);
		}
	}

	// disconnetti tutti i pin
	clearPins() {
		for(let input of this.inputs) {
			// gli input devono farsi disconnettere dai loro output
			let connectedPin = input.connectedPin;
			if(connectedPin) {
				connectedPin.disconnect(input);
			}
		}
		
		// poi disconnetti tutti gli output
		for(let output of this.outputs) {
			output.disconnectAll();
		}
	}

	// ottieni la posizione del pin di input o output a un certo indice
	getPinPosition(type, i) {
		let pinPosition;

		if(type === "input") {
			// vogliamo che le posizioni siano oggetti indipendenti
			// nota: si userebbe structuredClone(), ma non è compatibile con browser più vecchi
			pinPosition = pinPosition = JSON.parse(JSON.stringify(this.inputs[i].position));
		} else if(type === "output") {
			// come sopra
			pinPosition = pinPosition = JSON.parse(JSON.stringify(this.outputs[i].position));
		}

		if(pinPosition) {
			// le posizioni dei pin sono relative rispetto ai componenti
			pinPosition = addVector(this.position, pinPosition);
			return pinPosition;
		}

		return null;
	}

	// controlla se si sta facendo hover su un pin e nel caso lo restituisce
	hoveringPin(mousePosition) {
		for(let pin of this.inputs) {
			let pinPosition = pin.position;
			if(circleHover(mousePosition, addVector(this.position, pinPosition), pinRadius)) {
				return pin;
			}
		}

		for(let pin of this.outputs) {
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
	draw(ctx, mousePosition, fade = false) {
		// riporta le posizioni nell'angolo in alto a sinistra
		let drawX = this.position.x - gridSize * this.width / 2;
		let drawY = this.position.y - gridSize * this.height / 2;

		// rendi meno opaco se fade è true
		ctx.globalAlpha = fade ? componentFade : 1;

		// disegna l'immagine vettoriale che rappresenta il componente stesso
		ctx.drawImage(this.symbol, drawX, drawY, gridSize * this.width, gridSize * this.height);

		//resetta l'opacità
		ctx.globalAlpha = 1;

		let hovPin = this.hoveringPin(mousePosition);

		// disegna i pin
		for(let pin of [...this.inputs, ...this.outputs]) {
			let style = "default";
			if(!fade && pin == hovPin) {
				style = "hover";
			}

			pin.draw(ctx, this.position, style);
		}
	}
}

// morsetti di input / output
class InOutComponent extends Component {
	constructor(type,
	            inputNum, outputNum, // pin
	            width, height,       // dimensioni
	            position,            // posizione
	            symbolSrc) {         // simbolo
		super(type, inputNum, outputNum, width, height, position, symbolSrc);

		// valore logico
		this.value = false;
	}

	draw(ctx, mousePosition, fade = false) {
		super.draw(ctx, mousePosition, fade);

		// disegna un indicatore del valore di value
		// interno
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, ledRadius, 0, 2 * Math.PI);

		// il colore varia in base al valore di value
		switch(this.value) {
			case false:
				ctx.fillStyle = offColor;
				break;
			case true:
				ctx.fillStyle = onColor;
				break;
			default:
				ctx.fillStyle = hizColor; // null rappresenta l'alta impedenza
				break;
		}

		ctx.fill();

		// esterno
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, ledRadius, 0, 2 * Math.PI);
		ctx.strokeStyle = pinStrokeColor;
		ctx.lineWidth = pinStrokeWidth;
		ctx.stroke();
	}
}

export class Input extends InOutComponent {
	constructor(position) {
		super("IN",
		      0, 1,     // pin
		      2, 1,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/in.svg"); // simbolo
	}

	// restituisce il componente se si sta facendo hover sul pulsante
	hoveringButton(mousePosition) {
		if(circleHover(mousePosition, this.position, ledRadius)) {
			return true;
		}

		return false;
	}

	toggle() {
		this.value = !this.value;
	}

	evaluate() {
		return this.outputs[0].set(this.value);
	}
}

export class Output extends InOutComponent {
	constructor(position) {
		super("OUT",
		      1, 0,     // pin
		      2, 1,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/out.svg"); // simbolo

		// gli output partono in alta impedenza
		this.value = null;
	}

	evaluate() {
		this.value = this.inputs[0].get();
		return false; // non propagherà comunque a nessuno
	}
}

// porte logiche
export class NOTGate extends Component {
	constructor(position) {
		super("NOT",
		      1, 1,     // pin
		      1, 1,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/not.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		if(in1 == null) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(!in1);
	}
}

export class ANDGate extends Component {
	constructor(position) {
		super("AND",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/and.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(in1 && in2);
	}
}

export class NANDGate extends Component {
	constructor(position) {
		super("NAND",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/nand.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(!(in1 && in2));
	}
}

export class ORGate extends Component {
	constructor(position) {
		super("OR",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/or.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(in1 || in2);
	}
}

export class NORGate extends Component {
	constructor(position) {
		super("NOR",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/nor.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(!(in1 || in2));
	}
}

export class XORGate extends Component {
	constructor(position) {
		super("XOR",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/xor.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(in1 != in2);
	}
}

export class XNORGate extends Component {
	constructor(position) {
		super("XNOR",
		      2, 1,     // pin
		      2, 2,     // dimensioni
		      position, // posizione
		      "./assets/img/symbols/xnor.svg"); // simbolo
	}

	evaluate() {
		let in1 = this.inputs[0].get();
		let in2 = this.inputs[1].get();
		if((in1 == null) && (in2 == null)) {
			this.outputs[0].set(null);
			return null;
		}

		return this.outputs[0].set(in1 == in2);
	}
}

export class TextComponent extends Component {
	constructor(position) {
		super("Text",
		      0, 0,     // pin
		      2, 1,     // dimensioni
		      position, // posizione
		      "");

		this.text = "text";
	}

	draw(ctx) {
		let drawX = this.position.x - gridSize * this.width / 2;
		let drawY = this.position.y;	
		
		ctx.fillStyle = "black";
		ctx.font = "20px monospace";
		ctx.fillText(this.text, drawX, drawY);
	}

	evaluate() {
		return false;
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

export const miscComponents = [
	{ name: "Text", icon: "./assets/img/icons/text_icon.svg", type: TextComponent }
];

// aggiorna la logica dei componenti
export function updateLogic(components) {
	// mantieni un insieme dei componenti da aggiornare, iniziando con gli input
	let set = new Set(components.filter(c => c.type === "IN"));

	for (let i = 0; i < simMaxIters; i++) {
		console.debug("Processing logic at iteration " + i);

		// l'insieme alla prossima iterazione
		let nextSet = new Set();
		let stable = true;

		for (let instance of set) {
			if (instance.evaluate()) {
				console.debug("Component " + instance.type + " was unstable, doing another iteration");
				stable = false;

				// aggiungi i suoi successori
				for(let pin of instance.outputs) {
					for(let connectedPin of pin.connectedPins) {
						nextSet.add(connectedPin.component);
					}
				}
			}
		}

		if (stable) break;
		set = nextSet;
	}

	console.debug("Logic processing stopped");
}
