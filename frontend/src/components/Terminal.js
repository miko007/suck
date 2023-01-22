import React, {useCallback, useEffect, useState, useRef} from "react";
import axios from "axios";

const Terminal = ({}) => {
	const prompt                            = useRef();
	const bufferView                        = useRef();
	const [shouldScroll, setShouldScroll]   = useState(true);
	const [buffer, setBuffer]               = useState("");
	const [promptContent, setPromptContent] = useState("");

	const send = useCallback(() => {
		axios.post("/serial/command", {command: promptContent});		
		setPromptContent("");
	}, [promptContent]);

	useEffect(() => {
		prompt.current.focus();
		const currentPrompt = prompt.current;

		const listener      = event => {
			currentPrompt.focus();
		};

		const enterListener = event => {
			if (event.key !== "Enter")
				return;
			send();
			setShouldScroll(true);
			console.log("ENTER");
		};

		const interval = setInterval(() => {
			axios.get("/serial/buffer").then(response => {
				setBuffer(response.data.content);
				if (shouldScroll)
					currentPrompt.scrollIntoView();
			});
		}, 1000);

		currentPrompt.addEventListener("blur", listener);
		currentPrompt.addEventListener("keydown", enterListener);

		return () => {
			clearInterval(interval);
			currentPrompt.removeEventListener("blur", listener);
			currentPrompt.removeEventListener("keydown", enterListener);
		};
	}, [prompt, send, bufferView, shouldScroll]);

	const handleInput = event => {
		setPromptContent(event.target.value);
	};

	return (
		<section className="terminal" onScroll={() => setShouldScroll(false)}>
			<pre className="buffer" ref={bufferView}>{buffer}</pre>
			<input type="text" value={promptContent} onChange={handleInput} ref={prompt} />
		</section>
	);
};

export default Terminal;