import { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight, FaRedo } from 'react-icons/fa';

export default function VideoQuotePlayer({ quotes, query }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const iframeRef = useRef(null);

  const current = quotes[currentIndex];

  const getEmbedInfo = (url) => {
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get('v');
    const t = urlObj.searchParams.get('t') || Math.floor(current.start);
    return { videoId, startTime: parseInt(t, 10) };
  };

  const { videoId, startTime } = getEmbedInfo(current.url);
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=${startTime}&autoplay=1&rel=0&modestbranding=1`;

  const goTo = (index) => {
    if (index >= 0 && index < quotes.length) {
      setCurrentIndex(index);
    }
  };

  const replay = () => {
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl; // Forces restart from timestamp
    }
  };

  // Highlight query words in the text
  const getHighlightedText = (text, query) => {
    if (!query) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return text;
    const regex = new RegExp(`(${words.map(w => escapeRegExp(w)).join('|')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="bg-yellow-200 rounded px-1">{part}</span>
      ) : part
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          Quote {currentIndex + 1} of {quotes.length}
        </h3>
        <p className="text-base text-gray-600 mt-2 italic leading-relaxed max-w-3xl mx-auto">
          "{getHighlightedText(current.text, query)}"
        </p>
        <p className="text-sm text-gray-500 mt-1">Timestamp: {formatTime(startTime)}</p>
      </div>

      <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl mb-6">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="YouTube Quote"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>

      <div className="flex justify-center items-center gap-6 flex-wrap text-white">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full transition"
        >
          <FaArrowLeft size={20} />
        </button>

        <button
          onClick={replay}
          className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-md transition transform hover:scale-110"
        >
          <FaRedo size={20} />
        </button>

        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === quotes.length - 1}
          className="p-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full transition"
        >
          <FaArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

// Escape regex special characters in query words
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
