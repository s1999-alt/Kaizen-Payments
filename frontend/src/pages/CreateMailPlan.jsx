import React from "react";
import MailPlanBuilder from "../components/MailPlanBuilder/MailPlanBuilder.jsx";
import { createMailPlan } from "../api/mailPlans.js";
import { useNavigate } from "react-router-dom";

export default function CreateMailPlan() {
  const navigate = useNavigate();

  const handleSave = (nodes, planData) => {
    const payload = {
      ...planData,
      nodes: nodes.map((n, index) => ({
        order: index + 1,
        ...n.data.nodeData,
      })),
    };

    createMailPlan(payload).then(() => navigate("/"));
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Create Mail Plan</h2>
      <MailPlanBuilder onSave={handleSave} />
    </div>
  );
}
