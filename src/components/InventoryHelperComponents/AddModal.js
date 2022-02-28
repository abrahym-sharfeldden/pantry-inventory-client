import { useState } from "react";
import axios from "axios";
import { Col, Modal, Form, Row, Button } from "react-bootstrap";
import { Plus, Dash } from "react-bootstrap-icons";

export default function AddModal(props) {
	const [rows, setRows] = useState([]);
	const [name, setName] = useState("");
	const [quantity, setQuantity] = useState(0);
	const [unit, setUnit] = useState("");

	const handleSave = () => {
		console.log("Attempt to save");

		axios
			.post(
				`${process.env.REACT_APP_API_URI}/inventory`,
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

	const handleAdd = e => {
		e.preventDefault();
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
				<Form onSubmit={e => handleAdd(e)}>
					<Row style={{ paddingBottom: "20px" }}>
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
								onChange={e => setQuantity(e.target.value)}
								required
							/>
							<Form.Text className="text-muted mx-1">
								Exclude units, eg: 1, 2.5
							</Form.Text>
						</Form.Group>

						<Form.Group as={Col} xs={3}>
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
				<Button variant="danger" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}
