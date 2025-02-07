// il modulo serialize.js fornisce funzioni per la serializzazione e deserializzazione di circuiti

// importa costruttori di componenti e pin da component.js
import {
	Input,
	Output,
	NOTGate,
	ANDGate,
	NANDGate,
	ORGate,
	NORGate,
	XORGate,
	XNORGate,
	TextComponent
} from "./component.js"

// mappa da tipo componente alla classe corrispondente
const componentClasses = {
	"IN": Input,
	"OUT": Output,
	"NOT": NOTGate,
	"AND": ANDGate,
	"NAND": NANDGate,
	"OR": ORGate,
	"NOR": NORGate,
	"XOR": XORGate,
	"XNOR": XNORGate,
	"Text": TextComponent
};

// serializza un circuito
export function serializeCircuit(circuit) {
	let obj = { circuitName: circuit.circuitName, componentInstances: [] };
	let instances = circuit.componentInstances;

	// serializza tutti i componenti
	for(let instance of instances) {
		obj.componentInstances.push(serializeInstance(instance, instances));
	}

	let json = JSON.stringify(obj);
	return json;
}

// serializza un istanza di componente
function serializeInstance(instance, instances) {
	let obj = {};

	// copia proprietà di base
	obj.type = instance.type;
	obj.position = instance.position;

	// se è testo, ricordalo
	if(instance.type == "Text") {
		obj.text = instance.text;
	}

	obj.outputs = [];

	// copia i pin di output
	for(let pin of instance.outputs) {
		let pinCopy = { connectedPins: [] };

		// per gli output appiattisci tutti i pin collegati
		for(let connectedPin of pin.connectedPins) {
			let connectedComponentIdx = getInstanceIndex(connectedPin.component, instances);
			let connectedPinIdx = connectedPin.index;

			// appiattisci il pin a due indici: uno al componente e uno al pin nel componente
			pinCopy.connectedPins.push({ componentIdx: connectedComponentIdx, pinIdx: connectedPinIdx });
		}

		obj.outputs.push(pinCopy);
	}

	return obj;
}

// ottiene l'indice di un istanza all'interno di un array di istanze
function getInstanceIndex(instance, instances) {
	// trova l'indice dell'istanza
	let index = instances.indexOf(instance);

	if (index !== -1) {
		return index;
	} else {
		console.error("Cannot find component instance ", instance);
	}
}

// ricostruisce il circuito dall'oggetto serializzato
export function rebuildCircuit(obj) {
	let circuit = { circuitName: obj.circuitName, componentInstances: [] };

	// ricostruisci tutti i componenti
	let instances = obj.componentInstances;
	for(let instance of instances) {
		circuit.componentInstances.push(rebuildInstance(instance, instances));
	}

	// ristabilisci le connessioni fra componenti
	for(let i = 0; i < instances.length; i++) {
		rebuildConnections(instances[i], circuit.componentInstances[i], circuit.componentInstances);
	}

	return circuit;
}

// ricostruisce un istanza dall'oggetto serializzato
function rebuildInstance(obj) {
	// ottieni un riferimento alla classe del componente
	let componentClass = componentClasses[obj.type];
	
	if(!componentClass) {
		// il componente non è valido
		console.error("Unkown component type ", obj.type);
		return null;
	}

	// istanzia il componente 
	let instance = new componentClass(obj.position);

	if(obj.type = "Text") {
		instance.text = obj.text;
	}

	// restituisci il componente 
	return instance;
}

// rimette al loro posto le connessioni delle istanze ricostruite
function rebuildConnections(obj, instance, instances) {
	for(let i = 0; i < obj.outputs.length; i++) {
		for(let connectedPin of obj.outputs[i].connectedPins) {
			let componentIdx = connectedPin.componentIdx;
			let pinIdx = connectedPin.pinIdx;

			let otherPin = instances[componentIdx].inputs[pinIdx];

			instance.outputs[i].connect(otherPin);
		}
	}
}
