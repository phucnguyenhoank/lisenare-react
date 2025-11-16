import React, { useState, useMemo, useCallback } from "react";
import { checkWriting } from "../api/writing";
import DiffMatchPatch from 'diff-match-patch';

const dmp = new DiffMatchPatch();

export default function WritingCheckPage() {
  const [text, setText] = useState("");
  const [editedText, setEditedText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Compute word-level patches
  const computeSuggestions = useCallback((original, edited) => {
    // Use WORD mode for human-friendly suggestions
    dmp.Diff_EditCost = 4; // default
    const diffs = dmp.diff_main(original, edited);
    dmp.diff_cleanupSemantic(diffs); // merge nearby changes

    const patches = dmp.patch_make(original, diffs);
    return patches.map((patch, idx) => {
      const start = patch.start1;
      const end = start + patch.length1;
      const originalText = patch.diffs
        .filter(d => d[0] === -1)
        .map(d => d[1])
        .join('');
      const replacementText = patch.diffs
        .filter(d => d[0] === 1)
        .map(d => d[1])
        .join('');

      return {
        id: `patch-${idx}-${start}`,
        originalText: originalText || '(remove)',
        replacementText: replacementText || '(insert)',
        start,
        end,
        patch, // keep full patch for apply
      };
    });
  }, []);

  const handleCheck = async () => {
    setLoading(true);
    try {
      const resp = await checkWriting("Fix the grammar", text);
      const edited = resp?.edited_text ?? "";
      setEditedText(edited);
      const newSuggestions = computeSuggestions(text, edited);
      setSuggestions(newSuggestions);
    } catch (err) {
      console.error(err);
      alert("Error calling writing check API");
    } finally {
      setLoading(false);
    }
  };

  const applySuggestion = useCallback((id) => {
    const sug = suggestions.find(s => s.id === id);
    if (!sug) return;

    const [newText] = dmp.patch_apply([sug.patch], text);
    setText(newText);

    // Recompute remaining suggestions
    const remaining = suggestions.filter(s => s.id !== id);
    const updatedPatches = remaining.map(s => s.patch);
    const stillValidPatches = updatedPatches.filter(patch => {
      const [_, success] = dmp.patch_apply([patch], newText);
      return success;
    });

    const newSuggestions = stillValidPatches.map((patch, idx) => {
      const start = patch.start1;
      const end = start + patch.length1;
      const originalText = patch.diffs.filter(d => d[0] === -1).map(d => d[1]).join('');
      const replacementText = patch.diffs.filter(d => d[0] === 1).map(d => d[1]).join('');
      return { id: `re-${idx}`, originalText, replacementText, start, end, patch };
    });

    setSuggestions(newSuggestions);
  }, [suggestions, text]);

  const skipSuggestion = useCallback((id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  }, []);

  const applyAll = () => {
    if (!editedText) return;
    setText(editedText);
    setSuggestions([]);
  };

  const skipAll = () => setSuggestions([]);

  // Inline preview: highlight current suggestions
  const inlinePreview = useMemo(() => {
    if (!suggestions.length) return [{ text, type: "plain" }];

    const sorted = [...suggestions].sort((a, b) => a.start - b.start);
    const fragments = [];
    let pos = 0;

    for (const sug of sorted) {
      if (pos < sug.start) {
        fragments.push({ text: text.slice(pos, sug.start), type: "plain" });
      }
      fragments.push({ text: text.slice(sug.start, sug.end), type: "suggestion", id: sug.id });
      pos = sug.end;
    }
    if (pos < text.length) {
      fragments.push({ text: text.slice(pos), type: "plain" });
    }
    return fragments;
  }, [text, suggestions]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Check Your Writing</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border rounded-md h-48 resize-y"
            placeholder="Type your paragraph here..."
          />
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleCheck}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-60"
            >
              {loading ? "Checking..." : "Check"}
            </button>
            <button
              onClick={applyAll}
              disabled={!editedText || text === editedText}
              className="px-4 py-2 bg-green-600 text-white rounded-md disabled:opacity-60"
            >
              Apply All
            </button>
            <button
              onClick={skipAll}
              disabled={!suggestions.length}
              className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-60"
            >
              Skip All
            </button>
            <div className="ml-auto text-sm text-gray-500">
              Suggestions: {suggestions.length}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-4">
            <div className="text-sm text-gray-600 mb-1">Preview (changes highlighted)</div>
            <div className="p-3 border rounded-md bg-white min-h-[120px] whitespace-pre-wrap">
              {inlinePreview.map((frag, i) => (
                <span
                  key={i}
                  className={frag.type === "suggestion"
                    ? "bg-yellow-100 border border-yellow-300 px-0.5 rounded-sm"
                    : ""
                  }
                  title={frag.type === "suggestion" ? "Suggested change" : ""}
                >
                  {frag.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions Panel */}
        <aside className="bg-gray-50 border rounded-md p-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Suggestions</h2>
            <div className="text-xs text-gray-500">Click Apply to accept</div>
          </div>
          {suggestions.length === 0 ? (
            <div className="text-sm text-gray-500">No suggestions — click Check.</div>
          ) : (
            <div className="space-y-3 max-h-[60vh] overflow-auto pr-2">
              {suggestions.map((sug) => (
                <div key={sug.id} className="p-3 bg-white border rounded-md text-sm">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">Original</div>
                      <div className="p-2 bg-red-50 border rounded mt-1 font-medium">
                        {sug.originalText || <em>(remove)</em>}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">Suggestion</div>
                      <div className="p-2 bg-green-50 border rounded mt-1 font-medium">
                        {sug.replacementText || <em>(insert)</em>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => applySuggestion(sug.id)}
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => skipSuggestion(sug.id)}
                        className="px-3 py-1 bg-gray-200 text-xs rounded"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        Powered by <code>diff-match-patch</code> — smarter, shorter, battle-tested.
      </div>
    </div>
  );
}