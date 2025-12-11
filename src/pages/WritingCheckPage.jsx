import React, { useState, useMemo } from "react";
import { diffWordsWithSpace } from "diff";

export default function WritingCheckPage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("neutral");
  const [corrected, setCorrected] = useState(null); 
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(false);

  const stylePrompts = {
    formal: "Make this formal",
    neutral: "Make this neutral",
    informal: "Mkae this informal",
  };

  const handleCheck = async () => {
    setLoading(true); // start loading
    try {
      const prompt = stylePrompts[style];
      const start = performance.now();
      const resp = await apiCall(
          `/coedit/edit`,
          'POST',
          { prompt, text }
        );
      const end = performance.now();
      console.log(
        "Client-perceived latency (ms) Writing Check: ",
        end - start
      );
      

      const textResponse = resp?.edited_text ?? "";
      setCorrected(textResponse);
      setIsEditing(false);
    } finally {
      setLoading(false); // end loading
    }
  };

  const applyFix = (chunk) => {
    const newText = text.slice(0, chunk.index) + 
                    (chunk.to || "") + 
                    text.slice(chunk.index + (chunk.from?.length || 0));
    setText(newText);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto font-sans">
      {/* Header with Dropdown */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Writing Assistant</h1>
          <label className="text-sm text-gray-600 mr-2">Style:</label>
          <select 
            value={style} 
            onChange={(e) => setStyle(e.target.value)}
            className="border rounded p-1 text-sm bg-white"
          >
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="informal">Informal</option>
          </select>
        </div>

        <div className="space-x-2">
          {isEditing ? (
            <button 
              onClick={handleCheck} 
              disabled={loading} 
              className={`px-5 py-2 rounded transition ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {loading ? "Checking..." : "Check"}
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-green-400 rounded hover:bg-gray-300 transition">
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Editor Area */}
      {/* removed overflow-hidden to fix tooltip clipping */}
      <div className="relative border rounded-lg shadow-sm min-h-[200px] text-lg bg-white p-6">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full min-h-[200px] focus:outline-none resize-none"
            placeholder="Type here..."
          />
        ) : (
          <ReviewLayer text={text} corrected={corrected} onApply={applyFix} />
        )}
      </div>

      {/* Debug Section */}
      {corrected && (
        <div className="mt-6 p-4 bg-gray-50 border rounded text-sm text-gray-600 font-mono">
          <strong>Edited text (debug):</strong> {corrected}
        </div>
      )}
    </div>
  );
}

// --- Sub-Components ---
const ReviewLayer = ({ text, corrected, onApply }) => {
  const chunks = useMemo(() => getDiffChunks(text, corrected), [text, corrected]);

  return (
    <div className="whitespace-pre-wrap leading-relaxed">
      {chunks.map((chunk, i) => (
        chunk.type === "text" ? <span key={i}>{chunk.value}</span> : 
        <Suggestion key={i} chunk={chunk} onApply={onApply} />
      ))}
    </div>
  );
};

const Suggestion = ({ chunk, onApply }) => {
  const [open, setOpen] = useState(false);
  const [ignored, setIgnored] = useState(false);

  if (ignored) return <span>{chunk.type === "insert" ? "" : chunk.from}</span>;

  return (
    <span
      className={`relative inline-block cursor-pointer rounded px-0.5 transition-colors
        ${chunk.type === "insert" ? "bg-green-200" : "bg-red-200 hover:bg-red-300"}`}
      onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
    >
      {chunk.type === "insert" ? <span className="text-green-700 font-bold mx-1">¶</span> : chunk.from}

      {/* Tooltip */}
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-max">
          <div className="bg-white text-gray-800 text-sm rounded shadow-xl p-2 flex flex-col">
            {/* Content row */}
            <div className="mb-2">
              {chunk.type === "replace" && (
                <span>Change to <b>{chunk.to}</b></span>
              )}
              {chunk.type === "insert" && (
                <span>Add <b>{chunk.to}</b></span>
              )}
              {chunk.type === "delete" && (
                <span>Remove <b>{chunk.from}</b></span>
              )}
            </div>

            {/* Buttons row */}
            <div className="flex justify-end gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onApply(chunk); }}
                className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded font-bold transition-colors"
              >
                Apply
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setIgnored(true); }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white"/>
        </div>
      )}
    </span>
  );
};


// --- Logic Helper ---
function getDiffChunks(current, target) {
  if (!target) return [{ type: "text", value: current }];
  const rawDiffs = diffWordsWithSpace(current, target);
  const processed = [];
  let cursor = 0;

  for (let i = 0; i < rawDiffs.length; i++) {
    const part = rawDiffs[i];
    const next = rawDiffs[i + 1];

    if (part.removed && next?.added) {
      processed.push({ type: "replace", from: part.value, to: next.value, index: cursor });
      cursor += part.value.length;
      i++; 
    } else if (part.removed) {
      processed.push({ type: "delete", from: part.value, index: cursor });
      cursor += part.value.length;
    } else if (part.added) {
      processed.push({ type: "insert", to: part.value, index: cursor });
    } else {
      processed.push({ type: "text", value: part.value });
      cursor += part.value.length;
    }
  }
  return processed;
}