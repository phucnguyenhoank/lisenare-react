// src/pages/ExercisesPage.jsx
import { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { recommendNext } from "../api/recommendation";

export default function ExercisesPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const isFetchingRef = useRef(false); // prevents duplicate concurrent fetches
  const fetchedIdsRef = useRef(new Set()); // keep track of ids already appended

  const loadNext = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true); // Use the state for the loading slide

    try {
      const username = localStorage.getItem("username") || "";
      const item = await recommendNext(username);

      if (!item || fetchedIdsRef.current.has(item.id)) {
        // *** FIX: Reset flags if we return early
        isFetchingRef.current = false;
        setLoading(false);
        return;
      }
      fetchedIdsRef.current.add(item.id);
      setExercises((prev) => [...prev, item]);
      // We no longer need the setTimeout and swiper.update() here
      // useLayoutEffect will handle it.

    } catch (err) {
      console.error("Failed to fetch recommendation:", err);
      setError(err.message || String(err));
      // *** FIX: Also reset on error
      isFetchingRef.current = false;
      setLoading(false);
    } finally {
      // This will run after the 'try' or 'catch'
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []); // Dependencies are correct


  // initial load: fetch first exercise
  useEffect(() => {
    loadNext();
  }, [loadNext]);

  // keyboard navigation (keeps previous behavior)
  useEffect(() => {
    const handleKey = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ... after your keydown useEffect ...

  // This effect fixes the broken pre-loading chain
  useLayoutEffect(() => {
    if (swiperRef.current) {
      // 1. Update the swiper with the new slides
      swiperRef.current.update();

      // 2. Manually re-check if we need to load the *next* item
      const swiper = swiperRef.current;
      const activeIndex = swiper.activeIndex ?? 0;
      const totalExercises = exercises.length;

      // 3. Check condition and load if needed
      if (activeIndex >= totalExercises - 2 && !isFetchingRef.current) {
        loadNext();
      }
    }
  }, [exercises, loadNext]); // Re-run whenever the exercises array changes

  // handler when slide changes
  const handleSlideChange = (swiper) => {
    const activeIndex = swiper.activeIndex ?? 0;
    // preload when user reaches the second-to-last slide
    if (activeIndex >= exercises.length - 2) {
      loadNext();
    }
  };

  if (loading && exercises.length === 0) return <p className="p-4">Loading…</p>;
  if (error && exercises.length === 0) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="relative h-screen bg-gray-50">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
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

        {/* Optional: show a loading slide while next item is being fetched */}
        {isFetchingRef.current && (
          <SwiperSlide key="loading">
            <div className="flex justify-center items-center h-full px-4">
              <div className="w-full max-w-2xl h-[85vh] bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="h-full flex items-center justify-center">
                  <p>Loading next exercise…</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Navigation arrows – only show if > 1 exercise */}
      {exercises.length > 0 && (
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
