// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import WritingCheckPage from "./pages/WritingCheckPage";
import ContextSearchPage from "./pages/ContextSearchPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { UserProvider } from "./contexts/UserContext";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import GenerateQuestionsPage from "./pages/GenerateQuestionsPage";
import HistoryQuestionsPage from "./pages/HistoryQuestionsPage";
import SubmittedSessionsPage from "./pages/SubmittedSessionsPage";
import SessionDetailPage from "./pages/SessionDetailPage";
import UserReadingPage from "./pages/UserReadingPage"

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ExercisesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/submitted-lessons" element={<SubmittedSessionsPage />} />
          <Route path="/study-session/:sessionId" element={<SessionDetailPage />} />
          <Route path="/writing-check" element={<WritingCheckPage />} />
          <Route path="/context-search" element={<ContextSearchPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/generate-questions" element={<GenerateQuestionsPage/>}/>
          <Route path="/history" element={<HistoryQuestionsPage/>}/>
          <Route path="/user-reading" element={<UserReadingPage/>}/>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;


// // ------- TESTING ----------

// import TestBox from "./TestBox";

// function App() {
//   return (
//     <TestBox />
//   );
// }

// export default App;
