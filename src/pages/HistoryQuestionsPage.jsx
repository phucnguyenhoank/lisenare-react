import React, { useEffect, useState } from "react";
import { getHistoryQuestions } from "../api/question_history";
import HistoryReadingItem from "../components/HistoryReadingItem";
import { getLoggedInUsername } from "../utils/jwt";

export default function HistoryPage() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [userName] = useState(() => getLoggedInUsername());

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

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lịch sử câu hỏi đã tạo</h1>

      {Object.keys(data).length === 0 && (
        <p className="text-gray-600">Không có dữ liệu</p>
      )}

      {/* Loop Lession → Reading */}
      {Object.entries(data).map(([lessionId, readings]) =>
        Object.entries(readings).map(([readingId, readingData]) => (
          <HistoryReadingItem
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
