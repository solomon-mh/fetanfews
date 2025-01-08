import { useNavigate } from "react-router-dom";
import "./styles/NotFound.scss";

const NotFound = () => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <button onClick={handleGoBack} className="go-back">
        Go Back 
      </button>
    </div>
  );
};

export default NotFound;