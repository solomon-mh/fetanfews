/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback } from "react";
import { FiSearch, FiMapPin, FiTag } from "react-icons/fi";
import "./SearchBar.scss";
import { useNavigate, useSearchParams } from "react-router-dom";
import { pharmacies } from "../../data/pharmacies";
import { debounce } from "../../utils/debounce";
import { highlightText } from "../../utils/highlightText";

const SearchBar: React.FC = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const [drugName, setDrugName] = useState<string>(
		searchParams.get("medication") || ""
	);
	const [pharmacyName, setPharmacyName] = useState<string>(
		searchParams.get("pharmacy") || ""
	);
	const [drugSuggestions, setDrugSuggestions] = useState<any[]>([]);
	const [pharmacySuggestions, setPharmacySuggestions] = useState<any[]>([]);

	const queryParams = new URLSearchParams();
	if (pharmacyName) queryParams.append("pharmacy", pharmacyName);
	if (drugName) queryParams.append("medication", drugName);

	const debouncedFilter = useCallback(
		debounce((input: string, type: "pharmacy" | "drug") => {
			if (input) {
				if (type === "pharmacy") {
					const filtered = pharmacies.filter((pharmacy) =>
						pharmacy.pharmacy_name.toLowerCase().includes(input.toLowerCase())
					);
					setPharmacySuggestions(filtered);
				} else if (type === "drug") {
					const allDrugs = pharmacies.flatMap(
						(pharmacy) => pharmacy.available_drugs
					);
					const filtered = allDrugs.filter((drug) =>
						drug.name.toLowerCase().includes(input.toLowerCase())
					);
					setDrugSuggestions(filtered);
				}
			} else {
				if (type === "pharmacy") {
					setPharmacySuggestions([]);
				} else {
					setDrugSuggestions([]);
				}
			}
		}, 300),
		[pharmacies]
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (name === "pharmacy") {
			setPharmacyName(value);
			debouncedFilter(value, "pharmacy");
		} else if (name === "medication") {
			setDrugName(value);
			debouncedFilter(value, "drug");
		}
	};

	const handleSuggestionClick = (value: any, type: "pharmacy" | "drug") => {
		if (type === "pharmacy") {
			setPharmacyName(value.pharmacy_name);
			setPharmacySuggestions([]);
		} else {
			setDrugName(value.name);
			setDrugSuggestions([]);
		}
	};

	const handleSearch = () => {
		setPharmacySuggestions([]);
		setDrugSuggestions([]);

		navigate(`/search-results/?${queryParams.toString()}`);
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleSearch();
	};

	const renderSuggestions = (
		suggestions: any[],
		type: "pharmacy" | "drug",
		inputValue: string
	) =>
		suggestions.length > 0 && (
			<ul className="suggestions" role="listbox">
				{suggestions.map((item) => (
					<li
						key={type === "pharmacy" ? item.pharmacy_id : item.drug_id}
						role="option"
						onClick={() => handleSuggestionClick(item, type)}
						dangerouslySetInnerHTML={{
							__html: highlightText(
								type === "pharmacy" ? item.pharmacy_name : item.name,
								inputValue
							),
						}}
					/>
				))}
			</ul>
		);

	return (
		<div className="search-bar">
			{/* Pharmacy Search Input */}
			<div className="search-input-container">
				<FiMapPin className="input-icon" />
				<input
					type="text"
					className="search-input"
					placeholder="Search with pharmacy's name"
					value={pharmacyName}
					name="pharmacy"
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					aria-autocomplete="list"
					aria-expanded={pharmacySuggestions.length > 0}
				/>
				{renderSuggestions(pharmacySuggestions, "pharmacy", pharmacyName)}
			</div>

			{/* Drug Search Input */}
			<div className="search-input-container">
				<FiTag className="input-icon" />
				<input
					type="text"
					className="search-input"
					placeholder="Search with medication category"
					value={drugName}
					name="medication"
					onChange={handleInputChange}
					onKeyDown={handleKeyPress}
					aria-autocomplete="list"
					aria-expanded={drugSuggestions.length > 0}
				/>
				{renderSuggestions(drugSuggestions, "drug", drugName)}
			</div>

			{/* Search Button */}
			<button className="search-button" onClick={handleSearch}>
				<FiSearch className="search-icon" />
			</button>
		</div>
	);
};

export default SearchBar;
