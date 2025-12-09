import React, { useEffect, useState } from "react";
import { getMailPlans, deleteMailPlan } from "../../api/mailPlans.js";
import { useNavigate } from "react-router-dom";

export default function MailPlanList() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const fetchPlans = () => {
    getMailPlans().then((res) => setPlans(res.data));
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      deleteMailPlan(id).then(() => fetchPlans());
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Mail Plans</h2>
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id}>
              <td className="border p-2">{plan.name}</td>
              <td className="border p-2">{plan.description}</td>
              <td className="border p-2">{plan.is_active ? "Yes" : "No"}</td>
              <td className="border p-2 flex gap-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => navigate(`/edit/${plan.id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(plan.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
