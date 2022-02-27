/** @format */

import { useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import UserProvider from "../hooks/UserProvider";

export default function Login() {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async e => {
		e.preventDefault();
		console.log(process.env);
		await axios
			.post(
				`${process.env.REACT_APP_API_URI}/login`,
				{ email, password },
				{ withCredentials: true }
			)
			.then(response => {
				window.location = "/";
			})
			.catch(err => {
				if (err.response.status === 401)
					console.log("Page didn't redirect - unauthorized");
				console.error(err);
			});
	};
	return user ? (
		<Navigate to="/" />
	) : (
		<Container
			style={{ height: "90vh" }}
			className="d-flex flex-wrap flex-column align-items-center justify-content-center"
			fluid="xl">
			<Form
				onSubmit={handleSubmit}
				className="d-flex flex-wrap flex-column justify-content-center"
				style={{
					width: "30%",
					minWidth: "350px",
					background: "white",
					padding: "3rem",
				}}>
				<h2 className="text-muted">Log In</h2>
				<Form.Group className="mb-3" controlId="formBasicEmail">
					<Form.Label>Email address</Form.Label>
					<Form.Control
						type="text"
						placeholder="Enter email"
						onChange={e => setEmail(e.target.value)}
					/>
					<Form.Text className="text-muted">
						Demo login:{" "}
						<b>
							<i>demo | pw123</i>
						</b>
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						type="password"
						placeholder="Password"
						onChange={e => setPassword(e.target.value)}
					/>
					<Form.Text className="text-muted">
						Don't have an account?{" "}
						<span className="text-decoration-underlined">
							Register
						</span>
					</Form.Text>
				</Form.Group>
				<Form.Group
					className="mb-4"
					controlId="formBasicCheckbox"></Form.Group>
				<Button variant="primary" type="submit">
					Submit
				</Button>
			</Form>
		</Container>
	);
}
