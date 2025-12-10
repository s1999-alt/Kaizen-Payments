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

import NodeForm from "./NodeForm.jsx";
import RecipientFilter from "./RecipientFilter.jsx";

import { getMailPlan, createMailPlan, updateMailPlan } from "../api/mailPlans.js";

export default function MailPlanBuilder({ planId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [planData, setPlanData] = useState({
    name: "",
    description: "",
    is_active: true,
  });

  // Get currently selected node (object) or null
  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  // Load existing plan
  useEffect(() => {
    if (planId) {
      getMailPlan(planId).then((res) => {
        const plan = res.data;

        // Plan base data
        setPlanData({
          name: plan.name,
          description: plan.description,
          is_active: plan.is_active,
        });

        // Load nodes
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
        data: {
          label: "New Node",
          nodeData: {
            subject: "",
            body: "",
            trigger_type: "",
            event_name: "",
            delay_minutes: "",
            scheduled_datetime: "",
            recipient_filter: [],
          },
        },
        type: "default",
      },
    ]);
  };

  //  HANDLE NODE CLICK
  const onNodeClick = (_, node) => {
    setSelectedNodeId(node.id);
  };

  //  SAVE PLAN
  const savePlan = async () => {
    if (!planData.name.trim()) return alert("Plan name required");
    if (nodes.length === 0) return alert("Add at least one node");

    const payload = {
      ...planData,
      nodes: nodes.map((n, index) => {
        const nd = n.data.nodeData;
        return {
          id: nd.id, 
          order: index + 1,
          subject: nd.subject,
          body: nd.body,
          trigger_type: nd.trigger_type,
          event_name: nd.event_name,
          delay_minutes: nd.delay_minutes,
          scheduled_datetime: nd.scheduled_datetime,
          recipient_filter: nd.recipient_filter || [],
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

        {/* NODE FORM */}
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

        {/* RECIPIENT FILTER for selected node */}
        {selectedNode && (
          <RecipientFilter
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


