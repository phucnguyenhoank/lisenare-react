import { ThumbsUp, ThumbsDown } from "lucide-react";

export default function RatingButtons({ rating, onChange }) {
  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={() => onChange(1)}
        className={`flex items-center gap-1 px-3 py-1 rounded border 
          ${rating === 1 ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-green-100"}`}
      >
        <ThumbsUp size={18} />
        Like
      </button>

      <button
        onClick={() => onChange(-1)}
        className={`flex items-center gap-1 px-3 py-1 rounded border 
          ${rating === -1 ? "bg-red-600 text-white" : "bg-gray-100 hover:bg-red-100"}`}
      >
        <ThumbsDown size={18} />
        Dislike
      </button>
    </div>
  );
}
