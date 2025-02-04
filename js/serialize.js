// importa costruttori di componenti e pin da component.ks
import {
	Component,
	InputPin,
	OutputPin
} from "./component.js"

export function serializeCircuit(circuit) {
	let obj = { circuitName: circuit.circuitName, componentInstances: [] };
	let instances = circuit.componentInstances;

	for(let instance of instances) {
		obj.componentInstances.push(serializeInstance(instance, instances));
	}

	console.debug("Flattened object is:");
	console.debug(obj);

	let json = JSON.stringify(obj);
	return json;
}

// Component:
// constructor(type, 
// 						inputNum, outputNum, 		// pin 
// 						width, height, 					// dimensioni
// 						position,								// posizione
// 						symbolSrc) {						// simbolo

// Pin:
// constructor(component, index, position) {

function serializeInstance(instance, instances) {
	let obj = {};

	// copia proprietà di base
	obj.type = instance.type;
	obj.inputNum = instance.inputs.Length;
	obj.outputNum = instance.outputs.Length;
	obj.width = instance.width;
	obj.height = instance.width;
	obj.position = instance.position;
	obj.symbolSrc = instance.symbol.src;

	obj.inputs = [];
	obj.outputs = [];

	// copia i pin di input
	for(let pin of instance.inputs) {	
		let pinCopy = {};
		
		pinCopy.index = pin.index;
		pinCopy.position = pin.position;

		// per gli input appiattisci il pin collegato
		let connectedPin = { ...pin.connectedPin };
		
		let connectedComponentIdx = getInstanceIndex(connectedPin.component, instances);
		let connectedPinIdx = connectedPin.index;

		// appiattisci il pin a due indici: uno al componente e uno al pin nel componente
		pinCopy.connectedPin = { componentIdx: connectedComponentIdx, pinIdx: connectedPinIdx };
	
		obj.inputs.push(pinCopy);
	}

	// copia i pin di output
	for(let pin of instance.outputs) {
		let pinCopy = {};

		pinCopy.index = pin.index;
		pinCopy.position = pin.position;

		pin.connectedPins = [...pin.connectedPins];
		pinCopy.connectedPins = [];

		// per gli output appiattisci tutti i pin collegati
		for(let i = 0; i < pin.connectedPins.length; i++) {
			let connectedPin = { ...pin.connectedPins[i] };
			
			let connectedComponentIdx = getInstanceIndex(connectedPin.component, instances);
			let connectedPinIdx = connectedPin.index;

			// appiattisci il pin a due indici: uno al componente e uno al pin nel componente
			pinCopy.connectedPins[i] = { componentIdx: connectedComponentIdx, pinIdx: connectedPinIdx };
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
	
	let instances = obj.componentInstances;

	for(let instance of instances) {
		instance = rebuildInstance(instance, instances);		
	}

	return obj;
}

function rebuildInstance(obj, instances) {
	let instance = new Component(obj.type, 
															 obj.inputNum, obj.outputNum,
															 obj.width, obj.height, 		 
															 obj.position,					 
															 obj.symbolSrc);

	// espandi i pin di input
	for(let pin of obj.inputs) {
		let pinInstance = new InputPin(instance, pin.pinIdx, pin.position);

		let componentIdx = pin.connectedPin.componentIdx;
		let pinIdx = pin.connectedPin.pinIdx;

		pinInstance.connectedPin = instances[componentIdx].outputs[pinIdx];
	}

	// espandi i pin di output
	for(let pin of obj.outputs) {
		pin.component = obj;
		
		// per gli output appiattisci tutti i pin collegati
		for(let i = 0; i < pin.connectedPins.length; i++) {
			let connectedPin = pin.connectedPins[i];

			let componentIdx = connectedPin.componentIdx;
			let pinIdx = connectedPin.pinIdx;

			connectedPin = instances[componentIdx].inputs[pinIdx];
			pin.connectedPins[i] = connectedPin;
		}
	}
}
