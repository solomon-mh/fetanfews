// import Footer from "./components/Footer/Footer";
// import Header from "./components/Navbar/Navbar";
import Login from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/RegisterPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import PharmacyDetailPage from "./pages/PharmacyDetails/PharmacyDetails";
import { pharmacies } from "./data/pharmacies";
import { calculateDistance } from "./utils/calculations";
import MainLayout from "./layouts/MainLayout";
function App() {
  return (
    <Router>
 
        <Routes>

        <Route element={<MainLayout />}>
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
        </Route>

          {/* <Route path="/" element={<HomePage />} />
          <Route
            path="/pharmacy/:pharmacyId"
            element={
              <PharmacyDetailPage
                pharmacies={pharmacies}
                calculateDistance={calculateDistance}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> */}
        </Routes>

    </Router>
  );
}

export default App;
