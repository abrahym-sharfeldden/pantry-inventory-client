/** @format */

import { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

export default function Register({ user }) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	// const [data, setData] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		await axios
			.post(
				'http://localhost:3001/register',
				{ email, password },
				{ withCredentials: true },
			)
			.then((res) => {
				// setData(res.data);
				console.log(res.data);
			})
			.catch((err) => console.log(err));
	};

	if(user)
		return <Navigate to="/" />

		
	return (
		<Container
			style={{ height: '90vh' }}
			className="d-flex flex-wrap flex-column align-items-center justify-content-center"
			fluid="xl"
		>
			<Form
				className="d-flex flex-wrap flex-column justify-content-center"
				style={{
					width: '30%',
					minWidth: '350px',
					background: 'white',
					padding: '3rem',
				}}
				onSubmit={handleSubmit}
			>
				<h2 className="text-muted">Register</h2>

				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="email"
						placeholder="Enter email"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Form.Text className="text-muted">
						We'll never share your email with anyone else.
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicCheckbox">
					<Form.Check type="checkbox" label="Check me out" />
				</Form.Group>
				<Button variant="primary" type="submit" >
					Submit
				</Button>
			</Form>
		</Container>
	);
}
