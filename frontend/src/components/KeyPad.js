import React, {useState, useEffect} from "react";

const KeyPad = ({release}) => {
	const [keyCode, setKeyCode] = useState("");

	const handleInput = event => {
		event.persist();
		const value = event.target.textContent;
		if (value === "C") {
			setKeyCode("");
			return;
		} else if (value === "OK") {
			if (keyCode === "1234")
				release();	
			return;
		}
		setKeyCode(oldCode => oldCode + value);
	};

	return (
		<section className="keypad">
			<section className="inner">
				<div className="display">
					<span>{keyCode}</span>
				</div>
				<button onClick={handleInput}>7</button>
				<button onClick={handleInput}>8</button>
				<button onClick={handleInput}>9</button>
				<button onClick={handleInput}>4</button>
				<button onClick={handleInput}>5</button>
				<button onClick={handleInput}>6</button>
				<button onClick={handleInput}>1</button>
				<button onClick={handleInput}>2</button>
				<button onClick={handleInput}>3</button>
				<button onClick={handleInput} className="btn btn-warning">C</button>
				<button onClick={handleInput}>0</button>
				<button onClick={handleInput} className="btn btn-success">OK</button>
			</section>
		</section>
	);
};

export default KeyPad;