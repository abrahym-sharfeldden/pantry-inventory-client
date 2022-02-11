/** @format */

import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

const context = createContext({
	user: null,
	setUser: (user) => {},
});

export default function UserProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		axios
			.get('http://localhost:3001/user', { withCredentials: true })
			.then((response) => setUser(response.data))
			.catch((err) => console.log(err));
	}, []);

	return (
		<context.Provider value={{ user, setUser }}>
			{children}
		</context.Provider>
	);
}
UserProvider.context = context;
