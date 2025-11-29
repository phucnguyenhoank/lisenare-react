import { useState, useMemo } from "react";
import { diffWordsWithSpace } from "diff";

export default function GrammarCheckBox() {
  const [currentText, setCurrentText] = useState("hi what is you name");
  const correctedText = "What is your name?";

  // 1. Generate diffs and calculate exact positions for replacements
  const chunks = useMemo(() => {
    const rawDiffs = diffWordsWithSpace(currentText, correctedText);
    console.log(rawDiffs);
    const processed = [];
    let cursor = 0; // Tracks exact index in currentText

    for (let i = 0; i < rawDiffs.length; i++) {
      const part = rawDiffs[i];
      const next = rawDiffs[i + 1];

      // Detect Replace: Removed followed immediately by Added
      if (part.removed && next?.added) {
        processed.push({
          type: "replace", from: part.value, to: next.value, index: cursor
        });
        cursor += part.value.length;
        i++; // Skip next
      } 
      // Detect Delete
      else if (part.removed) {
        processed.push({ type: "delete", from: part.value, index: cursor });
        cursor += part.value.length;
      } 
      // Detect Insert
      else if (part.added) {
        processed.push({ type: "insert", to: part.value, index: cursor });
      } 
      // Plain Text
      else {
        processed.push({ type: "text", value: part.value });
        cursor += part.value.length;
      }
    }
    console.log(processed);
    return processed;
  }, [currentText, correctedText]);

  // 2. Robust helper to apply text changes by index
  const applyFix = (index, lengthToRemove, textToInsert) => {
    console.log(`Applying fix: remove ${lengthToRemove} chars at ${index}, insert "${textToInsert}"`);
    const newText = currentText.slice(0, index) + textToInsert + currentText.slice(index + lengthToRemove);
    console.log("New text:", newText);
    setCurrentText(newText);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto font-sans">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Your Text (with suggestions)</h2>
      
      <div className="text-3xl leading-relaxed bg-white p-10 rounded-2xl shadow-xl border-2 border-gray-100">
        {chunks.map((chunk, i) => (
          chunk.type === "text" ? (
            <span key={i}>{chunk.value}</span>
          ) : (
            <Suggestion 
              key={i} 
              {...chunk} 
              onApply={() => applyFix(chunk.index, chunk.from?.length || 0, chunk.to || "")} 
            />
          )
        ))}
      </div>
    </div>
  );
}

// 3. Extracted UI Component for cleanliness
const Suggestion = ({ type, from, to, onApply }) => {
  const [open, setOpen] = useState(false);
  const [skipped, setSkipped] = useState(false);

  if (skipped) {
    // Render text as normal without color
    return <span>{type === "insert" ? "\u200B" : from}</span>;
  }

  return (
    <span
      className={`relative inline-block cursor-pointer select-none
        ${type === "insert" ? "bg-green-200 w-1 h-6 align-middle mx-0.5" :
          (type === "replace" ? "px-1 rounded bg-yellow-100" : "px-1 rounded bg-red-100")}`}
      onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
    >
      {type === "insert" ? "\u200B" : from}

      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                        transition-opacity duration-200 bg-gray-900 text-white text-sm rounded-lg py-2 px-4 
                        whitespace-nowrap z-10">
          <div className="font-medium text-center">
            {type === "replace" && `Replace "${from}" → "${to}"`}
            {type === "insert" && `Insert "${to}"`}
            {type === "delete" && `Remove "${from}"`}
          </div>
          <div className="flex gap-2 mt-2 justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); onApply(); setOpen(false); }}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs font-medium transition"
            >
              Apply
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setSkipped(true); setOpen(false); }}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-xs font-medium transition"
            >
              Skip
            </button>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-gray-900" />
        </div>
      )}
    </span>
  );
};
  