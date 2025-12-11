import { useEffect, useState } from "react";
import ReadingItem from "../components/ReadingItem";
import { findUser } from "../api/finduser";

export default function ReadingListPage() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  async function handleSearch() {
    if (!username.trim()) return;

    setLoading(true);
    try {
      const data = await findUser(username.trim());
      console.log("Raw readings from BE:", data);
      setReadings(data);
    } catch (error) {
      console.error("Error fetching reading:", error);
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Find Reading By User</h1>

      {/* Ô tìm kiếm user */}
      <div className="flex gap-2 mb-5">
        <input
          type="text"
          placeholder="Enter the name of user..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />

        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
        >
          Tìm
        </button>
      </div>

      {/* Nội dung reading */}
      {loading ? (
        <p>Loading data...</p>
      ) : readings.length === 0 ? (
        <p>There are no reading passages.</p>
      ) : (
        readings.map((item, index) => (
          <ReadingItem key={index} reading={item} />
        ))
      )}
    </div>
  );
}
