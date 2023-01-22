import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";

import {Save, FuelPumpFill} from "react-bootstrap-icons";

const ValveSetup = ({}) => {
	const [canSave, setCanSave]         = useState(false);
	const [numValves, setNumValves]     = useState(0);
	const [ingredients, setIngredients] = useState([]);
	const [valves, setValves]           = useState([]);

	useEffect(() => {
		axios.get("/valves/count").then(response => {
			console.log(response);
			setNumValves(response.data);
		});

		axios.get("/ingredients").then(response => {
			setIngredients(response.data);
		});

		axios.get("/valves").then(response => {
			setValves(response.data);
		});
	}, []);

	const update = (index, value) => {
		const newData = [...valves];

		newData[index] = value;

		setCanSave(true);
		setValves(newData);
	};

	const save = () => {
		axios.post("/valves", [...valves]).then(response => {
			if (response.data === "OK")
				setCanSave(false);
		});
	}

	return (
		<>
			<section className="wrapper form">
		 		<h2>Ventilsetup <button className="btn btn-success float-right" disabled={!canSave} onClick={save}><Save /> Speichern</button></h2>
				<p className="description">
					Ordne hier Zutaten den Ventilen entsprechend der tatsächlichen Bestückung zu.
				</p>
				<section className="grid ten-ninety form">
					{[...Array(numValves).keys()].map(i => (
						<>
							<label><FuelPumpFill /> Ventil {i +1}</label>
							<select className="form-control" onChange={event => update(i, event.target.value)} value={valves.length > i ? valves[i] : ""}>
								<option value="" disabled>Zutat auswählen</option>
								{ingredients.map(item => <option value={item.id}>{item.name}</option>)}
							</select>
						</>
					))}
				</section>
			</section>
		</>
	);
};

export default ValveSetup;