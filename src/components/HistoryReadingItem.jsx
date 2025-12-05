import React, { useState } from "react";

export default function ReadingItem({ lessionId, readingId, data }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        borderRadius: "10px",
        marginBottom: "20px",
        background: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {/* Header — click để mở */}
      <div
        style={{
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
        onClick={toggle}
      >
        <h3 style={{ margin: 0 }}>
          📘 Lession {lessionId} — Reading {readingId}
        </h3>
        <strong>{open ? "▲" : "▼"}</strong>
      </div>

      {/* Content ẩn/hiện */}
      {open && (
        <div style={{ marginTop: "15px" }}>
          <div style={{ marginBottom: "15px" }}>
            <strong>📖 Passage:</strong>
            <p style={{ whiteSpace: "pre-wrap" }}>{data.passage}</p>
          </div>

          <h4>❓ Danh sách câu hỏi:</h4>

          {data.list_question.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "10px 0",
                borderBottom: "1px solid #eee",
                marginBottom: "10px"
              }}
            >
              <p>
                <strong>Câu hỏi:</strong> {q.text}
              </p>

              <ul style={{ marginLeft: "20px" }}>
                <li>A. {q.options.A}</li>
                <li>B. {q.options.B}</li>
                <li>C. {q.options.C}</li>
                <li>D. {q.options.D}</li>
              </ul>

              <p>
                ✅ <strong>Đáp án đúng:</strong>{" "}
                {["A", "B", "C", "D"][q.correct - 1]}
              </p>

              <p>
                💡 <strong>Giải thích:</strong> {q.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
