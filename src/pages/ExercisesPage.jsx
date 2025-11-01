import { useEffect, useState, useRef } from "react";
import { fetchReadings } from "../api/reading";
import ExerciseCard from "../components/ExerciseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const swiperRef = useRef(null);

  // Load data
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchReadings();
        setExercises(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  if (loading) return <p className="p-4">Loading…</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="relative h-screen bg-gray-50">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-full"
      >
        {exercises.map((ex) => (
          <SwiperSlide key={ex.id}>
            <div className="flex justify-center items-center h-full px-4">
              <div className="w-full max-w-2xl h-[85vh] bg-white rounded-2xl shadow-md overflow-hidden">
                {/* Make the content inside scrollable */}
                <div className="h-full overflow-y-auto">
                  <ExerciseCard exercise={ex} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation arrows – only show if more than 1 exercise */}
      {exercises.length > 1 && (
        <>
          <NavButton side="left" onClick={() => swiperRef.current?.slidePrev()} />
          <NavButton side="right" onClick={() => swiperRef.current?.slideNext()} />
        </>
      )}
    </div>
  );
}

function NavButton({ side, onClick }) {
  const isLeft = side === "left";
  return (
    <button
      onClick={onClick}
      aria-label={isLeft ? "Previous exercise" : "Next exercise"}
      className={`absolute top-1/2 -translate-y-1/2 z-20
        w-10 h-10 md:w-12 md:h-12
        rounded-full bg-white/70 backdrop-blur-sm
        border border-gray-300 shadow-md
        flex items-center justify-center
        hover:bg-white hover:scale-110 hover:shadow-lg
        transition-all duration-200
        ${isLeft ? "left-2" : "right-2"}
        hidden sm:flex`}
    >
      <svg
        className={`w-5 h-5 md:w-6 md:h-6 ${isLeft ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}
