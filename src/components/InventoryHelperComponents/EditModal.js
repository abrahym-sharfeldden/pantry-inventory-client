import axios from "axios";
import { useState } from "react";

import { Modal, Form, Button, Row, Col } from "react-bootstrap";

export default function EditModal({ show, onHide, inventoryUpdater, item }) {
	const [name, setName] = useState(item.name);
	const [quantity, setQuantity] = useState(item.quantity);
	const [unit, setUnit] = useState(item.unit);

	const handleEdit = async id => {
		await axios
			.put(
				`${process.env.REACT_APP_API_URI}/inventory/${id}`,
				{ inventory: { name, quantity, unit } },
				{ withCredentials: true }
			)
			.then(response => {
				inventoryUpdater(previousState => {
					const foundIndex = previousState.findIndex(
						element => element.inventory.id === response.data.id
					);
					previousState[foundIndex] = {
						inventory: { id, name, quantity, unit },
						status: "full",
					};

					return [...previousState];
				});
				onHide();
			})
			.catch(err => console.log(err));
	};
	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered>
			<Form>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Edit
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Form.Group as={Col} xs={5}>
							<Form.Control
								type="text"
								placeholder="Name"
								defaultValue={name}
								onChange={e => setName(e.target.value)}
								required
							/>

							<Form.Text className="text-muted mx-1">
								Be specific, eg: Brown Sugar | White Sugar vs
								Sugar
							</Form.Text>
						</Form.Group>
						<Form.Group as={Col} xs={4}>
							<Form.Control
								type="number"
								defaultValue={quantity}
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
								defaultValue={unit}
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
					</Row>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="warning"
						onClick={() => handleEdit(item.id)}>
						Edit
					</Button>
					<Button variant="primary" onClick={() => onHide()}>
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
