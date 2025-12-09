import React, { useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';
import api from "../api/axios";

export default function PlanBuilder() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Add a new mail node
  const addMailNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: `${Date.now()}`,
        position: { x: 100, y: 100 },
        data: {
          subject: "",
          body: "",
          trigger_type: "delay",
          delay_minutes: 10,
        },
        type: "default",
      },
    ]);
  };

  const savePlan = async () => {
    const plan = {
      name: "Untitled Flow",
      description: "Auto-generated",
      is_active: true,
      nodes: nodes.map((n, index) => ({
        order: index + 1,
        subject: n.data.subject,
        body: n.data.body,
        trigger_type: n.data.trigger_type,
        delay_minutes: n.data.delay_minutes || null,
        scheduled_datetime: n.data.scheduled_datetime || null,
        event_name: n.data.event_name || "",
        recipient_filter: {},
      })),
    };

    await api.post("plans/create/", plan);
    alert("Plan saved!");
  };

  return (
    <div className="h-screen flex">
      {/* LEFT Sidebar */}
      <div className="w-64 p-4 border-r bg-gray-100">
        <button
          className="bg-blue-600 text-white w-full py-2 rounded"
          onClick={addMailNode}
        >
          Add Node
        </button>

        <button
          className="mt-4 bg-green-600 text-white w-full py-2 rounded"
          onClick={savePlan}
        >
          Save Plan
        </button>
      </div>

      {/* FLOW EDITOR */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={setNodes}
          onEdgesChange={setEdges}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
