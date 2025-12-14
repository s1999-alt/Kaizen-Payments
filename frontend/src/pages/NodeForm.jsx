import React, { useState, useEffect } from "react";

export default function NodeForm({ node, updateNode }) {
  if (!node) return null;

  const [formData, setFormData] = useState(node.data.nodeData);

  useEffect(() => {
    setFormData(node.data.nodeData);
  }, [node]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveNode = () => {
    updateNode({
      ...node,
      data: {
        ...node.data,
        label: formData.subject || "Unnamed Node",
        nodeData: formData,
      },
    });
  };

  return (
    <div className="p-4 border rounded bg-white shadow-sm">
      <h3 className="font-bold mb-2">Edit Node</h3>

      <input
        name="subject"
        placeholder="Subject"
        value={formData.subject}
        onChange={handleChange}
        className="p-2 border rounded w-full mb-2"
      />

      <textarea
        name="body"
        placeholder="Email Body"
        value={formData.body}
        onChange={handleChange}
        className="p-2 border rounded w-full mb-2"
      />

      <select
        name="trigger_type"
        value={formData.trigger_type}
        onChange={handleChange}
        className="p-2 border rounded w-full mb-2"
      >
        <option value="on_event">On Event</option>
        <option value="delay">Delay</option>
        <option value="schedule">Schedule</option>
      </select>

      {formData.trigger_type === "delay" && (
        <input
          type="number"
          name="delay_minutes"
          placeholder="Delay minutes"
          value={formData.delay_minutes || ""}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-2"
        />
      )}

      {formData.trigger_type === "schedule" && (
        <input
          type="datetime-local"
          name="scheduled_datetime"
          value={formData.scheduled_datetime || ""}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-2"
        />
      )}

      {formData.trigger_type === "on_event" && (
        <input
          name="event_name"
          placeholder="Event name"
          value={formData.event_name || ""}
          onChange={handleChange}
          className="p-2 border rounded w-full mb-2"
        />
      )}

      <button
        onClick={saveNode}
        className="bg-blue-600 text-white py-2 rounded w-full"
      >
        Save Node
      </button>
    </div>
  );
}
