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
      setReadings(data); // BE trả về đúng list reading
    } catch (error) {
      console.error("Error fetching reading:", error);
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h1>Reading Practice</h1>

      {/* Ô tìm kiếm user */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          type="text"
          placeholder="Nhập tên người dùng..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSearch}
          style={{
            padding: "10px 18px",
            borderRadius: 6,
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Tìm
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : readings.length === 0 ? (
        <p>Không có bài reading nào</p>
      ) : (
        readings.map((item, index) => (
          <ReadingItem key={index} reading={item} />
        ))
      )}
    </div>
  );
}
