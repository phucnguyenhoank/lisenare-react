import { useState } from "react";

export default function ReadingItem({ reading }) {
  const [open, setOpen] = useState(false);

  // userAnswers = { 25: "A", ... }
  const [userAnswers, setUserAnswers] = useState({});

  // reveal state: true → hiển thị đúng/sai & explanation
  const [isRevealed, setIsRevealed] = useState(false);

  function handleSelect(questionId, optionKey) {
    if (isRevealed) return; // khi đã reveal thì không cho đổi đáp án

    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  }

  function resetAll() {
    setUserAnswers({});
    setIsRevealed(false);
  }

  function revealAll() {
    setIsRevealed(true);
  }

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
      }}
    >
      <h2 style={{ cursor: "pointer" }} onClick={() => setOpen(!open)}>
        {reading.title}
      </h2>

      {open && (
        <>
          <p style={{ whiteSpace: "pre-line", marginBottom: 20 }}>
            {reading.passage}
          </p>

          {/* --- 2 button --- */}
          <div style={{ marginBottom: 20, display: "flex", gap: 10 }}>
            <button
              onClick={resetAll}
              style={{
                padding: "8px 16px",
                background: "#f3f4f6",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              Reset
            </button>

            <button
              onClick={revealAll}
              style={{
                padding: "8px 16px",
                background: "#3b82f6",
                color: "white",
                border: "none",
                cursor: "pointer",
                borderRadius: 6,
              }}
            >
              Reveal
            </button>
          </div>

          {/* --- Danh sách câu hỏi --- */}
          <h3>Câu hỏi</h3>

          {reading.list_question?.map((q) => {
            const correctKey = Object.keys(q.options)[q.correct];
            const userAnswer = userAnswers[q.id];

            const isCorrect = userAnswer === correctKey;

            return (
              <div
                key={q.id}
                style={{
                  marginBottom: 20,
                  padding: 15,
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                <p style={{ fontWeight: "bold" }}>{q.text}</p>

                <div style={{ marginLeft: 10 }}>
                  {Object.entries(q.options).map(([key, val]) => {
                    const isSelected = userAnswer === key;

                    let bg = "transparent";
                    let border = "1px solid transparent";

                    if (isSelected) {
                      bg = "#dbeafe";
                      border = "1px solid #60a5fa";
                    }

                    // highlight sau khi reveal
                    if (isRevealed) {
                      if (key === correctKey) {
                        bg = "#dcfce7"; // xanh lá – đúng
                        border = "1px solid #22c55e";
                      } else if (isSelected && !isCorrect) {
                        bg = "#fee2e2"; // đỏ – sai
                        border = "1px solid #ef4444";
                      }
                    }

                    return (
                      <div
                        key={key}
                        onClick={() => handleSelect(q.id, key)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "6px 8px",
                          borderRadius: 6,
                          cursor: "pointer",
                          background: bg,
                          border: border,
                          marginBottom: 6,
                        }}
                      >
                        <input
                          type="radio"
                          checked={isSelected}
                          disabled={isRevealed}
                          onChange={() => handleSelect(q.id, key)}
                        />
                        <span>
                          <strong>{key}.</strong> {val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Giải thích khi REVEAL */}
                {isRevealed && (
                  <div style={{ marginTop: 10 }}>
                    <p>
                      <strong>Đáp án đúng:</strong> {correctKey} –{" "}
                      {q.options[correctKey]}
                    </p>

                    <p style={{ marginTop: 5 }}>
                      <strong>Giải thích:</strong> {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
