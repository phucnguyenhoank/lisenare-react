import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExercisesPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/my-lessons" element={<h1 className="p-4">You Lessons Will Appear Here</h1>} />
      </Routes>
    </Router>
  );
}

export default App;

// ------- TESTING ----------
// import TestBox from "./TestBox";


// function App() {
//   return (
//     <TestBox />
//   );
// }

// export default App;
