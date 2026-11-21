import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AdminHomePage } from "./pages/AdminHomePage";
import { LoginPage } from "./pages/LoginPage";
import { StudentHomePage } from "./pages/StudentHomePage";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === "admin" ? "/admin" : "/exams"} replace />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentHomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
