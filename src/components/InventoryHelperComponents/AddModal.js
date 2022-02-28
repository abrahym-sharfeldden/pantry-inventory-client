import { useState } from "react";
import axios from "axios";
import { Col, Modal, Form, Row, Button } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";

export default function AddModal({ show, onHide, inventoryUpdater, items }) {
	const [rows, setRows] = useState([]);
	const [name, setName] = useState(null);
	const [quantity, setQuantity] = useState(null);
	const [unit, setUnit] = useState("");
	const [error, setError] = useState({ state: false, message: null });

	const handleSave = async () => {
		if (rows.length < 1) {
			setError({
				state: true,
				message: "Please fill in the form below",
			});
			return;
		}
		setError({
			state: false,
			message: null,
		});

		await axios
			.post(
				`${process.env.REACT_APP_API_URI}/inventory`,
				{ inventoryItems: rows },
				{ withCredentials: true }
			)
			.then(response => {
				inventoryUpdater(previousState => {
					const arr = rows.map((item, index) => {
						item.inventory.id = response.data[index].id;

						return item;
					});
					return [...previousState, ...arr];
				});
				onHide();
			})
			.catch(err => console.log(err));
	};

	const handleAdd = e => {
		e.preventDefault();

		// Checking to see if the new item already exists in the Inventory
		if (items.includes(name.toLowerCase())) {
			// If yes, display error message and exit;
			setError({
				state: true,
				message: "This item already exists, please edit it instead",
			});
			return;
		}

		// Ensure that the error value is always false if not returned above;
		setError({ state: false, message: null });

		setRows(prev => [
			...prev,
			{ inventory: { name, quantity, unit }, status: "full" },
		]);

		e.target.reset();
		setName("");
		setQuantity(0);
		setUnit("");
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Add a new item to your inventory
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form onSubmit={e => handleAdd(e)}>
					<Row style={{ paddingBottom: "20px" }}>
						{error.state && (
							<Form.Text className="text-danger">
								{error.message}
							</Form.Text>
						)}
						<Form.Group as={Col} xs={4}>
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
						<Form.Group as={Col} xs={3}>
							<Form.Control
								type="number"
								placeholder="Quantity"
								min={1}
								step={0.05}
								onChange={e => setQuantity(e.target.value)}
								required
							/>
							<Form.Text className="text-muted mx-1">
								Exclude units, eg: 1, 2.5
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col} xs={3}>
							<Form.Control
								as={Form.Select}
								value={unit}
								onChange={e => setUnit(e.target.value)}
								required>
								<option hidden="" value="">
									Open this select menu
								</option>
								<option value="cups">Cups</option>
								<option value="pounds">Pounds, lbs</option>
								<option value="milligrams">
									Milligrams, mg
								</option>
								<option value="tbsp">Tablespoons, tbsps</option>
							</Form.Control>
						</Form.Group>

						<Form.Group as={Col} xs={1}>
							<Button type="submit" variant="primary">
								<Plus size="24" />
							</Button>
						</Form.Group>
					</Row>
				</Form>
				{rows.map(({ inventory, status }, index) => {
					return (
						<p key={index}>
							<Button variant="primary" style={{ padding: "0" }}>
								<Dash size="18" />
							</Button>{" "}
							{inventory.quantity} {inventory.unit} of{" "}
							{inventory.name}
						</p>
					);
				})}
			</Modal.Body>
			<Modal.Footer>
				<Button variant="primary" onClick={() => handleSave()}>
					Add Item{rows.length !== 1 ? "s" : ""}
				</Button>
				<Button variant="danger" onClick={onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
