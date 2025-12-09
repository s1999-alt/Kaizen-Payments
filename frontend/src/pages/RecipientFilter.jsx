import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function RecipientFilter({ onChange }) {
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/recipients/tags/").then((res) => setTags(res.data));
  }, []);

  const toggleTag = (tag) => {
    let updated;
    if (selected.includes(tag)) {
      updated = selected.filter((t) => t !== tag);
    } else {
      updated = [...selected, tag];
    }
    setSelected(updated);
    onChange(updated);
  };

  return (
    <div className="border p-3 rounded bg-white shadow-sm">
      <h3 className="font-semibold mb-2">Recipient Filter</h3>

      {/* Search bar */}
      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Search recipients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded text-sm border ${
              selected.includes(tag)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-3">
        <strong>Selected:</strong>{" "}
        {selected.length ? selected.join(", ") : "None"}
      </div>
    </div>
  );
}
