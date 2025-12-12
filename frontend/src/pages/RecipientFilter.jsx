import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function RecipientFilter({ value = [], onChange }) {
  const [recipients, setRecipients] = useState([]);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [selected, setSelected] = useState(value);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSelected(value);
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
    let updated = selected.includes(tag)
      ? selected.filter((t) => t !== tag)
      : [...selected, tag];

    setSelected(updated);
    onChange(updated);
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
              selected.includes(tag)
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
        {selected.length ? selected.join(", ") : "None"}
      </div>
    </div>
  );
}






// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

// export default function RecipientFilter({ onChange }) {
//   const [recipients, setRecipients] = useState([]);
//   const [uniqueTags, setUniqueTags] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     api.get("/mail/recipients/").then((res) => {
//       setRecipients(res.data);

//       // Extract all tags
//       const tags = new Set();
//       res.data.forEach((r) => {
//         r.tags?.forEach((t) => tags.add(t));
//       });

//       setUniqueTags([...tags]);
//     });
//   }, []);

//   const toggleTag = (tag) => {
//     let updated;
//     if (selected.includes(tag)) {
//       updated = selected.filter((t) => t !== tag);
//     } else {
//       updated = [...selected, tag];
//     }

//     setSelected(updated);
//     onChange(updated); // send to parent
//   };

//   return (
//     <div className="border p-3 rounded bg-white shadow-sm">
//       <h3 className="font-semibold mb-2">Recipient Filter</h3>

//       <input
//         className="w-full border p-2 mb-3 rounded"
//         placeholder="Search recipients..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <div className="flex flex-wrap gap-2">
//         {uniqueTags.map((tag) => (
//           <button
//             key={tag}
//             onClick={() => toggleTag(tag)}
//             className={`px-3 py-1 rounded text-sm border ${
//               selected.includes(tag)
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {tag}
//           </button>
//         ))}
//       </div>

//       <div className="mt-3">
//         <strong>Selected:</strong>{" "}
//         {selected.length ? selected.join(", ") : "None"}
//       </div>
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import api from "../api/axios";

// export default function RecipientFilter({ onChange }) {
//   const [tags, setTags] = useState([]);
//   const [selected, setSelected] = useState([]);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     api.get("/mail/recipients/").then((res) => setTags(res.data));
//   }, []);

//   const toggleTag = (tag) => {
//     let updated;
//     if (selected.includes(tag)) {
//       updated = selected.filter((t) => t !== tag);
//     } else {
//       updated = [...selected, tag];
//     }
//     setSelected(updated);
//     onChange(updated);
//   };

//   return (
//     <div className="border p-3 rounded bg-white shadow-sm">
//       <h3 className="font-semibold mb-2">Recipient Filter</h3>

//       <input
//         className="w-full border p-2 mb-3 rounded"
//         placeholder="Search recipients..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <div className="flex flex-wrap gap-2">
//         {tags.map((tag) => (
//           <button
//             key={tag}
//             onClick={() => toggleTag(tag)}
//             className={`px-3 py-1 rounded text-sm border ${
//               selected.includes(tag)
//                 ? "bg-blue-600 text-white"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {tag}
//           </button>
//         ))}
//       </div>

//       <div className="mt-3">
//         <strong>Selected:</strong>{" "}
//         {selected.length ? selected.join(", ") : "None"}
//       </div>
//     </div>
//   );
// }
