import React, { useState, useEffect } from "react";
import ReactFlow, { addEdge, MiniMap, Controls } from "react-flow-renderer";
import NodeForm from "./NodeForm.jsx";
import { getMailPlan, createMailPlan, updateMailPlan } from "../api/mailPlans.js";

export default function MailPlanBuilder({ planId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // Fetch plan if editing
  useEffect(() => {
    if (planId) {
      getMailPlan(planId).then(res => {
        const nodesData = res.data.nodes.map(node => ({
          id: node.id.toString(),
          data: { label: node.subject, nodeData: node },
          position: { x: 100, y: 100 + node.order * 120 },
        }));
        setNodes(nodesData);
      });
    }
  }, [planId]);

  const onNodesChange = (changes) => setNodes(nds => nds.map(n => ({ ...n, ...changes })));
  const onEdgesChange = (changes) => setEdges(edgs => addEdge(...changes, edgs));

  return (
    <div className="h-[80vh] border border-gray-300 rounded p-2">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
      <NodeForm nodes={nodes} setNodes={setNodes} />
    </div>
  );
}
