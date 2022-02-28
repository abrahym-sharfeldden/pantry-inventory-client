/** @format */

import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import { Container, Table } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";

import { AddModal, ShowRows } from "./InventoryHelperComponents";
import UserProvider from "../hooks/UserProvider";
import axios from "axios";

export default function Inventory() {
	const { user } = useContext(UserProvider.context).user || {};
	const [searchTerm, setSearchTerm] = useState("");
	const [inventoryItems, setInventoryItems] = useState([]);
	const [show, setShow] = useState(false);
	const [itemNames, setItemNames] = useState([]);

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
				setItemNames(() =>
					inventoryList.map(({ inventory }) =>
						inventory.name.toLowerCase()
					)
				);
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
			.map(({ inventory, status }, key) => (
				<ShowRows
					key={key}
					inventory={inventory}
					status={status}
					inventoryUpdater={setInventory}
				/>
			));
	};

	const showInventoryTable = () => {
		return (
			<Container fluid="sm" style={{ marginTop: "5rem" }}>
				<h1>Inventory List</h1>
				<Container
					fluid="sm"
					className="d-flex justify-content-between align-items-center"
					style={{ paddingInline: 0, height: "50px" }}>
					<input
						type="search"
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
							<th>Edit</th>
							<th>Delete</th>
						</tr>
					</thead>
					<tbody>{displayInventory()}</tbody>
				</Table>

				<AddModal
					show={show}
					onHide={() => handleCloseModal(false)}
					inventoryUpdater={setInventory}
					items={itemNames}
				/>
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
