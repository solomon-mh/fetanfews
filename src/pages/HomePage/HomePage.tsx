/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import WhyUseMedLocator from "../../components/common/WhyUseMedLocator";
import HeroSection from "../../components/HeroSection/HeroSection";
import PharmacyList from "../../components/PharmacyList/PharmacyList";
import { calculateDistance } from "../../utils/calculations";
import { useGeoLocation, defaultCoordinates } from "../../hooks/useGeoLocation";
import { brwose_by_categories } from "../../api/pharmacyService";
import { CategoryType } from "../../utils/interfaces";
import { fetchPharmacyData } from "../../api/pharmacyService";
import { PharmacyDataType } from "../../utils/interfaces";
import { searchByCategory } from "../../api/pharmacyService";
import { useError } from "../../contexts/ErrorContext";
import PharmacyMap from "../../components/MapView/MapView";
const HomePage: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
		null
	);
	const [categories, setCategories] = useState<CategoryType[]>([]);
	const [pharmacies, setPharmacies] = useState<PharmacyDataType[]>([]);
	const [filteredPharmacies, setFilteredPharmacies] = useState<any[]>([]);

	const [loading, setLoading] = useState<boolean>(true);

	const userLocation = useGeoLocation();
	const { setError } = useError();

	useEffect(() => {
		setLoading(true);
		const getCategories = async () => {
			try {
				const data = await brwose_by_categories();
				setCategories(data);
			} catch (err) {
				setError("Failed to fetch categories.");
			} finally {
				setLoading(false);
			}
		};

		getCategories(); // Call the function on component mount
	}, []);
	useEffect(() => {
		const getPharmacies = async () => {
			try {
				const data = await fetchPharmacyData();
				setPharmacies(data);
				setFilteredPharmacies(data);
				setSelectedCategory(null);
			} catch (err) {
				setError("Failed to fetch pharmacies.");
			} finally {
				setLoading(false);
			}
		};

		getPharmacies();
	}, []);

	const handleSearchByCategory = async (category: CategoryType | null) => {
		setSelectedCategory(category);

		setError(null);
		try {
			if (category) {
				const result = await searchByCategory(category.id, null);
				setFilteredPharmacies(result);
			} else {
				setFilteredPharmacies(pharmacies);
			}
		} catch (err) {
			console.error(err);
			setError("Failed to fetch data");
			setSelectedCategory(null);
			setFilteredPharmacies([]);
		} finally {
			setLoading(false);
		}
	};

	// Default coordinates for the map if geolocation fails
	const userCoordinates: [number, number] =
		userLocation.latitude && userLocation.longitude
			? [userLocation.latitude, userLocation.longitude]
			: defaultCoordinates;

	if (loading) {
		return <h1>Loading</h1>;
	}

	return (
		<div className="home-page">
			<HeroSection />

			<div className="browse-categories-wrapper">
				<h2 className="section-title">Browse by Medication Category</h2>
				<ul className="categories-list">
					{categories.map((category) => (
						<li
							key={category.id}
							className={`category-item ${
								selectedCategory?.name === category.name ? "active" : ""
							}`}
							onClick={() => handleSearchByCategory(category)}
						>
							{category.name}
						</li>
					))}
					<li
						className={`category-item ${
							!selectedCategory?.name ? "active" : ""
						}`}
						onClick={() => handleSearchByCategory(null)}
					>
						All Categories
					</li>
				</ul>
			</div>
			{!selectedCategory && <WhyUseMedLocator />}

			{userLocation.error && (
				<p className="error-message">{userLocation.error}</p>
			)}

			<h2 className="section-title">
				{selectedCategory
					? `Pharmacies Found for "${selectedCategory?.name}"`
					: "Featured Pharmacies"}
			</h2>
			{filteredPharmacies.length === 0 ? (
				<p>No pharmacy found for this category.</p>
			) : (
				<PharmacyList
					pharmacies={filteredPharmacies}
					calculateDistance={(lat: number, lon: number) =>
						calculateDistance(lat, lon, userCoordinates[0], userCoordinates[1])
					}
				/>
			)}
			{/* Map Section */}
			<h2 className="section-title">Find Pharmacies on Google Map</h2>
			{userLocation.latitude && userLocation.longitude ? (
				<PharmacyMap
					userCoordinates={userCoordinates}
					pharmacies={filteredPharmacies}
					userLocationError={userLocation.error}
				/>
			) : (
				<p>Please enable location services to view nearby pharmacies.</p>
			)}
		</div>
	);
};

export default HomePage;
