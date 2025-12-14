import React, { useState, useEffect } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import 'reactflow/dist/style.css';
import RecipientFilter from "./RecipientFilter.jsx";
import { getMailPlan, createMailPlan, updateMailPlan } from "../api/mailPlans.js";
import NodeForm from "./NodeForm.jsx";

export default function MailPlanBuilder({ planId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  useEffect(() => {
    if (!planId) return;

    getMailPlan(planId).then((res) => {
      const plan = res.data;

      setPlanData({
        name: plan.name,
        description: plan.description,
        is_active: plan.is_active,
      });

      const sortedNodes = [...plan.nodes].sort(
        (a, b) => a.order - b.order
      );

      const nodesData = sortedNodes.map((node) => ({
        id: node.id.toString(),
        position: {
          x: node.position_x ?? 100,
          y: node.position_y ?? 100 + node.order * 120,
        },
        data: {
          label: node.subject || "Mail Node",
          nodeData: {
            ...node,

            scheduled_datetime: node.scheduled_datetime
              ? node.scheduled_datetime.slice(0, 16)
              : "",
          },
        },
      }));

      const edgesData = [];
      for (let i = 0; i < sortedNodes.length - 1; i++) {
        edgesData.push({
          id: `e${sortedNodes[i].id}-${sortedNodes[i + 1].id}`,
          source: sortedNodes[i].id.toString(),
          target: sortedNodes[i + 1].id.toString(),
          animated: true,
        });
      }

      setNodes(nodesData);
      setEdges(edgesData);
    });
  }, [planId]);

  const addNode = () => {
    const id = crypto.randomUUID();
    setNodes((nds) => [
      ...nds,
      {
        id,
        position: { x: 200, y: 200 },
        data: {
          label: "New Node",
          nodeData: {
            subject: "",
            body: "",
            trigger_type: "on_event",
            event_name: "",
            delay_minutes: "",
            scheduled_datetime: "",
            recipient_filter: [],
          },
        },
      },
    ]);
  };

  const onNodeClick = (_, node) => setSelectedNodeId(node.id);

  const savePlan = async () => {
    if (!planData.name.trim()) return alert("Plan name required");
    if (nodes.length === 0) return alert("Add at least one node");

    const payload = {
      ...planData,
      nodes: nodes.map((n, index) => {
        const nd = n.data.nodeData;

        return {
          ...(nd.id ? { id: nd.id } : {}),

          order: index + 1,
          subject: nd.subject,
          body: nd.body,
          trigger_type: nd.trigger_type,

          delay_minutes: nd.trigger_type === "delay"
            ? Number(nd.delay_minutes)
            : null,

          scheduled_datetime: nd.trigger_type === "schedule"
            ? (nd.scheduled_datetime
                ? nd.scheduled_datetime + ":00" 
                : null)
            : null,

          event_name: nd.trigger_type === "on_event"
            ? nd.event_name
            : "",

          recipient_filter: nd.recipient_filter || {},

          position_x: n.position.x,
          position_y: n.position.y,
        };
      }),
    };

    if (planId) {
      await updateMailPlan(planId, payload);
      alert("Plan updated");
    } else {
      await createMailPlan(payload);
      alert("Plan created");
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      
      <div className="col-span-1 flex flex-col gap-4">

        <div className="p-4 border bg-white rounded shadow-sm">
          <h3 className="font-semibold mb-2">Mail Plan Info</h3>

          <input
            className="border p-2 w-full mb-2 rounded"
            placeholder="Plan Name"
            value={planData.name}
            onChange={(e) => setPlanData({ ...planData, name: e.target.value })}
          />

          <textarea
            className="border p-2 w-full mb-2 rounded"
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

        {selectedNode ? (
          <NodeForm
            node={selectedNode}
            updateNode={(updatedNode) => {
              setNodes((nds) =>
                nds.map((n) => (n.id === selectedNodeId ? updatedNode : n))
              );
            }}
          />
        ) : (
          <div className="p-3 text-gray-500 text-sm">
            Select a node to edit its details
          </div>
        )}

        {selectedNode && (
          <RecipientFilter
            value={selectedNode.data.nodeData.recipient_filter || []}
            onChange={(tags) => {
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === selectedNodeId
                    ? {
                        ...n,
                        data: {
                          ...n.data,
                          nodeData: {
                            ...n.data.nodeData,
                            recipient_filter: tags,
                          },
                        },
                      }
                    : n
                )
              );
            }}
          />
        )}

        <button
          className="bg-blue-600 text-white py-2 rounded mt-4"
          onClick={savePlan}
        >
          Save Mail Plan
        </button>
      </div>

      <div className="col-span-2 h-[600px] border rounded">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
}
