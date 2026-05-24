import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { EmergencyProvider } from './context/EmergencyContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import OtpVerification from './pages/OtpVerification';
import VehicleRegistration from './pages/VehicleRegistration';
import EmergencyContacts from './pages/EmergencyContacts';
import Dashboard from './pages/Dashboard';
import EmergencyTracking from './pages/EmergencyTracking';
import Verification from './pages/Verification';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <EmergencyProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/otp" element={<OtpVerification />} />
            <Route path="/vehicle-register" element={<VehicleRegistration />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tracking"
              element={
                <ProtectedRoute>
                  <EmergencyTracking />
                </ProtectedRoute>
              }
            />
            <Route
              path="/verification"
              element={
                <ProtectedRoute>
                  <Verification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          </BrowserRouter>
        </EmergencyProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
