import { useState } from "react";
import { generateQuestion } from "../api/question_recommendation";
import GeneratedQuestions from "../components/GeneratedQuestions";
imsession_id: crypto.randomUUID()

function flattenAndNormalize(items) {
  const out = [];

  function recurse(x) {
    if (Array.isArray(x)) {
      x.forEach(recurse);
    } else if (x && typeof x === "object") {
      // check if it's a question object (has question_text) else might be wrapper
      if (x.question_text) {
        // ensure option keys are option_a..option_d; some generators might use option_A etc.
        const normalized = { ...x };
        // fill option_a..option_d from alternative keys if missing
        const opts = ["a","b","c","d"];
        opts.forEach((o) => {
          const k = `option_${o}`;
          if (!normalized[k]) {
            // try variants
            const alt1 = `option_${o.toUpperCase()}`;
            const alt2 = `option${o.toUpperCase()}`;
            const alt3 = `option${o}`;
            normalized[k] = normalized[k] || normalized[alt1] || normalized[alt2] || normalized[alt3] || "";
          }
        });
        // ensure id
        normalized.id = normalized.id || crypto.randomUUID();
        out.push(normalized);
      } else {
        // object but not a question -> maybe wrapper with "questions" field
        if (Array.isArray(x.questions)) {
          recurse(x.questions);
        } else {
          // ignore
        }
      }
    } else {
      // ignore other types
    }
  }

  recurse(items);
  return out;
}

export default function QuestionGenerator() {
  const [passage, setPassage] = useState("");
  const [topK, setTopK] = useState(4);
  const [sessionId, setSessionId] = useState(() => crypto.randomUUID());
  const [userName, setUserName] = useState(() => localStorage.getItem("username") || "anonymous");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSelect = (qId, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setReveal(false);
    setAnswers({});
    try {
      const req = {
        user_name: userName,
        passage_text: passage,
        top_k: Number(topK),
        session_id: sessionId,
      };
      const res = await generateQuestion(req);

      // res could be { items: [...] } or a raw array
      const items = res?.items ?? res;
      const normalized = flattenAndNormalize(items);
      setQuestions(normalized);
    } catch (err) {
      console.error(err);
      setError(err.message || "Lỗi khi gọi API");
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = () => setReveal(true);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question generator</h1>

      <div className="mb-4 space-y-2">
        <label className="block text-sm font-medium">User name</label>
        <input
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            localStorage.setItem("username", e.target.value);
          }}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Passage text</label>
        <textarea
          rows={8}
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium">Top K</label>
          <input
            type="number"
            min={1}
            max={20}
            value={topK}
            onChange={(e) => setTopK(e.target.value)}
            className="w-24 p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Session id</label>
          <input
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="w-64 p-2 border rounded"
          />
        </div>

        <div className="self-end">
          <button
            onClick={handleGenerate}
            disabled={loading || !passage.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </div>

      {error && <div className="mb-4 text-red-600">Error: {error}</div>}

      {questions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <strong>Questions:</strong> {questions.length}
            </div>
            <div className="space-x-2">
              <button onClick={() => { setAnswers({}); setReveal(false); }} className="px-3 py-1 border rounded">Reset answers</button>
              <button onClick={handleReveal} className="px-3 py-1 bg-blue-600 text-white rounded">Reveal Answers</button>
            </div>
          </div>

          <GeneratedQuestions questions={questions} answers={answers} onSelect={onSelect} reveal={reveal} />
        </div>
      )}

      {questions.length === 0 && !loading && <div className="text-gray-600">Chưa có câu hỏi nào.</div>}
    </div>
  );
}