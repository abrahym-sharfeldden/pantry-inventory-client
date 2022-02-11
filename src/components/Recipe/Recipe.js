/** @format */

import { useState, useEffect, useContext } from 'react';

import { Col, Card, Row } from 'react-bootstrap';
import { Heart, HeartFill, Clock } from 'react-bootstrap-icons';
import axios from 'axios';
import UserProvider from '../../hooks/UserProvider';

import a from './imgs/a.jpg';
import b from './imgs/b.jpg';
import c from './imgs/c.jpg';

export default function Recipe({ recipe }) {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	console.log(user);
	const [open, setOpen] = useState(false);
	const [fill, setFill] = useState(false);
	const imgs = [a, b, c];

	useEffect(() => {
		showHeart();

		axios
			.get(`http://localhost:3001/recipes/${recipe.id}`, {
				withCredentials: true,
			})
			.then(result => {
				recipe = result.data;
				const someBool = recipe.recipesLikedByUsers.some(
					ele => ele.id === user?.id,
				);
				setFill(someBool);
			});
	}, [user, fill]);

	const displayIngredients = ({
		id,
		ingredient_name,
		ingredient_quantity,
		ingredient_unit,
	}) => {
		const key = id.substring(0, 8);
		const { name } = ingredient_name;
		const { quantity } = ingredient_quantity;
		const { unit } = ingredient_unit;

		return (
			<span key={key}>
				{quantity} {unit} - {name} <br />
			</span>
		);
	};

	const displayIngredientsList = ingredientsList => {
		return ingredientsList.map(ingredient =>
			displayIngredients(ingredient),
		);
	};

	const showHeart = () => {
		return fill ? (
			<HeartFill onClick={handleHeartFilledClick} />
		) : (
			<Heart onClick={handleHeartClick} />
		);
	};

	const handleHeartClick = async () => {
		if (!user) return;
		await axios
			.post(
				'http://localhost:3001/like',
				{ recipeId: recipe.id },
				{ withCredentials: true },
			)
			.then(response => {
				if (response.status === 200) {
					console.log(response.data);
					setFill(true);
				}
			});
	};

	const handleHeartFilledClick = async () => {
		if (!user) return;

		await axios
			.delete(`http://localhost:3001/like/${recipe.id}`, {
				withCredentials: true,
			})
			.then(response => {
				if (response.status === 200) {
					console.log(response.data);
					setFill(false);
				}
			});
	};

	return (
		<Card
			style={{ maxWidth: '21rem', border: 'none' }}
			// onClick={() => setOpen(!open)}
		>
			<Card.Img
				variant="top"
				src={imgs[Math.floor(Math.random() * 3)]}
				alt={recipe.name}
				fluid="true"
				thumbnail="true"
				className="card-image"
				style={{
					border: 'none',
					objectFit: 'cover',
					height: '35vh',
					maxHeight: '14rem',
				}}
			/>
			<Card.Body style={{ paddingBottom: '1.5rem' }}>
				<Card.Title style={{ width: '15rem', height: '3.35rem' }}>
					{recipe.name}
				</Card.Title>
				{open && (
					<Card.Text>
						{displayIngredientsList(recipe.ingredients)}
					</Card.Text>
				)}
				<Row className="text-muted">
					<Col xs={2}>{showHeart()}</Col>
					<Col xs={5}></Col>
					<Col xs={5}>
						<Clock className="" /> 45 mins
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
}
