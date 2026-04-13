import React, { useState } from "react";
import { exportCSV } from "../utils/csv";

const UserList = ({ users, title }) => {
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    u.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow mt-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>

        <button
          onClick={() => exportCSV(title, users)}
          className="bg-black text-white px-3 py-1 rounded-lg"
        >
          Export CSV
        </button>
      </div>

      <input
        className="w-full border p-2 rounded-lg mb-4"
        placeholder="Search username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="max-h-96 overflow-y-auto">
        {filtered.map((user) => (
          <a
            key={user}
            href={`https://instagram.com/${user}`}
            target="_blank"
            rel="noreferrer"
            className="block p-2 hover:bg-gray-100 rounded"
          >
            @{user}
          </a>
        ))}
      </div>
    </div>
  );
};

export default UserList;
