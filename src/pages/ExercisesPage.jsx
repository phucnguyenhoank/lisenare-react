import { useEffect, useState, useRef, useContext } from "react";
import ExerciseCard from "../components/ExerciseCard";
import { getRecommendedItems } from "../api/recommendation";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { updateEvent } from "../api/interaction";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import PortfolioPage from "./PortfolioPage";

const TIME_TO_VIEW = Number(import.meta.env.VITE_TIME_TO_VIEW) || 3000;


export default function ExercisesPage() {
  const { username } = useContext(UserContext);
  if (!username) {
    // User not logged in → show portfolio
    return <PortfolioPage />;
  }

  const navigate = useNavigate();

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
      if (!username) {
        navigate("/login");
        return; // IMPORTANT
      }

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
    if (username) {
      loadBatch();
    }
  }, [username]);

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
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    const newIndex = swiper.activeIndex;
    const prevCard = activeCardRef.current;
    const prevStart = startTimeRef.current;

    // ---- Handle previous card ----
    if (prevCard && !viewSentRef.current) {
      const timeSpent = Date.now() - prevStart;
      if (timeSpent < TIME_TO_VIEW) {
        updateEvent(prevCard, "skip");
      }
    }

    // ---- Setup new card ----
    const newCard = recommendations[newIndex]?.study_session_id;
    activeCardRef.current = newCard;
    viewSentRef.current = false;
    startTimeRef.current = Date.now();

    if (viewTimerRef.current) clearTimeout(viewTimerRef.current);
    viewTimerRef.current = setTimeout(() => {
      if (!viewSentRef.current && newCard) {
        updateEvent(newCard, "view");
        viewSentRef.current = true;
      }
    }, TIME_TO_VIEW);

    // ---- Load more if near end ----
    const unseen = recommendations.length - newIndex - 1;
    if (unseen <= 0) loadBatch();

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
    <div className="bg-gray-100 p-2 md:p-6">
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
            }, TIME_TO_VIEW);
          }
        }}
        onSlideChange={handleSlideChange}
        className="w-full"
        autoHeight={true}
      >
        {recommendations.map((rec) => (
          <SwiperSlide key={`${rec.study_session_id}-${rec.item.id}`}>
            <div className="flex justify-center w-full">
              <div className="bg-white shadow rounded-xl max-w-md md:max-w-2xl w-full p-3 md:p-6">
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
            <div className="flex justify-center items-center w-full p-6">
              <p>Loading next batch...</p>
            </div>
          </SwiperSlide>
        )}
      </Swiper>

      <div className="mt-4 text-sm text-gray-600 text-right">
        Items: {recommendations.length}
        {loading ? " | Loading..." : ""}
      </div>
    </div>
  );
}
