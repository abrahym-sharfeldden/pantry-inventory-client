/** @format */

import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";

import { AddModal, EditModal, ShowRows } from "./InventoryHelperComponents";
import UserProvider from "../hooks/UserProvider";
import axios from "axios";

// import data from './dummy.json';
// import data from './MOCK_DATA.json';

export default function Inventory() {
	const { user } = useContext(UserProvider.context).user || {};
	const [searchTerm, setSearchTerm] = useState("");
	const [inventoryItems, setInventoryItems] = useState([]);
	const [show, setShow] = useState(false);

	const handleShowModal = () => setShow(true);
	const handleCloseModal = () => setShow(false);

	useEffect(() => {
		if (!user) return;
		axios
			.get(`${process.env.REACT_APP_API_URI}/inventory`, {
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
		if (!inventoryItems)
			return (
				<tr>
					<td colSpan="11">No inventory items</td>
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
					inventoryUpdater={setInventory}
				/>
			));
	};

	const showInventoryTable = () => {
		return (
			<Container fluid="lg" style={{ marginTop: "5rem" }}>
				<Container
					className="d-flex justify-content-between align-items-center"
					style={{ paddingInline: 0, height: "50px" }}>
					<input
						type="text"
						placeholder="Search.."
						onChange={e => setSearchTerm(e.target.value)}
					/>
					<PlusCircleFill
						size={36}
						onClick={() => handleShowModal(true)}
					/>
				</Container>
				<Table size="lg" className="align-middle" borderless hover>
					<thead
						className="text-muted"
						style={{ borderTop: "10px solid var(--bs-body-bg)" }}>
						<tr>
							<th>Name</th>
							<th>Status</th>
							<th>Amount</th>
							<th>Units</th>
							<th></th>
							<th></th>
						</tr>
					</thead>
					<tbody>{displayInventory()}</tbody>
				</Table>

				<AddModal show={show} onHide={() => handleCloseModal(false)} />
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
