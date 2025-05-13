"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/psa"); // fetches from your API route
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message || "Error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);
console.log (data)
  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!data.length) return <p>No data found.</p>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hospital Data</h1>
      <table className="table-auto border border-collapse border-gray-300">
        <thead>
          <tr>
            <th className="border px-4 py-2">PSA ID</th>
            <th className="border px-4 py-2">Hospital Name</th>
            {/* Add more fields if needed */}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.psa_id}>
              <td className="border px-4 py-2">{row.psa_id}</td>
              <td className="border px-4 py-2">{row.hospital_name}</td>
              {/* More fields */}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
