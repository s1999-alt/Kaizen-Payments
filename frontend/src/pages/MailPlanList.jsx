import React, { useEffect, useState } from "react";
import { listMailPlans, deleteMailPlan } from "../api/mailPlans";
import { useNavigate } from "react-router-dom";

export default function MailPlanList() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  const loadPlans = () => {
    listMailPlans().then((res) => setPlans(res.data));
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    await deleteMailPlan(id);
    loadPlans();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Mail Plans</h1>
        <button
          onClick={() => navigate("/mail-plans/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create Plan
        </button>
      </div>

      <table className="w-full border-collapse border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Active</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {plans.map((p) => (
            <tr key={p.id} className="border">
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.description}</td>
              <td className="border p-2">
                {p.is_active ? (
                  <span className="text-green-600 font-semibold">Active</span>
                ) : (
                  <span className="text-red-500 font-semibold">Inactive</span>
                )}
              </td>

              <td className="border p-2 space-x-2">
                <button
                  onClick={() => navigate(`/mail-plans/${p.id}`)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/mail-plans/${p.id}/edit`)}
                  className="px-2 py-1 bg-yellow-400 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
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
