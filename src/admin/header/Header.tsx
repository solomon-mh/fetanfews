import DarkModeIcon from "@mui/icons-material/DarkMode";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import FullscreenIcon from "@mui/icons-material/Fullscreen";

// import LanguageIcon from "@mui/icons-material/Language";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import SearchIcon from '@mui/icons-material/Search';
import { useContext, useEffect, useState } from "react";
// import axios from 'axios'
import { Modal, Button } from "@mui/material";
import { ColorContext } from "../../contexts/ColorContext";

// import sass file
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Logout } from "../../api/auth";
import { useNavigate } from "react-router-dom";

interface propTypes {
	onToggleSidebar: () => void;
	onToggleSidebarShrunk: () => void;
}
const Header: React.FC<propTypes> = ({
	onToggleSidebar,
	onToggleSidebarShrunk,
}) => {
	const [unreadNotifications, setUnreadNotifications] = useState(0);
	const [notificationList, setNotificationList] = useState([]);
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();
	// color state management using react context
	const { darkMode, dispatch } = useContext(ColorContext);
	const [isFullscreen, setIsFullscreen] = useState(false);

	const handleToggle = () => {
		onToggleSidebar();
	};
	const handleToggleShrunk = () => {
		setIsFullscreen(!isFullscreen);

		onToggleSidebarShrunk();
	};
	const { user } = useAuth();

	// Fetch unread notifications count
	const fetchNotifications = async () => {
		try {
			// const response = await axios.get('http://127.0.0.1:8000/api/notifications/');
			setNotificationList([]);
			setUnreadNotifications(0);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};

	const handleNotificationIconClick = () => {
		setOpen(true);
	};
	const handleClose = () => setOpen(false);
	const markNotificationsAsRead = async () => {
		try {
			// const response = await axios.post('http://127.0.0.1:8000/api/notifications/');
			setUnreadNotifications(0);
			// setNotificationList(response.data);
			setOpen(false);
		} catch (error) {
			console.error("Error fetching notifications:", error);
		}
	};
	useEffect(() => {
		fetchNotifications();
	}, []);
	const handleLogout = async () => {
		await Logout();
		navigate("/admin/login");
	};
	return (
		<div className="admin-navbar">
			<div className="navbar_main">
				<div className="logo">
					<MenuIcon className="menu_icon" onClick={handleToggle} />

					<Link to="admin/dashboard" style={{ textDecoration: "none" }}>
						<h3 className="text_none">Admin Dashboard</h3>
					</Link>
				</div>

				<div className="item_lists">
					{user ? (
						<>
							<div>
								{/* <em>Well Come:{user?.username.toUpperCase()}</em> */}
								<em>WELCOME, {user?.first_name.toUpperCase()} </em>/
							</div>
							<Link to="/" className="link" style={{ textDecoration: "none" }}>
								<em> VEIW SITE </em>
							</Link>
							/
							<div>
								<Link
									to=" "
									className="link"
									style={{ textDecoration: "none" }}
									onClick={handleLogout}
								>
									<em> LOGOUT </em>
								</Link>
								/
								<Link
									className="link"
									to="/admin/change-password"
									style={{ textDecoration: "none" }}
								>
									<em> CHANGE PASSWORD </em>
								</Link>
							</div>
						</>
					) : (
						<>
							<div>
								<Link
									className="link"
									to="/admin/login"
									style={{ textDecoration: "none" }}
								>
									<em> Login </em>
								</Link>
								/
							</div>
							{/* <div>
                <Link
                  className="link"
                  to="/register"
                  style={{ textDecoration: "none" }}
                >
                  <em>Sign Up </em>
                </Link>
              </div> */}
						</>
					)}
					{/* <div className="item item_lan">
            <LanguageIcon className="item_icon" />
            <p>English</p>
          </div> */}
					<div className="item">
						{!darkMode ? (
							<DarkModeIcon
								className="item_icon"
								onClick={() => dispatch({ type: "TOGGLE" })}
							/>
						) : (
							<LightModeIcon
								className="item_icon white"
								onClick={() => dispatch({ type: "TOGGLE" })}
							/>
						)}
					</div>
					<div className="item">
						{isFullscreen ? (
							<FullscreenIcon
								className="item_icon"
								onClick={handleToggleShrunk}
							/>
						) : (
							<FullscreenExitIcon
								className="item_icon"
								onClick={handleToggleShrunk}
							/>
						)}{" "}
					</div>

					<div className="item">
						<NotificationsNoneIcon
							className="item_icon"
							onClick={handleNotificationIconClick}
						/>
						{unreadNotifications > 0 && (
							<span className="badge">{unreadNotifications}</span>
						)}
					</div>

					<div className="item">
						{/* <img className="admin_pic"  src={user?.avatar || admin} alt="admin" title={user?.user.username} /> */}
					</div>
				</div>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="notification-modal-title"
				aria-describedby="notification-modal-description"
			>
				<div
					className="modal-content"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: 400,
						backgroundColor: "white",
						border: "2px solid #000",
						boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
						padding: "20px",
						borderRadius: "8px",
					}}
				>
					<h2 id="notification-modal-title">Notifications</h2>
					{notificationList.length > 0 ? (
						notificationList.map((notification) => (
							<div key={notification} className="notification-item">
								{notification}
							</div>
						))
					) : (
						<p id="notification-modal-description">No new notifications</p>
					)}
					<Button
						onClick={handleClose}
						variant="contained"
						color="primary"
						style={{ margin: "10px" }}
					>
						Close
					</Button>
					{notificationList.length > 0 && (
						<Button
							onClick={markNotificationsAsRead}
							variant="contained"
							color="primary"
							style={{ margin: "10px" }}
						>
							Mark as Read
						</Button>
					)}
				</div>
			</Modal>
		</div>
	);
};

export default Header;
