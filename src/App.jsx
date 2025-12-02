import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import WritingCheckPage from "./pages/WritingCheckPage";
import ContextSearchPage from "./pages/ContextSearchPage";
import GenerateQuestionsPage from "./pages/GenerateQuestionsPage";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExercisesPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/saved-lessons" element={<h1 className="p-4">You Lessons Will Appear Here</h1>} />
        <Route path="/writing-check" element={<WritingCheckPage />} />
        <Route path="/context-search" element={<ContextSearchPage />} />
        <Route path="/generate-questions" element={<GenerateQuestionsPage/>}/>
      </Routes>
    </Router>
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
