import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function PlanList() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get("plans/").then(res => setPlans(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Mail Plans</h1>
        <Link
          to="/plans/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Plan
        </Link>
      </div>

      <div className="space-y-3">
        {plans.map(p => (
          <div key={p.id} className="border rounded p-4 bg-white">
            <div className="font-semibold text-lg">{p.name}</div>
            <div className="text-sm text-gray-600">{p.description}</div>

            <Link
              to={`/plans/${p.id}/edit`}
              className="text-blue-500 mt-2 inline-block"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
