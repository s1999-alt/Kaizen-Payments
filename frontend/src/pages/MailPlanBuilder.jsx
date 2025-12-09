import React, { useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "react-flow-renderer";

import NodeForm from "./NodeForm.jsx";
import { getMailPlan, createMailPlan, updateMailPlan } from "../api/mailPlans.js";

export default function MailPlanBuilder({ planId }) {
  // 🔥 Correct react-flow state handlers
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  // Fetch plan if editing
  useEffect(() => {
    if (planId) {
      getMailPlan(planId).then((res) => {
        const plan = res.data;

        setPlanData({
          name: plan.name,
          description: plan.description,
          is_active: plan.is_active,
        });

        const nodesData = plan.nodes.map((node) => ({
          id: node.id.toString(),
          data: { label: node.subject, nodeData: node },
          position: {
            x: node.position_x ?? 100,
            y: node.position_y ?? 100 + node.order * 120,
          },
        }));

        setNodes(nodesData);
      });
    }
  }, [planId, setNodes]);

  // Add a new node
  const addNode = () => {
    const id = crypto.randomUUID();
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 200, y: 200 },
        data: { label: "New Node", nodeData: {} },
        type: "default",
      },
    ]);
  };

  // Save plan (create or update)
  const savePlan = async () => {
    if (!planData.name.trim()) {
      alert("Enter plan name");
      return;
    }
    if (nodes.length === 0) {
      alert("Add at least one node");
      return;
    }

    const payload = {
      ...planData,
      nodes: nodes.map((n, index) => ({
        id: n.data.nodeData.id, // undefined for new
        order: index + 1,
        subject: n.data.nodeData.subject,
        body: n.data.nodeData.body,
        trigger_type: n.data.nodeData.trigger_type,
        event_name: n.data.nodeData.event_name,
        delay_minutes: n.data.nodeData.delay_minutes,
        scheduled_datetime: n.data.nodeData.scheduled_datetime,
        recipient_filter: n.data.nodeData.recipient_filter,
        position_x: n.position.x,
        position_y: n.position.y,
      })),
    };

    if (planId) {
      await updateMailPlan(planId, payload);
      alert("Plan updated successfully");
    } else {
      await createMailPlan(payload);
      alert("Plan created successfully");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">

      {/* LEFT PANEL — PLAN INFO + NODE FORM */}
      <div className="col-span-1 flex flex-col gap-4">
        <div className="p-4 border bg-white rounded">
          <h3 className="font-semibold mb-2">Mail Plan Info</h3>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Plan Name"
            value={planData.name}
            onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-2"
            placeholder="Description"
            value={planData.description}
            onChange={(e) =>
              setPlanData({ ...planData, description: e.target.value })
            }
          />

          <button
            className="bg-green-600 text-white py-2 rounded w-full"
            onClick={addNode}
          >
            + Add Node
          </button>
        </div>

        {/* Node Editor */}
        <NodeForm nodes={nodes} setNodes={setNodes} />

        <button
          className="bg-blue-600 text-white py-2 rounded"
          onClick={savePlan}
        >
          Save Mail Plan
        </button>
      </div>

      {/* RIGHT — REACT FLOW CANVAS */}
      <div className="col-span-2 h-[600px] border rounded">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}

