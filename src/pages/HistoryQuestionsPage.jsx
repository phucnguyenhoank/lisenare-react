import React, { useEffect, useState } from "react";
import { getHistoryQuestions } from "../api/question_history";
import ReadingItem from "../components/HistoryReadingItem";
import { getLoggedInUsername } from "../utils/jwt";
export default function HistoryPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(() => getLoggedInUsername());

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getHistoryQuestions(userName);
        setData(res.data || {});
      } catch (err) {
        console.log("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userName]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>Lịch sử câu hỏi đã tạo</h1>

      {Object.keys(data).length === 0 && <p>Không có dữ liệu</p>}

      {/* Loop Lession → Reading */}
      {Object.entries(data).map(([lessionId, readings]) =>
        Object.entries(readings).map(([readingId, readingData]) => (
          <ReadingItem
            key={`${lessionId}-${readingId}`}
            lessionId={lessionId}
            readingId={readingId}
            data={readingData}
          />
        ))
      )}
    </div>
  );
}
