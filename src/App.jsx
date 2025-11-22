// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import WritingCheckPage from "./pages/WritingCheckPage";
import ContextSearchPage from "./pages/ContextSearchPage";
import LoginPage from "./pages/LoginPage";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ExercisesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/saved-lessons" element={<h1 className="p-4">You Lessons Will Appear Here</h1>} />
          <Route path="/writing-check" element={<WritingCheckPage />} />
          <Route path="/context-search" element={<ContextSearchPage />} />
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
