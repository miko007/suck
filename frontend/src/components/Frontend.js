import React, {useState, useEffect} from "react";
import axios from "axios";

import useInterval from "../hooks/useInterval";

import ConnectionList from "./ConnectionList";
import BootstrapIcon from "../assets/icons/BootstrapIcon";

const Frontend = () => {
	const [connected, setConnected]   = useState(false);
	const [serialPort, setSerialPort] = useState("");

	axios.defaults.baseURL = `http://localhost:5000/api`;

	useInterval(() => {
		axios.get("/serial/connection").then(response => {
			if (response.hasOwnProperty("data") && response.data.status === "OK")
				setConnected(response.data.connected);
		});
	}, 4000);

	const items = new Array(10).fill(0);
console.log("render");

	const connect = event => {
		if (connected) {
			axios.get("/serial/disconnect");
			return;
		}
		console.log("connecting to", serialPort);
		axios.get(`/serial/connect${serialPort}`).then(response => {

		});
	}

	return (
		<>
			<nav className="navbar navbar-dark bg-primary sticky-top p-3">
				<section className="container-fluid">
					<a className="navbar-brand" href="#">
						SUCK
					</a>
					<span>
						<ConnectionList connected={connected} port={serialPort} setPort={setSerialPort} />
						<button className={`btn ${connected ? "btn-danger" : "btn-success"}`} style={{verticalAlign : "middle"}} onClick={connect}>
							<BootstrapIcon icon="plug" />
						</button>
					</span>
					<button className="navbar-toggler" type="button">
						<span className="navbar-toggler-icon"></span>
					</button>
				</section>
			</nav>
			<main style={{
				filter : connected ? "" : "blur(7px)",
				opacity : connected ? 1 : 0.6,
				transition : "0.2s ease-in-out"
			}}>
				<div className="row p-3">
					<form>
						<input
							type="text"
							placeholder="Suche..."
							className="form-control"
						/>
					</form>
				</div>
				<div className="row px-4">
					{items.map((item) => {
						return (
							<div className="col-md-3" key={Math.random()}>
								<article className="card my-3">
									<img src="images/demo.jpg" />
									<section className="card-body">Test</section>
								</article>
							</div>
						);
					})}
				</div>
			</main>
		</>
	);
};

export default Frontend;
