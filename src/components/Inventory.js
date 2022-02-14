/** @format */

import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Container, Table, Badge, Form } from "react-bootstrap";
import { Trash, PencilSquare } from "react-bootstrap-icons";
import UserProvider from "../hooks/UserProvider";
import axios from "axios";

// import data from './dummy.json';
// import data from './MOCK_DATA.json';

export default function Inventory() {
	const userData = useContext(UserProvider.context);
	const { user } = userData.user || {};
	const [searchTerm, setSearchTerm] = useState("");
	const [inventoryItems, setInventoryItems] = useState([]);

	useEffect(() => {
		if (!user) return;
		axios
			.get("http://192.168.1.19:3001/inventory", {
				withCredentials: true,
			})
			.then(response => {
				const inventoryList = response.data.inventoryItems;

				setInventory(inventoryList);

				return () => {
					setInventoryItems([]);
				};
			})
			.catch(err => console.log(err));
	}, []);

	const setInventory = inventoryList => {
		setInventoryItems(inventoryList);
	};

	const displayInventory = () => {
		const obj = {
			inventory: { name: "yes", quantity: 5, unit: "cups" },
			status: "full",
		};

		if (!inventoryItems)
			return (
				<tr>
					<td colSpan="12">No inventory items</td>
				</tr>
			);

		return inventoryItems
			.filter(item =>
				item.inventory.name
					.toLowerCase()
					.includes(searchTerm.toLowerCase())
			)
			.map((inventory, key) => (
				<ShowRows
					key={key}
					inventory={inventory.inventory}
					status={inventory.status}
				/>
			));
	};

	const showInventoryTable = () => {
		return (
			<Container fluid="lg" style={{ marginTop: "5rem" }}>
				<input
					type="text"
					placeholder="Search.."
					onChange={e => setSearchTerm(e.target.value)}
				/>
				<Table className="align-middle" borderless hover>
					<thead className="text-muted">
						<tr>
							<th style={{ maxWidth: "350px", width: "30%" }}>
								Name
							</th>
							<th style={{ maxWidth: "200px", width: "20%" }}>
								Status
							</th>
							<th style={{ maxWidth: "150px", width: "10%" }}>
								Amount
							</th>
							<th style={{ maxWidth: "150px", width: "10%" }}>
								Units
							</th>
							<th style={{ width: "20%" }}></th>
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

function ShowRows({ inventory, status }) {
	const { name, quantity, unit } = inventory;
	const [edit, setEdit] = useState(false);
	const badgeBg = status.toLowerCase() === "error" ? "danger" : "success";

	// Refactor this code and styling of the edit
	return (
		<tr
			style={{
				border: "10px solid var(--bs-body-bg)",
			}}>
			<td>
				{!edit ? (
					name
				) : (
					<Form.Control type="text" defaultValue={name} />
				)}
			</td>
			<td style={{ padding: "1rem" }}>
				{!edit ? (
					<Badge bg={badgeBg}>{status}</Badge>
				) : (
					<Form>
						<Form.Check
							inline
							label={<Badge bg="success">Present</Badge>}
							name="group1"
							checked={status.toLowerCase() === "present"}
						/>
						<Form.Check
							inline
							label={<Badge bg="danger">Empty</Badge>}
							name="group1"
							checked={status.toLowerCase() === "error"}
						/>
					</Form>
				)}
			</td>
			<td>
				{!edit ? (
					quantity
				) : (
					<Form.Control type="number" defaultValue={quantity} />
				)}
			</td>
			<td>
				{" "}
				{!edit ? (
					unit
				) : (
					<Form.Control type="text" defaultValue={unit} />
				)}
			</td>
			<td>
				<PencilSquare
					onClick={() => setEdit(!edit)}
					size={18}
					style={{ margin: "0 .5rem" }}
				/>
				<Trash size={18} style={{ margin: " 0 .5rem" }} />
			</td>
		</tr>
	);
}
