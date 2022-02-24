/** @format */
import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";
import { Header, Inventory, Login, Register } from "./components";
import UserProvider from "./hooks/UserProvider";

function App() {
	return (
		<Router>
			<Container style={{ padding: "0" }} fluid>
				<UserProvider>
					<Header />
					<Routes>
						<Route path="/" element={<p>404</p>} />
						<Route exact path="/" element={<Inventory />} />
						<Route exact path="/login" element={<Login />} />
						<Route exact path="/register" element={<Register />} />
					</Routes>
				</UserProvider>
			</Container>
		</Router>
	);
}

export default App;
