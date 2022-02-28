import { useState } from "react";
import { Badge } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { EditModal, DeleteModal } from "./";

export default function ShowRows({ inventory, status, inventoryUpdater }) {
	const [showDelete, setShowDelete] = useState(false);
	const [showEdit, setShowEdit] = useState(false);

	const { id, name, quantity, unit } = inventory;
	const badgeBg = status.toLowerCase() === "error" ? "danger" : "success";

	const handleShowDeleteModal = () => setShowDelete(true);
	const handleCloseDeleteModal = () => setShowDelete(false);
	const handleShowEditModal = () => setShowEdit(true);
	const handleCloseEditModal = () => setShowEdit(false);

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
			<td>
				<PencilSquare size={18} onClick={() => handleShowEditModal()} />

				<EditModal
					show={showEdit}
					onHide={() => handleCloseEditModal()}
					inventoryUpdater={inventoryUpdater}
					item={inventory}
					onClick={() => handleShowEditModal()}
				/>
			</td>
			<td style={{ color: "var(--bs-danger)" }}>
				<Trash size={18} onClick={handleShowDeleteModal} />

				<DeleteModal
					show={showDelete}
					onHide={handleCloseDeleteModal}
					inventoryUpdater={inventoryUpdater}
					item={inventory}
					onClick={handleShowDeleteModal}
				/>
			</td>
		</tr>
	);
}
