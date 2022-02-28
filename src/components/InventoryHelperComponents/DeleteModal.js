import { useState } from "react";
import axios from "axios";
import { Modal, Form, Row, Button } from "react-bootstrap";

export default function DeleteModal({ show, onHide, inventoryUpdater, item }) {
	const handleDelete = async id => {
		await axios
			.delete(`${process.env.REACT_APP_API_URI}/inventory/${id}`, {
				withCredentials: true,
			})
			.then(response => {
				inventoryUpdater(previousState =>
					previousState.filter(
						element => !(element.inventory.id === id)
					)
				);
				onHide();
			})
			.catch(err => console.log(err));
	};

	return (
		<Modal
			show={show}
			onHide={onHide}
			backdrop="static"
			size="sm"
			aria-labelledby="contained-modal-title-vcenter"
			centered>
			<Form>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Confirm Deletion
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form.Group xs={4}>
						<Form.Text>
							Are you sure you want to delete this item?
						</Form.Text>
					</Form.Group>

					<Row></Row>
				</Modal.Body>
				<Modal.Footer>
					<Button
						variant="danger"
						onClick={() => handleDelete(item.id)}>
						Delete
					</Button>
					<Button variant="primary" onClick={onHide}>
						Cancel
					</Button>
				</Modal.Footer>
			</Form>
		</Modal>
	);
}
