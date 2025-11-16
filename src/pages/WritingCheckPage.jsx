import { useState } from "react";
import { checkWriting } from "../api/writing";

export default function WritingCheckPage() {
    const [text, setText] = useState("");

    const handleCheck = async () => {
        const editedTextResult = await checkWriting("Fix the grammar", text);
        alert("You pressed Check! Result=" + editedTextResult.edited_text);
    }

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Check Your Writing</h1>

            <textarea   
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 border rounded-md h-40"
                placeholder="Type your paragraph here..."
            />

            <button
                onClick={handleCheck}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md"
            >
                Check
            </button>

        </div>
    );
}