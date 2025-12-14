import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";
import { useParams, useNavigate } from "react-router-dom";
import { getMailPlan } from "../api/mailPlans";

export default function MailPlanDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    try {
      const res = await getMailPlan(id);
      const backendNodes = res.data.nodes;

      const sortedNodes = [...backendNodes].sort(
        (a, b) => a.order - b.order
      );

      const rfNodes = sortedNodes.map((n) => ({
        id: String(n.id),
        position: {
          x: n.position_x ?? 150,
          y: n.position_y ?? n.order * 120,
        },
        data: {
          node: n,
          label: (
            <div className="text-sm">
              <div className="font-semibold text-blue-700">
                {n.trigger_type.toUpperCase()}
              </div>
              <div className="truncate">{n.subject}</div>
            </div>
          ),
        },
      }));

      const rfEdges = [];
      for (let i = 0; i < sortedNodes.length - 1; i++) {
        rfEdges.push({
          id: `e${sortedNodes[i].id}-${sortedNodes[i + 1].id}`,
          source: String(sortedNodes[i].id),
          target: String(sortedNodes[i + 1].id),
          animated: true,
        });
      }

      setNodes(rfNodes);
      setEdges(rfEdges);
    } catch (err) {
      console.error("Failed to load mail plan", err);
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data.node);
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading mail plan...</div>
    );
  }

  return (
    <div className="flex h-[85vh]">
      
      <div className="flex-1 border">
        <div className="flex items-center justify-between p-3 border-b">
          <h2 className="text-lg font-semibold">Mail Plan Flow</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Back
          </button>
        </div>

        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>

      <div className="w-96 border-l p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-3">Node Details</h3>

        {!selectedNode ? (
          <p className="text-gray-500">
            Click a node to view its details
          </p>
        ) : (
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold">Trigger:</span>{" "}
              {selectedNode.trigger_type}
            </div>

            {selectedNode.delay_minutes && (
              <div>
                <span className="font-semibold">Delay:</span>{" "}
                {selectedNode.delay_minutes} minutes
              </div>
            )}

            {selectedNode.scheduled_datetime && (
              <div>
                <span className="font-semibold">Scheduled:</span>{" "}
                {new Date(
                  selectedNode.scheduled_datetime
                ).toLocaleString()}
              </div>
            )}

            {selectedNode.event_name && (
              <div>
                <span className="font-semibold">Event:</span>{" "}
                {selectedNode.event_name}
              </div>
            )}

            <div>
              <span className="font-semibold">Subject:</span>
              <div className="border p-2 rounded mt-1 bg-white">
                {selectedNode.subject}
              </div>
            </div>

            <div>
              <span className="font-semibold">Body:</span>
              <div className="border p-2 rounded mt-1 bg-white whitespace-pre-wrap">
                {selectedNode.body}
              </div>
            </div>

            <div>
              <span className="font-semibold">Recipients Filter:</span>
              <pre className="bg-white p-2 rounded mt-1 text-xs">
                {JSON.stringify(
                  selectedNode.recipient_filter,
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}












// import React, { useEffect, useState } from "react";
// import ReactFlow, { MiniMap, Controls } from "reactflow"
// import "reactflow/dist/style.css";
// import { getMailPlan } from "../api/mailPlans";


// export default function MailPlanDetail({ planId }) {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   useEffect(() => {
//     getMailPlan(planId).then((res) => {
//       const planNodes = res.data.nodes || [];

//       // Build nodes for React Flow
//       const flowNodes = planNodes.map((node, index) => ({
//         id: node.id.toString(),
//         data: {
//           label: (
//             <div>
//               <strong>{node.subject}</strong>
//               <p className="text-xs text-gray-500">{node.description}</p>
//             </div>
//           ),
//         },
//         position: { x: 150, y: index * 150 },
//       }));

//       // Build edges (order → next node)
//       const flowEdges = planNodes
//         .filter((n) => n.order < planNodes.length - 1)
//         .map((n) => ({
//           id: `e${n.id}-${n.id + 1}`,
//           source: n.id.toString(),
//           target: (n.id + 1).toString(),
//         }));

//       setNodes(flowNodes);
//       setEdges(flowEdges);
//     });
//   }, [planId]);

//   return (
//     <div className="h-[80vh] border p-3 rounded">
//       <ReactFlow nodes={nodes} edges={edges}>
//         <MiniMap />
//         <Controls />
//       </ReactFlow>
//     </div>
//   );
// }
