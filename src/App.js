/** @format */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import { Header, RecipesList, Inventory, Login, Register } from './components';
import UserProvider from './hooks/UserProvider';

function App() {
	return (
		<Router>
			<Container style={{ padding: '0' }} fluid>
				<UserProvider>
					<Header />
					<Routes>
						<Route exact path="/inventory" element={<Inventory key={document.location.href}/>} />
						<Route exact path="/" element={<RecipesList key={document.location.href}/>} />

						<Route exact path="/login" element={<Login key={document.location.href}/>} />
						<Route exact path="/register" element={<Register key={document.location.href} />} />
					</Routes>
				</UserProvider>
			</Container>
		</Router>
	);
}

export default App;
