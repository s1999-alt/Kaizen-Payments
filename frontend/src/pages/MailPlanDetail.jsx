import React, { useEffect, useState } from "react";
import ReactFlow, { MiniMap, Controls } from "react-flow-renderer";
import { getMailPlan } from "../api/mailPlans";

export default function MailPlanDetail({ planId }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    getMailPlan(planId).then((res) => {
      const planNodes = res.data.nodes || [];

      // Build nodes for React Flow
      const flowNodes = planNodes.map((node, index) => ({
        id: node.id.toString(),
        data: {
          label: (
            <div>
              <strong>{node.subject}</strong>
              <p className="text-xs text-gray-500">{node.description}</p>
            </div>
          ),
        },
        position: { x: 150, y: index * 150 },
      }));

      // Build edges (order → next node)
      const flowEdges = planNodes
        .filter((n) => n.order < planNodes.length - 1)
        .map((n) => ({
          id: `e${n.id}-${n.id + 1}`,
          source: n.id.toString(),
          target: (n.id + 1).toString(),
        }));

      setNodes(flowNodes);
      setEdges(flowEdges);
    });
  }, [planId]);

  return (
    <div className="h-[80vh] border p-3 rounded">
      <ReactFlow nodes={nodes} edges={edges}>
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
