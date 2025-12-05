import React, { useState } from "react";

export default function HistoryReadingItem({ lessionId, readingId, data }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-lg bg-white shadow p-4 mb-6">
      {/* Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          📘 Title {data.title} — Reading {readingId}
        </h3>
        <span className="text-xl">{open ? "▲" : "▼"}</span>
      </div>

      {/* Content */}
      {open && (
        <div className="mt-4 space-y-4">
          {/* Passage */}
          <div>
            <div className="font-semibold text-gray-700 mb-1">📖 Passage:</div>
            <div className="bg-gray-50 p-3 rounded text-gray-800 whitespace-pre-wrap">
              {data.passage}
            </div>
          </div>

          {/* Questions */}
          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-2">
              ❓ Danh sách câu hỏi:
            </h4>

            <div className="space-y-4">
              {data.list_question.map((q) => (
                <div
                  key={q.id}
                  className="border rounded-lg p-3 bg-white shadow-sm"
                >
                  {/* Question Text */}
                  <p className="font-medium text-gray-900 mb-2">
                    <strong>Câu hỏi:</strong> {q.text}
                  </p>

                  {/* Options */}
                  <ul className="ml-5 list-disc text-gray-700 space-y-1">
                    <li>A. {q.options.A}</li>
                    <li>B. {q.options.B}</li>
                    <li>C. {q.options.C}</li>
                    <li>D. {q.options.D}</li>
                  </ul>

                  {/* Correct Answer */}
                  <p className="mt-2 text-emerald-700 font-medium">
                    ✅ Đáp án đúng:{" "}
                    {["A", "B", "C", "D"][q.correct - 1]}
                  </p>

                  {/* Explanation */}
                  <div className="mt-2 bg-gray-50 p-2 rounded text-gray-700">
                    <strong>💡 Giải thích:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
