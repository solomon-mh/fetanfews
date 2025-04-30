import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logout } from "../../api/auth";

const Header = () => {
	const { user, setUser } = useAuth();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleLogout = async () => {
		await Logout();
		setUser(null);
		setMenuOpen(false);
	};

	return (
		<header className="header">
			<nav className="navbar">
				<Link to="/" className="navbar-logo">
					FeranFews
				</Link>

				<div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
					☰
				</div>

				<ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
					{/* <li>
						<Link
							className="link"
							to="/admin/dashboard"
							onClick={() => setMenuOpen(false)}
						>
							AdminPage
						</Link>
					</li> */}
					<li>
						<Link
							className="link"
							to="/pharmacy-registration/help"
							onClick={() => setMenuOpen(false)}
						>
							Register Pharmacy
						</Link>
					</li>

					<li>
						{user ? (
							<Link
								className="link"
								to=""
								onClick={handleLogout}
								title={user?.first_name}
							>
								Logout
							</Link>
						) : (
							<Link
								className="link"
								to="/user/login"
								onClick={() => setMenuOpen(false)}
							>
								Login
							</Link>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;
