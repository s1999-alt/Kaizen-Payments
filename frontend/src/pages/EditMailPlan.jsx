import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MailPlanBuilder from "./MailPlanBuilder.jsx";

export default function EditMailPlan() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Edit Mail Plan</h2>
      <MailPlanBuilder planId={id} />
    </div>
  );
}