import React from "react";
import KeyboardedInput from "react-touch-screen-keyboard";
import "react-touch-screen-keyboard/lib/Keyboard.css"; // if you just want css
import "react-touch-screen-keyboard/lib/Keyboard.scss"; // if you've got sass-loader

class Input extends React.Component {
	render() {
		return (
			<KeyboardedInput
				enabled
				required
				type={this.props.type}
				onChange={this.props.onChange}
				onBlur={this.props.onBlur}
				onFocus={this.props.onFocus}
				value={this.props.value}
				min={this.props.min}
				max={this.props.max}
				step={this.props.step}
				name={this.props.name}
				inputClassName={this.props.inputClassName}
				keyboardClassName={this.props.keyboardClassName}
				placeholder={this.props.placeholder}
				defaultKeyboard="de"
				secondaryKeyboard="de" // optional
				isFirstLetterUppercase={true} // optional, default is `false`
				uppercaseAfterSpace={true} // optional, default is `false`
				isDraggable={false} // optional, default is `true`
				readOnly={this.props.readOnly} // optional
				opacity={1} // optional
			/>
		);
	}
}
export default Input;
