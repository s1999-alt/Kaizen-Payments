import React, { useState, useEffect } from "react";
import { getRecipients } from "../api/recipients.js";

export default function NodeForm({ nodes, setNodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    trigger_type: "on_event",
    delay_minutes: "",
    scheduled_datetime: "",
    event_name: "",
    recipient_filter: { tags: [], email: "" },
  });

  const [recipients, setRecipients] = useState([]);

  useEffect(() => {
    getRecipients().then((res) => setRecipients(res.data));
  }, []);

  useEffect(() => {
    if (selectedNodeId) {
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        setFormData(node.data.nodeData);
      }
    }
  }, [selectedNodeId, nodes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recipient_filter: { ...prev.recipient_filter, [name]: value },
    }));
  };

  const saveNode = () => {
    setNodes((prevNodes) =>
      prevNodes.map((n) =>
        n.id === selectedNodeId ? { ...n, data: { ...n.data, nodeData: formData, label: formData.subject } } : n
      )
    );
  };

  return (
    <div className="p-4 mt-4 border border-gray-300 rounded">
      <h3 className="font-bold mb-2">Node Editor</h3>

      <select
        className="mb-2 p-1 border"
        value={selectedNodeId || ""}
        onChange={(e) => setSelectedNodeId(e.target.value)}
      >
        <option value="">Select Node</option>
        {nodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.data.label}
          </option>
        ))}
      </select>

      {selectedNodeId && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            className="p-1 border"
          />
          <textarea
            name="body"
            placeholder="Email Body"
            value={formData.body}
            onChange={handleChange}
            className="p-1 border"
          />
          <select
            name="trigger_type"
            value={formData.trigger_type}
            onChange={handleChange}
            className="p-1 border"
          >
            <option value="on_event">On Event</option>
            <option value="delay">After Delay</option>
            <option value="schedule">Scheduled Time</option>
          </select>

          {formData.trigger_type === "delay" && (
            <input
              type="number"
              name="delay_minutes"
              placeholder="Delay in minutes"
              value={formData.delay_minutes}
              onChange={handleChange}
              className="p-1 border"
            />
          )}

          {formData.trigger_type === "schedule" && (
            <input
              type="datetime-local"
              name="scheduled_datetime"
              value={formData.scheduled_datetime}
              onChange={handleChange}
              className="p-1 border"
            />
          )}

          {formData.trigger_type === "on_event" && (
            <input
              type="text"
              name="event_name"
              placeholder="Event Name"
              value={formData.event_name}
              onChange={handleChange}
              className="p-1 border"
            />
          )}

          <input
            type="text"
            name="tags"
            placeholder="Recipient Tags (comma-separated)"
            value={formData.recipient_filter.tags?.join(",") || ""}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                recipient_filter: { ...prev.recipient_filter, tags: e.target.value.split(",") },
              }))
            }
            className="p-1 border"
          />
          <input
            type="text"
            name="email"
            placeholder="Recipient Email Filter"
            value={formData.recipient_filter.email || ""}
            onChange={handleFilterChange}
            className="p-1 border"
          />

          <button
            onClick={saveNode}
            className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
          >
            Save Node
          </button>
        </div>
      )}
    </div>
  );
}
