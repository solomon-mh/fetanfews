import Footer from "./components/Footer/Footer";
import Header from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PharmacyDetailPage from "./pages/PharmacyDetails/PharmacyDetails";
import { pharmacies } from "./data/pharmacies";
import { calculateDistance } from "./utils/calculations";
function App() {
  return (
    <Router>
      <div className="header-section">
        <Header />
      </div>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/pharmacy/:pharmacyId"
            element={
              <PharmacyDetailPage
                pharmacies={pharmacies}
                calculateDistance={calculateDistance}
              />
            }
          />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
