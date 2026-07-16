import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import HospitalViewPage from "./pages/hospital/HospitalViewPage.jsx";
import HospitalEditPage from "./pages/hospital/HospitalEditPage.jsx";
import DepartmentsPage from "./pages/departments/DepartmentsPage.jsx";
import DepartmentNewPage from "./pages/departments/DepartmentNewPage.jsx";
import DepartmentEditPage from "./pages/departments/DepartmentEditPage.jsx";
import DepartmentViewPage from "./pages/departments/DepartmentViewPage.jsx";
import AddDoctorPage from "./pages/doctors/AddDoctorPage.jsx";
import DoctorsPage from "./pages/doctors/DoctorsPage.jsx";
import DoctorProfilePage from "./pages/doctors/DoctorProfilePage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3200,
              style: {
                border: "1px solid #d0d9e8",
                borderRadius: "14px",
                boxShadow: "0 18px 50px rgba(15, 24, 41, 0.16)",
                color: "#1e2d4a",
                fontWeight: 600
              },
              success: { iconTheme: { primary: "#4f46e5", secondary: "#ffffff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#ffffff" } }
            }}
          />
          <Routes>
            <Route path="/" element={<Navigate to="/register" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route element={<ProtectedLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="hospital" element={<HospitalViewPage />} />
              <Route path="hospital/edit" element={<HospitalEditPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="departments" element={<DepartmentsPage />} />
              <Route path="departments/new" element={<DepartmentNewPage />} />
              <Route path="departments/:id" element={<DepartmentViewPage />} />
              <Route path="departments/:id/edit" element={<DepartmentEditPage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="doctors/new" element={<AddDoctorPage />} />
              <Route path="doctors/:id" element={<DoctorProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/register" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
