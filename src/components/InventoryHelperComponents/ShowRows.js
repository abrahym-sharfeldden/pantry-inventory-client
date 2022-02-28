import { Badge } from "react-bootstrap";
import { PencilSquare, Trash } from "react-bootstrap-icons";

export default function ShowRows({ inventory, status, inventoryUpdater }) {
	const { id, name, quantity, unit } = inventory;
	const badgeBg = status.toLowerCase() === "error" ? "danger" : "success";

	const handleDelete = id => {
		axios
			.delete(`${process.env.REACT_APP_API_URI}/inventory/${id}`, {
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

	const handleEdit = inventoryItem => {};

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
				<PencilSquare
					size={18}
					onClick={() => handleEdit({ inventory, status })}
				/>
			</td>
			<td style={{ textAlign: "center", color: "var(--bs-danger)" }}>
				<Trash size={18} onClick={() => handleDelete(id)} />
			</td>
		</tr>
	);
}
