/** @format */
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import UserProvider from "../hooks/UserProvider";
import axios from "axios";

export default function Header() {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	const [active, setActive] = useState("home");

	const redirectComponent = redirect => {
		changeComponent(redirect);
	};
	const handleLogOut = async () => {
		await axios
			.post(
				`${process.env.REACT_APP_API_URI}/logout`,
				{},
				{ withCredentials: true }
			)
			.then(() => {
				window.location = "/";
			});
	};

	const renderLogOut = () => {
		return (
			<>
				<NavDropdown.Item
					as={Link}
					to="/"
					className="text-danger"
					onClick={handleLogOut}>
					Log Out
				</NavDropdown.Item>
			</>
		);
	};

	const renderLogIn = () => {
		return (
			<>
				<NavDropdown.Item as={Link} to="/login">
					Log In
				</NavDropdown.Item>
				<NavDropdown.Item as={Link} to="/register">
					Register
				</NavDropdown.Item>
			</>
		);
	};

	const isLoggedIn = () => {
		return !user ? renderLogIn() : renderLogOut();
	};

	const render = () => {
		return (
			<Navbar bg="dark" variant="dark" expand="lg">
				<Container className="header-container-width" fluid="md">
					<Navbar.Brand as={Link} to="/">
						Pantry App
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav
							className="ml-auto"
							style={{ width: "100%" }}
							activeKey={active}
							onSelect={selected => setActive(selected)}>
							<Nav.Link as={Link} to="/">
								Home
							</Nav.Link>
							{!user ? (
								<>
									<Nav.Link as={Link} to="/login">
										Log In
									</Nav.Link>
									<Nav.Link as={Link} to="/register">
										Register
									</Nav.Link>
								</>
							) : (
								<>
									<Nav.Link
										as={Link}
										to="/"
										className="text-danger"
										onClick={handleLogOut}>
										Log Out
									</Nav.Link>
								</>
							)}
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	};

	return render();
}
