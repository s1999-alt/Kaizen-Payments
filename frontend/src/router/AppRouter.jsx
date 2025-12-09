import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CreateMailPlan from "../pages/CreateMailPlan.jsx";
import EditMailPlan from "../pages/EditMailPlan.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/create" element={<PrivateRoute><CreateMailPlan /></PrivateRoute>} />
        <Route path="/edit/:id" element={<PrivateRoute><EditMailPlan /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
