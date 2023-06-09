import React, {useState, useEffect, useCallback} from "react";
import {BrowserRouter as Router, Routes, Route, NavLink} from "react-router-dom";
import axios from "axios";

import useInterval from "../hooks/useInterval";

import {LockFill} from "react-bootstrap-icons";

import ConnectionList from "./ConnectionList";
import BootstrapIcon  from "../assets/icons/BootstrapIcon";
import KeyPad         from "./KeyPad";

import RecipeList from "./RecipeList";
import ValveSetup from "./ValveSetup";
import Terminal   from "./Terminal";

const Frontend = () => {
	const [recipes, setRecipes]       = useState([]);
	const [connected, setConnected]   = useState(false);
	const [serialPort, setSerialPort] = useState("");
	const [showKeyPad, setShowKeyPad] = useState(false);
	const [isAdmin, setIsAdmin]       = useState(true);

	axios.defaults.baseURL = `http://localhost:9000/api`;

	useInterval(() => {
		axios.get("/serial/connection").then(response => {
			if (response.hasOwnProperty("data") && response.data.status === "OK")
				setConnected(response.data.connected);
		});
	}, 4000);

	const connect = event => {
		if (connected) {
			axios.get("/serial/disconnect");
			return;
		}
		console.log("connecting to", serialPort);
		axios.get(`/serial/connect${serialPort}`).then(response => {

		});
	}
	
	const loadRecipes = useCallback(() => {
		axios.get("/recipes").then(response => {
			setRecipes(response.data);
		}).catch(error => console.log(error));
	}, []);

	useEffect(() => {
		loadRecipes();
	}, [loadRecipes]);

	const release = () => {
		setIsAdmin(true);
		setShowKeyPad(false);
	};

	return (
		<Router>
			<nav className="navbar navbar-dark bg-primary navbar-expand-lg sticky-top p-3" onDoubleClick={() => setShowKeyPad(true)}>
				<section className="container-fluid">
					<NavLink to="/" className="navbar-brand" href="#">
						SUCK
					</NavLink>
					{isAdmin ?
					<>
						<span className="ml-auto">
							<ConnectionList connected={connected} port={serialPort} setPort={setSerialPort} />
							<button className={`btn ${connected ? "btn-danger" : "btn-success"}`} style={{verticalAlign : "middle"}} onClick={connect}>
								<BootstrapIcon icon="plug" size="1.5em" />
							</button>
						</span>
						<ul className="navbar-nav ml-auto">
							<li className="navbar-item dropdown">
								<a href="#" className="nav-link" data-toggle="dropdown">
									<span className="navbar-toggler-icon"></span>
								</a>
								<section className="dropdown-menu dropdown-menu-right">
									<NavLink to="/valves" className="dropdown-item">Ventilsetup</NavLink>
									<NavLink to="/terminal" className="dropdown-item">Terminal</NavLink>
									<a  className="dropdown-item" href="#" onClick={() => setIsAdmin(false)}><LockFill /> Sperren</a>
								</section>
							</li>
						</ul>
					</>
					: null }
				</section>
			</nav>
			<main style={{
				filter : connected ? "" : "blur(7px)",
				opacity : connected ? 1 : 0.6,
				transition : "0.2s ease-in-out"
			}}>
				<Routes>
					<Route path="/" element={<RecipeList recipes={recipes} />} />
					<Route path="/valves" element={<ValveSetup />} />
					<Route path="/terminal" element={<Terminal />} />
				</Routes>
			</main>
		{showKeyPad ? <KeyPad release={release} /> : null}
		</Router>
	);
};

export default Frontend;
