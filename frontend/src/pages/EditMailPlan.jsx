import React, { useEffect, useState } from "react";
import { updateMailPlan, getMailPlan } from "../api/mailPlans.js";
import { useParams, useNavigate } from "react-router-dom";
import MailPlanBuilder from "./MailPlanBuilder.jsx";

export default function EditMailPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    getMailPlan(id).then((res) => setPlan(res.data));
  }, [id]);

  const handleSave = (nodes, planData) => {
    const payload = {
      ...planData,
      nodes: nodes.map((n, index) => ({
        id: n.id.length > 10 ? undefined : n.id, // UUID = new node
        order: index + 1,
        position_x: n.position.x,
        position_y: n.position.y,
        ...n.data.nodeData,
      })),
    };

    updateMailPlan(id, payload).then(() => navigate("/"));
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Mail Plan</h2>
      <MailPlanBuilder initialPlan={plan} onSave={handleSave} />
    </div>
  );
}
