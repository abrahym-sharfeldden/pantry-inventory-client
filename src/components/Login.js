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
	const [loading, setLoading] = useState(undefined);
	const [completed, setCompleted] = useState(undefined);
	const [validated, setValidated] = useState(false);
	const [loginFailure, setLoginFailure] = useState(false);

	const revertButton = () => {
		setTimeout(() => setLoginFailure(false), 500);
	};

	const handleSubmit = async e => {
		const form = e.currentTarget;
		e.preventDefault();
<<<<<<< Updated upstream
		e.stopPropagation();

		setValidated(true);

		if (!form.checkValidity()) {
			return;
		}

		setLoading(true);
=======
>>>>>>> Stashed changes
		await axios
			.post(
				`${process.env.REACT_APP_API_URI}/login`,
				{ email, password },
				{ withCredentials: true }
			)
			.then(response => {
				console.log(response);
				if (response.status === 200) {
					setLoading(false);
					setCompleted(true);
					setTimeout(() => {
						window.location = "/";
					}, 500);
				}
			})
			.catch(err => {
				setLoginFailure(true);
				setLoading(false);
				if (err.response.status === 401) {
					console.log("Incorrect email and/or password");
				} else if (err.response.status === 400) {
					console.log("Please enter an email and/or password");
					// console.log(err);
				}
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
				noValidate
				validated={validated}
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
						required
						type="email"
						placeholder="Enter email"
						onChange={e => setEmail(e.target.value)}
					/>
					<Form.Control.Feedback type="invalid">
						Please enter an email
					</Form.Control.Feedback>
					<Form.Text className="text-muted">
						Demo login:{" "}
						<b>
							<i>demo@email.com | pw123</i>
						</b>
					</Form.Text>
				</Form.Group>

				<Form.Group className="mb-3" controlId="formBasicPassword">
					<Form.Label>Password</Form.Label>
					<Form.Control
						required
						type="password"
						placeholder="Password"
						onChange={e => setPassword(e.target.value)}
					/>
					<Form.Control.Feedback type="invalid">
						Please enter a password
					</Form.Control.Feedback>
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
				{!completed ? (
					<>
						{!loading ? (
							<>
								{!loginFailure ? (
									<Button variant="primary" type="submit">
										Submit
									</Button>
								) : (
									<>
										<Button variant="danger" type="submit">
											<span className="failed">
												&#x2716;
											</span>
											<span>Login failed</span>
										</Button>
										{revertButton()}
									</>
								)}
							</>
						) : (
							<Button variant="primary">
								<div className="spinner">
									<span className="half-spinner"></span>
									<span>Loading...</span>
								</div>
							</Button>
						)}
					</>
				) : (
					<Button variant="success">
						<div className="spinner">
							<span className="completed">&#x2713;</span>
							<span>Completed...</span>
						</div>
					</Button>
				)}
			</Form>
		</Container>
	);
}
