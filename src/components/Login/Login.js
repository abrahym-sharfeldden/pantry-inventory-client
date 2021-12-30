/** @format */

import { useState, useContext } from 'react';
import axios from 'axios';
import { Container, Form, Button } from 'react-bootstrap';
import UserProvider from '../../hooks/UserProvider';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [redirect, setRedirect] = useState(null);
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	if (user?.id) setRedirect('/');

	const handleSubmit = async e => {
		e.preventDefault();

		await axios
			.post(
				'http://localhost:3001/login',
				{ email, password },
				{ withCredentials: true },
			)
			.then(response => {
				if (response.status === 200) setRedirect('/');
			})
			.catch(err => console.error(err));
	};

	return redirect ? (
		(window.location = '/')
	) : (
		<Container
			style={{ height: '90vh' }}
			className="d-flex flex-wrap flex-column align-items-center justify-content-center"
			fluid="xl"
		>
			<Form
				onSubmit={handleSubmit}
				className="d-flex flex-wrap flex-column justify-content-center"
				style={{
					width: '30%',
					minWidth: '350px',
					background: 'white',
					padding: '3rem',
				}}
			>
				<h2 className="text-muted">Log In</h2>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter email"
						onChange={e => setEmail(e.target.value)}
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
						onChange={e => setPassword(e.target.value)}
					/>
				</Form.Group>
				<Form.Group className="mb-3" controlId="formBasicCheckbox">
					<Form.Check type="checkbox" label="Check me out" />
				</Form.Group>
				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
		</Container>
	);
}
