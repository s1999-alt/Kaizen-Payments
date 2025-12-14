import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function RecipientFilter({ value = { tags: [] }, onChange }) {
  const [recipients, setRecipients] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(value);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSelectedTags(value);
  }, [value]);

  useEffect(() => {
    api.get("/mail/recipients/").then((res) => {
      setRecipients(res.data);

      const tags = new Set();
      res.data.forEach((r) => r.tags?.forEach((t) => tags.add(t)));
      setUniqueTags([...tags]);
    });
  }, []);

  const toggleTag = (tag) => {
    let updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <div className="border p-3 rounded bg-white shadow-sm">
      <h3 className="font-semibold mb-2">Recipient Filter</h3>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Search recipients..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {uniqueTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded text-sm border ${
              selectedTags.includes(tag)
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-3 text-sm">
        <strong>Selected:</strong>{" "}
        {selectedTags.length ? selectedTags.join(", ") : "None"}
      </div>
    </div>
  );
}
