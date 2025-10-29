import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExercisesPage from "./pages/ExercisesPage";
import ReadingPage from "./pages/ReadingPage";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ExercisesPage />} />
        <Route path="/reading/:id" element={<ReadingPage />} />
        <Route path="/my-lessons" element={<h1 className="p-4">You Lessons Will Appear Here</h1>} />
        
      </Routes>
    </Router>
  );
}

export default App;
