import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";

// import Login from "../pages/Login.jsx";
import MailPlanList from "../pages/MailPlanList.jsx";
import MailPlanDetail from "../pages/MailPlanDetail.jsx";
import CreateMailPlan from "../pages/CreateMailPlan.jsx";
import EditMailPlan from "../pages/EditMailPlan.jsx";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
};


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Mail Plans */}
        <Route path="/mail-plans"element={<PrivateRoute><MailPlanList /></PrivateRoute>}/>
        <Route path="/mail-plans/create" element={ <PrivateRoute><CreateMailPlan/></PrivateRoute>}/>

        <Route
          path="/mail-plans/:id/edit"
          element={
            <PrivateRoute>
              <EditMailPlan />
            </PrivateRoute>
          }
        />

        <Route
          path="/mail-plans/:id"
          element={
            <PrivateRoute>
              <MailPlanDetail />
            </PrivateRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/mail-plans" />} />
      </Routes>
    </BrowserRouter>
  );
}
