/** @format */

import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Table, Badge, Form } from 'react-bootstrap';
import { Trash, PencilSquare } from 'react-bootstrap-icons';
import UserProvider from '../../hooks/UserProvider';
import axios from 'axios';

// import data from './dummy.json';
// import data from './MOCK_DATA.json';

export default function Inventory() {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};

	const [searchTerm, setSearchTerm] = useState('');
	const [inventory, setInventory] = useState([]);

	useEffect(() => {
		axios
			.get('http://localhost:3001/inventory', { withCredentials: true })
			.then(response => {
				console.log(response.data);
				setInventory(response.data);
			})
			.catch(err => console.log(err));
	}, []);

	const displayInventory = () => {
		// NOT SUITABLE FOR BIG DATA
		// Requires refactoring in future versions - consider BST

		return inventory
			.filter(val => {
				if (
					val.inventory.ingredient_name.name
						.toLowerCase()
						.startsWith(searchTerm.toLowerCase())
				)
					return val;
				return false;
			})
			.map((row, key) => <ShowRows key={key} row={row} />);
	};

	const showInventoryTable = () => {
		return (
			<Container fluid="lg" style={{ marginTop: '5rem' }}>
				<input
					type="text"
					placeholder="Search.."
					onChange={e => setSearchTerm(e.target.value)}
				/>
				<Table className="align-middle" borderless hover>
					<thead className="text-muted">
						<tr>
							<th style={{ maxWidth: '350px', width: '30%' }}>
								Name
							</th>
							<th style={{ maxWidth: '200px', width: '20%' }}>
								Status
							</th>
							<th style={{ maxWidth: '150px', width: '10%' }}>
								Amount
							</th>
							<th style={{ maxWidth: '150px', width: '10%' }}>
								Units
							</th>
							<th style={{ width: '20%' }}></th>
						</tr>
					</thead>
					<tbody>{displayInventory()}</tbody>
				</Table>
			</Container>
		);
	};
	const render = () => {
		if (!user) {
			return <Navigate to="/login" />;
		}

		return showInventoryTable();
	};

	return render();
}

function ShowRows({ row }) {
	const [edit, setEdit] = useState(false);
	const badgeBg = row.status.toLowerCase() === 'error' ? 'danger' : 'success';

	// Refactor this code and styling of the edit
	return (
		<tr
			style={{
				border: '10px solid var(--bs-body-bg)',
			}}
		>
			<td>
				{!edit ? (
					row.inventory.ingredient_name.name
				) : (
					<Form.Control
						type="text"
						defaultValue={row.inventory.ingredient_name.name}
					/>
				)}
			</td>
			<td style={{ padding: '1rem' }}>
				{!edit ? (
					<Badge bg={badgeBg}>{row.status}</Badge>
				) : (
					<Form>
						<Form.Check
							inline
							label={<Badge bg="success">Present</Badge>}
							name="group1"
							checked={row.status.toLowerCase() === 'present'}
						/>
						<Form.Check
							inline
							label={<Badge bg="danger">Empty</Badge>}
							name="group1"
							checked={row.status.toLowerCase() === 'error'}
						/>
					</Form>
				)}
			</td>
			<td>
				{' '}
				{!edit ? (
					row.inventory.ingredient_quantity.quantity
				) : (
					<Form.Control
						type="number"
						defaultValue={
							row.inventory.ingredient_quantity.quantity
						}
					/>
				)}
			</td>
			<td>
				{' '}
				{!edit ? (
					row.inventory.ingredient_unit.unit
				) : (
					<Form.Control
						type="text"
						defaultValue={row.inventory.ingredient_unit.unit}
					/>
				)}
			</td>
			<td>
				<PencilSquare
					onClick={() => setEdit(!edit)}
					size={18}
					style={{ margin: '0 .5rem' }}
				/>
				<Trash size={18} style={{ margin: ' 0 .5rem' }} />
			</td>
		</tr>
	);
}
