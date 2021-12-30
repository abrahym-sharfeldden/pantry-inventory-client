/** @format */

import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import UserProvider from '../../hooks/UserProvider';

import { Recipes } from '../Recipes';

export default function RecipesList() {
	const userData = useContext(UserProvider.context).user;
	const { user } = userData || {};
	const url = 'http://localhost:3001';
	const [recipes, setRecipes] = useState([]);

	useEffect(() => {
		getAllRecipes();
	}, [user?.id]);

	const getAllRecipes = async () => {
		await axios
			.get(`${url}/recipes`, { withCredentials: true })
			.then(response => {
				console.log(response.data);
				setRecipes(response.data);
			})
			.catch(err => console.error(`Error: ${err}`));
	};

	return (
		<Container
			className="my-5 recipes-container d-flex flex-wrap flex-column"
			fluid
		>
			{user && (
				<p>
					Hi {user.email}! Your id is: <strong>{user.id}</strong>
				</p>
			)}

			<Container
				className="my-0 mx-auto flex-row flex-wrap justify-content-between"
				fluid="lg"
			>
				<h3 className="mt-2 mb-5">This Week's Top Recipes</h3>
				<Recipes recipes={recipes} user={user} />
			</Container>
		</Container>
	);
}
