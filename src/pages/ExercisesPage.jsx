// src/pages/ExercisesPage.jsx
import { useEffect, useState, useRef } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { recommendNext } from "../api/recommendation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export default function ExercisesPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [userState, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const isFetchingRef = useRef(false);

  async function loadNext() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const username = localStorage.getItem("username") || "";
      const recommendation = await recommendNext(username); // <-- returns { user_state, item }

      if (!recommendation || !recommendation.item) {
        throw new Error("No item returned");
      }

      // save user_state if backend returns it
      if (recommendation.user_state) {
        setUserState(recommendation.user_state);
      }

      // append the returned item
      setRecommendations((prev) => [...prev, recommendation]);

    } catch (err) {
      console.error("Failed to fetch recommendation:", err);
      setError(err.message || "Failed to fetch");
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }

  // load first item on mount
  useEffect(() => {
    loadNext();
  }, []);

  // keyboard controls: left/right arrows
  useEffect(() => {
    function handleKey(e) {
      if (!swiperRef.current) return;

      if (e.key === "ArrowRight") {
        swiperRef.current.slideNext();
        // If we're on the last slide, request the next one
        const active = swiperRef.current.activeIndex ?? 0;
        if (active >= recommendations.length - 1) {
          loadNext();
        }
      }

      if (e.key === "ArrowLeft") {
        swiperRef.current.slidePrev();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // intentionally not listing loadNext/recommendations to keep handler stable
    // if you want strict linting, wrap handler in useCallback with deps
  }, [recommendations.length]);

  if (loading && recommendations.length === 0) {
    return <p className="p-4">Loading…</p>;
  }

  if (error && recommendations.length === 0) {
    return <p className="p-4 text-red-500">Error: {error}</p>;
  }

  return (
    <div className="h-screen bg-gray-100">
      <Swiper
        slidesPerView={1}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className="h-full"
      >
        {recommendations.map((rec) => (
          <SwiperSlide key={`${rec.user_state.id}-${rec.item.id}`}>
            <div className="flex justify-center items-center h-full p-6">
              <div className="bg-white shadow rounded-xl max-w-2xl w-full h-[85vh] overflow-y-auto p-6">
                <ExerciseCard userState={rec.user_state} exercise={rec.item} />
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* show a simple loading slide at the end while next is fetching */}
        {loading && recommendations.length > 0 && (
          <SwiperSlide key="loading">
            <div className="flex justify-center items-center h-full p-6">
              <p>Loading next…</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      {/* Minimal status in corner */}
      <div className="absolute bottom-4 right-4 text-sm text-gray-600">
        {userState ? `user_state id: ${userState.id}` : null}
      </div>
    </div>
  );
}
