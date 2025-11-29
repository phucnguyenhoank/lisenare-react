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
    if (index >= 0 && index < quotes.length) setCurrentIndex(index);
  };

  const replay = () => {
    if (iframeRef.current) iframeRef.current.src = embedUrl;
  };

  const getHighlightedText = (text, query) => {
    if (!query) return text;
    const words = query.trim().split(/\s+/).filter(Boolean);
    if (!words.length) return text;
    const regex = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');
    return text.split(regex).map((part, i) =>
      regex.test(part) ? <span key={i} className="bg-yellow-200 rounded px-1">{part}</span> : part
    );
  };

  return (
    <div className="bg-white border border-black rounded p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Quote {currentIndex + 1} of {quotes.length}
        </h3>
        <p className="italic text-sm mb-1">"{getHighlightedText(current.text, query)}"</p>
        <p className="text-xs text-gray-800">Timestamp: {formatTime(startTime)}</p>
      </div>

      <div className="relative w-full aspect-video bg-black mb-4 rounded-sm overflow-hidden">
        <iframe
          ref={iframeRef}
          src={embedUrl}
          title="YouTube Quote"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>

      <div className="flex justify-center items-center gap-4 flex-wrap text-black">
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          className="p-2 border border-black rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowLeft size={16} />
        </button>

        <button
          onClick={replay}
          className="p-2 border border-black rounded-sm cursor-pointer"
        >
          <FaRedo size={16} />
        </button>

        <button
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === quotes.length - 1}
          className="p-2 border border-black rounded-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaArrowRight size={16} />
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

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
