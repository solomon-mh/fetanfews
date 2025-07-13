import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/LoginPage";
import SignUp from "./pages/Auth/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import PharmacyDetailPage from "./pages/PharmacyDetails/PharmacyDetails";
import NotFound from "./pages/NotFound";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./admin/AdminDashboard/AdminDashboard";
import { PharmacyContextProvider } from "./contexts/PharmacyContext";
import { calculateDistance } from "./utils/calculations";
import ManagePharmacies from "./admin/managePharmacy/ManagePharmacies";
import PharmacyForm from "./pages/AddPharmacyForm/PharmcyForm";
import PharmacyConfrimation from "./pages/Confrimation/PharmacyConfrimation";
import PharmacyHelp from "./pages/PharmacyHelp/PharmacyHelp";
import PrivateRoute from "./components/PrivateRoute";
import ManageMedications from "./admin/manageDrug/ManageMedications";
import ManageCategories from "./admin/ManageCategories/ManageCategories";
import ManagePharmacists from "./admin/ManagePharmacists/ManagePharmacists";
import AdminLogin from "./admin/AdminAuth/AdminLogin";
import UserList from "./admin/userList/UserList";
import { ErrorProvider } from "./contexts/ErrorContext";
import MedicationDetail from "./pages/MedicationDetail/MedicationDetail";
import NearbyPharmacies from "./pages/NearBy/NearbyPharmacies";
import ChangePassword from "./pages/Auth/ChangePassword";
import ProtectedRoute from "./admin/ProtectedRoute/ProtectedRoute";
import PharmacistReports from "./admin/reports/PharmacistReport";
import PharmacistProfile from "./admin/PharmacistUtils/PharmacistProfile";
import AdminReports from "./admin/reports/AdminReports";
import PublicRoute from "./components/PublicRoute";
import PharmacistProfilePage from "./pages/PharmacyDetails/PharmacistProfilePage";
function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout Routes */}

        <Route
          element={
            <ErrorProvider>
              <MainLayout />
            </ErrorProvider>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route
            path="/pharmacy/:pharmacyName"
            element={
              <PharmacyDetailPage calculateDistance={calculateDistance} />
            }
          />
          <Route
            path="/pharmacy/:pharmacyName/:medicationName"
            element={<MedicationDetail />}
          />
          <Route path="/user/change-password" element={<ChangePassword />} />

          <Route
            path="/user/login"
            element={
              <PublicRoute redirectTo="/">
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/user/signup"
            element={
              <PublicRoute redirectTo="/">
                <SignUp />
              </PublicRoute>
            }
          />
          <Route path="/nearby-pharmacies" element={<NearbyPharmacies />} />
          <Route
            path="/pharmacy-registration/form"
            element={
              <PrivateRoute requiredRole="user">
                <PharmacyForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/pharmacy-registration/help"
            element={<PharmacyHelp />}
          />
          <Route
            path="/pharmacy-registration/success"
            element={<PharmacyConfrimation />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Admin Layout Routes */}
        <Route
          element={
            <PharmacyContextProvider>
              <PrivateRoute requiredRole="admin">
                <AdminLayout />
              </PrivateRoute>
            </PharmacyContextProvider>
          }
        >
          <Route path="/admin/pharmacies" element={<AdminHome />} />
          <Route path="admin/dashboard" element={<AdminHome />} />
          <Route path="admin/pharmacy/medications" element={<AdminHome />} />

          <Route path="/admin/manage-drugs" element={<ManageMedications />} />
          <Route
            path="/admin/pharmacist/reports"
            element={<PharmacistReports />}
          />
          <Route
            path="/admin/manage-categories"
            element={<ManageCategories />}
          />
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "superuser"]} />}
          >
            {" "}
            <Route
              path="/admin/manage-pharmacies"
              element={<ManagePharmacies />}
            />
            <Route
              path="/admin/manage-pharmacists"
              element={<ManagePharmacists />}
            />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={["pharmacist"]} />}>
            {" "}
            <Route
              path="/admin/pharmacist/settings"
              element={<PharmacistProfile />}
            />
          </Route>
          <Route path="/admin/change-password" element={<ChangePassword />} />
          <Route path="/admin/profile" element={<PharmacistProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
