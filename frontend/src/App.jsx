import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlanList from "./pages/PlanList";
// import PlanBuilder from "./pages/PlanBuilder";
// import Recipients from "./pages/Recipients";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlanList />} />
        {/* <Route path="/plans/create" element={<PlanBuilder />} />
        <Route path="/plans/:id/edit" element={<PlanBuilder />} />
        <Route path="/recipients" element={<Recipients />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
