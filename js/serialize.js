// importa costruttori di componenti e pin da component.ks
import {
	Input,
	Output,
	NOTGate,
	ANDGate,
	NANDGate,
	ORGate,
	NORGate,
	XORGate,
	XNORGate
} from "./component.js"

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

function serializeInstance(instance, instances) {
	let obj = {};

	// copia proprietà di base
	obj.type = instance.type;
	obj.position = instance.position;

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

function getInstanceIndex(instance, instances) {
	// trova l'indice dell'istanza
	let index = instances.indexOf(instance);
	
	if (index !== -1) {
		return index;
	} else {
		console.error("Cannot find component instance " + instance);
	}
}

export function rebuildCircuit(json) {
	let obj = JSON.parse(json);;

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

function rebuildInstance(obj) {
	let instance;

	switch(obj.type) {
		case "IN":
			instance = new Input(obj.position);
			break;
		case "OUT":
			instance = new Output(obj.position);
			break;
		case "NOT":
			instance = new NOTGate(obj.position);
			break;
		case "AND":
			instance = new ANDGate(obj.position);
			break;
		case "NAND":
			instance = new NANDGate(obj.position);
			break;
		case "OR":
			instance = new ORGate(obj.position);
			break;
		case "NOR":
			instance = new NORGate(obj.position);
			break;
		case "XOR":
			instance = new XORGate(obj.position);
			break;
		case "XNOR":
			instance = new XNORGate(obj.position);
			break;
		default:
			console.error("Unkown component type " + obj.type);
	}

	return instance;
}

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
