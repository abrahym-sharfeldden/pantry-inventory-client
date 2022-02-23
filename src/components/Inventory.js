/** @format */

import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import {
	Container,
	Table,
	Badge,
	Form,
	Modal,
	Button,
	Row,
	Col,
} from "react-bootstrap";
import {
	PlusCircleFill,
	Plus,
	Dash,
	Trash,
	PencilSquare,
} from "react-bootstrap-icons";
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
			.get("https://pantry-api.abrahym.dev/inventory", {
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

				<ShowAddModal
					show={show}
					onHide={() => handleCloseModal(false)}
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

function ShowRows({ inventory, status, inventoryUpdater }) {
	const { id, name, quantity, unit } = inventory;
	const badgeBg = status.toLowerCase() === "error" ? "danger" : "success";

	const handleDelete = id => {
		axios
			.delete(`https://pantry-api.abrahym.dev/inventory/${id}`, {
				withCredentials: true,
			})
			.then(response => {
				console.log(response);
				inventoryUpdater(previousState =>
					previousState.filter(
						element => !(element.inventory.id === id)
					)
				);
			})
			.catch(err => console.log(err));
	};

	// Refactor this code and styling of the edit
	return (
		<tr
			style={{
				borderBlock: "10px solid var(--bs-body-bg)",
			}}>
			<td>{name}</td>
			<td>
				<Badge bg={badgeBg}>{status}</Badge>
			</td>
			<td>{quantity}</td>
			<td>{unit}</td>
			<td style={{ textAlign: "center" }}>
				<PencilSquare size={18} />
			</td>
			<td style={{ textAlign: "center", color: "var(--bs-danger)" }}>
				<Trash size={18} onClick={() => handleDelete(id)} />
			</td>
		</tr>
	);
}

function ShowAddModal(props) {
	const [rows, setRows] = useState([]);
	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [unit, setUnit] = useState("");

	const handleSave = () => {
		console.log("Attempt to save");

		axios
			.post(
				`https://pantry-api.abrahym.dev/inventory`,
				{ inventoryItems: rows },
				{ withCredentials: true }
			)
			.then(response => {
				setRows([]);
				setName("");
				setQuantity(0);
				setUnit("");
			})
			.catch(err => console.log(err));
	};

	const handleAdd = () => {
		const obj = {
			inventory: { name, quantity, unit },
			status: "full",
		};

		setRows(prev => [...prev, obj]);
	};

	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Add a new item to your inventory
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Row style={{ paddingBottom: "20px" }}>
						<Form.Group as={Col} xs={6}>
							<Form.Control
								type="text"
								placeholder="Name"
								onChange={e => setName(e.target.value)}
								required
							/>

							<Form.Text className="text-muted mx-1">
								Be specific, eg: Brown Sugar | White Sugar vs
								Sugar
							</Form.Text>
						</Form.Group>
						<Form.Group as={Col}>
							<Form.Control
								type="number"
								placeholder="Quantity"
								onChange={e => setQuantity(e.target.value)}
								required
							/>
							<Form.Text className="text-muted mx-1">
								Exclude units, eg: 1, 2.5
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col}>
							<Form.Control
								type="text"
								placeholder="Units"
								onChange={e => setUnit(e.target.value)}
								required
							/>
							<Form.Text className="text-muted mx-1">
								eg: cups, tbsp, mg, lbs
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col} xs={1}>
							<Button variant="primary">
								<Plus size="24" onClick={() => handleAdd()} />
							</Button>
						</Form.Group>
					</Row>
					{rows.map((row, index) => (
						<p key={index}>
							<Button variant="primary" style={{ padding: "0" }}>
								<Dash size="18" />
							</Button>{" "}
							{row.quantity} {row.unit} of {row.name}
						</p>
					))}
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={() => handleSave()}>
					Add Item{rows.length !== 1 ? "s" : ""}
				</Button>
				<Button variant="danger" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
