import { Outlet } from "react-router-dom"; 
import Header from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
const MainLayout = () => {
	return (
		<div>
			<header className="fixed w-full z-50 top-0 right-0">
				<Header />
			</header>
			<main style={{ paddingTop: "70px" }}>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;
