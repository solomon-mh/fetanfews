/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getPharmacyMedicationDetail } from "../../api/medicationService";
import drugImage from "../../assets/images/drugs.jpeg";
import Breadcrumbs from "../../components/common/Breadcrumbs";

const MedicationDetail = () => {
	const { pharmacyName } = useParams();

	const [searchParams] = useSearchParams();

	const pharmacyId = searchParams.get("pham_id");
	const medicationId = searchParams.get("med_id");
	const [medication, setMedication] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const fetchMedicationDetails = async () => {
			if (!pharmacyId || !medicationId) {
				setError("Invalid pharmacy or medication ID.");
				setLoading(false);
				return;
			}

			setLoading(true);
			const { data, error } = await getPharmacyMedicationDetail(
				pharmacyId,
				medicationId
			);
			if (error) {
				setError(error);
			} else {
				setMedication(data);
				console.log("med data from detal", data);
			}
			setLoading(false);
		};

		fetchMedicationDetails();
	}, [pharmacyId, medicationId]);

	if (loading) return <p>Loading medication details...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<>
			<Breadcrumbs />

			<div className="medication-detail">
				<h1>
					{medication?.name} (From{" "}
					{pharmacyName ? decodeURIComponent(pharmacyName) : "Unknown Pharmacy"}
					)
				</h1>
				<div className="medication-detail-info">
					<div className="med-image">
						<img
							src={
								medication.image
									? `http://127.0.0.1:8000${medication.image}`
									: drugImage
							}
							alt={medication.name}
							className="medication-image"
						/>
					</div>
					<div className="med-detail-info">
						<p>
							<strong>Price:</strong> {medication.price} Birr
						</p>
						<p>
							<strong>Description:</strong>{" "}
							{medication.description || "No description available."}
						</p>

						<p>
							<strong>Dosage Form:</strong> {medication.dosage_form}
						</p>
						<p>
							<strong>Dosage Strength:</strong> {medication.dosage_strength}
						</p>
						<p>
							<strong>Manufacturer:</strong> {medication.manufacturer}
						</p>
						<p>
							<strong>Expiry Date:</strong>{" "}
							{new Date(medication.expiry_date).toLocaleDateString()}
						</p>
						<p>
							<strong>Prescription Required:</strong>{" "}
							{medication.prescription_required ? "Yes" : "No"}
						</p>
						<p>
							<strong>Side Effects:</strong> {medication.side_effects || "N/A"}
						</p>
						<p>
							<strong>Usage Instructions:</strong>{" "}
							{medication.usage_instructions || "N/A"}
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default MedicationDetail;
