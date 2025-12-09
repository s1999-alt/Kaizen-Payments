import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import MailPlanBuilder from "../pages/MailPlanBuilder.jsx";
import { updateMailPlan, getMailPlan } from "../api/mailPlans.js";

export default function EditMailPlan() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSave = (nodes, planData) => {
    const payload = {
      ...planData,
      nodes: nodes.map((n) => ({
        id: n.id.includes("-") ? undefined : n.id, // new node check
        order: parseInt(n.data.nodeData.order) || 1,
        ...n.data.nodeData,
      })),
    };

    updateMailPlan(id, payload).then(() => navigate("/"));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Mail Plan</h2>
      <MailPlanBuilder planId={id} />
      {/* Add Save button */}
    </div>
  );
}
