/** @format */

import { Col, Row } from 'react-bootstrap';
import { Recipe } from '../Recipe';

export default function Recipes(props) {
	const { recipes, user } = props;

	const displayRecipes = (recipes) => {
		if (recipes.length < 1) return <h3>No recipes yet</h3>;

		return recipes.map((recipe) => displayRecipeCards(recipe));
	};
	const displayRecipeCards = (recipe) => {
		return (
			<Col key={recipe.id} className="" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
				<Recipe recipe={recipe} user={user}/>
			</Col>
		);
	};

	return (
		<Row
			xs={1}
			sm={2}
			lg={3}
			className="row-container"
		>
			{' '}
			{displayRecipes(recipes)}{' '}
		</Row>
	);
}
