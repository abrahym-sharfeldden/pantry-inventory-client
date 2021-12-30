/** @format */
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import UserProvider from '../../hooks/UserProvider';
import axios from 'axios';

export default function Header() {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	const [active, setActive] = useState('home');

	const handleLogOut = async () => {
		await axios
			.post('http://localhost:3001/logout', {}, { withCredentials: true })
			.then(() => (window.location = '/'));
	};

	const renderLogOut = () => {
		return (
			<>
				<NavDropdown.Item
					as={Link}
					to="/"
					className="text-danger"
					onClick={handleLogOut}
				>
					Log Out
				</NavDropdown.Item>
			</>
		);
	};

	const renderLogIn = () => {
		return (
			<>
				{' '}
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
		console.log(user);
		return !user ? renderLogIn() : renderLogOut();
	};

	const render = () => {
		return (
			<Navbar
				bg="dark"
				variant="dark"
				expand="lg"
				fluid="true"
				className="justify-content-center"
				style={{ height: '10vh', maxHeight: 50, minHeight: 50 }}
			>
				<Container className="header-container-width" fluid="md">
					<Navbar.Brand as={Link} to="/">
						React-Bootstrap
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav
							className="justify-content-end"
							style={{ width: '100%' }}
							activeKey={active}
							onSelect={selected => setActive(selected)}
						>
							<Nav.Link as={Link} eventKey="home" to="/">
								Home
							</Nav.Link>
							<Nav.Link
								as={Link}
								eventKey="inventory"
								to="/inventory"
							>
								Inventory
							</Nav.Link>
							<NavDropdown
								title="Settings"
								id="basic-nav-dropdown"
							>
								{isLoggedIn()}

								<NavDropdown.Divider />
								<NavDropdown.Item href="#action/3.4">
									Settings
								</NavDropdown.Item>
							</NavDropdown>
						</Nav>
					</Navbar.Collapse>
				</Container>
			</Navbar>
		);
	};

	return render();
}
