import { useEffect, useState, useRef } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { getRecommendedItems } from "../api/recommendation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { updateEvent } from "../api/interaction";

export default function ExercisesPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const swiperRef = useRef(null);
  const isFetchingRef = useRef(false);

  // ---- Event tracking refs ----
  const activeCardRef = useRef(null);      // store active study_session_id
  const viewTimerRef = useRef(null);
  const viewSentRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  // Load batch
  async function loadBatch() {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const username = localStorage.getItem("username");
      const batch = await getRecommendedItems(username);
      setRecommendations((prev) => [...prev, ...batch]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBatch();
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e) => {
      if (!swiperRef.current) return;
      if (e.key === "ArrowRight") swiperRef.current.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current.slidePrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // ---- Slide change handler ----
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    const prevCard = activeCardRef.current;
    const prevStart = startTimeRef.current;

    // ---- Handle previous card ----
    if (prevCard && !viewSentRef.current) {
      const timeSpent = Date.now() - prevStart;
      if (timeSpent < 4000) {
        updateEvent(prevCard, "skip");
      }
    }

    // ---- Setup new card ----
    const newCard = recommendations[newIndex]?.study_session_id;
    activeCardRef.current = newCard;
    viewSentRef.current = false;
    startTimeRef.current = Date.now();

    // schedule 'view' after 5s
    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    viewTimerRef.current = setTimeout(() => {
      if (!viewSentRef.current && newCard) {
        updateEvent(newCard, "view");
        viewSentRef.current = true;
      }
    }, 4000);

    // ---- Load more if near end ----
    const unseen = recommendations.length - newIndex - 1;
    if (unseen <= 0) loadBatch();

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- Cleanup timer on unmount ----
  useEffect(() => {
    return () => {
      if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    };
  }, []);

  // Early UI
  if (loading && recommendations.length === 0)
    return <p className="p-4">Loading...</p>;
  if (error && recommendations.length === 0)
    return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Swiper
        slidesPerView={1}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;

          // ---- Start timer for first card ----
          const firstCard = recommendations[0]?.study_session_id;
          if (firstCard) {
            activeCardRef.current = firstCard;
            viewSentRef.current = false;
            startTimeRef.current = Date.now();

            viewTimerRef.current = setTimeout(() => {
              if (!viewSentRef.current && firstCard) {
                updateEvent(firstCard, "view");
                viewSentRef.current = true;
              }
            }, 4000);
          }
        }}
        onSlideChange={handleSlideChange}
        className="h-full"
      >
        {recommendations.map((rec) => (
          <SwiperSlide key={`${rec.study_session_id.id}-${rec.item.id}`}>
            <div className="flex justify-center items-center h-full p-2 md:p-6">
              <div className="bg-white shadow rounded-xl max-w-md md:max-w-2xl w-full h-full overflow-y-auto p-3 md:p-6">
                <ExerciseCard
                  studySessionId={rec.study_session_id}
                  exercise={rec.item}
                />
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
        Items: {recommendations.length}
        {loading ? " | Loading…" : ""}
      </div>
    </div>
  );
}
