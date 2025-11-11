// src/pages/ExercisesPage.jsx
import { useEffect, useState, useRef } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { recommendNext } from "../api/recommendation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ExercisesPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Load batch of 3
  async function loadBatch() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const username = localStorage.getItem("username") || "";
      const batch = await recommendNext(username);

      if (!Array.isArray(batch) || batch.length === 0) {
        throw new Error("Empty batch");
      }

      setRecommendations((prev) => [...prev, ...batch]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed");
    } finally {
      isFetchingRef.current = false;
      setLoading(false); // Safe: loading slide stays until next render
    }
  }

  // First load
  useEffect(() => {
    loadBatch();
  }, []);

  // Keyboard only
  useEffect(() => {
    const handleKey = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Early UI
  if (loading && recommendations.length === 0) return <p className="p-4">Loading…</p>;
  if (error && recommendations.length === 0) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Swiper
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={() => {
          if (!swiperRef.current || isFetchingRef.current) return;
          window.scrollTo({ top: 0, behavior: "smooth" });
          const active = swiperRef.current.activeIndex;
          const unseen = recommendations.length - active - 1;
          if (unseen <= 0) loadBatch();
        }}
        className="h-full"
      >
        {recommendations.map((rec) => (
          <SwiperSlide key={`${rec.recommendation_state.id}-${rec.item.id}`}>
            <div className="flex justify-center items-center h-full p-2 md:p-6">
              <div className="bg-white shadow rounded-xl max-w-md md:max-w-2xl w-full h-full overflow-y-auto p-3 md:p-6">
                <ExerciseCard recommendationState={rec.recommendation_state} exercise={rec.item} />
              </div>
            </div>
          </SwiperSlide>
        ))}

        {loading && (
          <SwiperSlide key="loading">
            <div className="flex justify-center items-center h-full p-6">
              <p>Loading next batch…</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        Items: {recommendations.length}{loading ? " | Loading…" : ""}
      </div>
    </div>
  );
}