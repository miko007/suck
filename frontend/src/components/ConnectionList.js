import React, {useState, useEffect} from "react";
import axios from "axios";

const ConnectionList = (props) => {
	const {connected, port, setPort} = props;	

	const [list, setList] = useState([]);

	useEffect(() => {
			axios.get("/serial/interfaces").then(response => {
				setList(response.data);
			});
	}, []);

	if (connected) {
		return <></>;
	}


	return (
		<>
			<select className="form-control" value={port} style={{display: "inline", width: "auto", verticalAlign : "middle"}} onChange={event => setPort(event.target.value)}>
					{list.map(item => {
						return (
						<option key={item.path} value={item.path}>{item.path}</option>
						);
					})}
			</select>
		</>
	);
};

export default ConnectionList;
