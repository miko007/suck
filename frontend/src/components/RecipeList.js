import React from "react";
import axios from "axios";

const pour = recipe => {
	axios.get(`/recipe/${recipe.id}/pour`).catch(error => console.log(error));
};

const RecipeList = ({recipes}) => {
	return (
		<>
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
				{recipes.map((item) => {
					return (
						<div className="col-md-3" key={Math.random()}>
							<article className="card my-3" onClick={() => pour(item)}>
								<img src="images/demo.jpg" />
								<section className="card-body">{item.name}</section>
							</article>
						</div>
					);
				})}
			</div>
		</>
	);
};

export default RecipeList;