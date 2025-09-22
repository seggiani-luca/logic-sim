// il modulo local.js fa quello che faceva session.js ma sul disco locale anziché su mariadb 

// importa da serialize.js
import {
	// funzioni per la serializzazione e deserializzazione di circuiti
	serializeCircuit,
	rebuildCircuit
} from "./serialize.js"

// funzioni salva/carica su locale
export function saveCircuitLocal(circuit, filename = "circuit.json") {
	console.log("Saving JSON to disk...");

	let json = serializeCircuit(circuit);
	let blob = new Blob([json], { type: "application/json" });
	let url = URL.createObjectURL(blob);

	// umpf
	let a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();

	URL.revokeObjectURL(url);
}

export async function loadCircuitLocal() {
	console.log("Loading JSON from disk...");

	return new Promise((resolve, reject) => {
		let input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = (e) => {
			let file = e.target.files[0];
			if(!file) return null;

			let reader = new FileReader();
			reader.onload = () => {
				try {
					let data = JSON.parse(reader.result);
					let circuit = rebuildCircuit(data);
					resolve(circuit);
				} catch(err) {
					reject(err);
				}
			};
			reader.readAsText(file);
		};
		
		input.click();
	});
}

export async function loadExampleCircuit(url) {
	let response = await fetch(url);
	if(!response.ok) throw new Error("Failed to load example circuit JSON");
	
	let data = await response.json();
	let circuit = rebuildCircuit(data);

	return circuit;
}
