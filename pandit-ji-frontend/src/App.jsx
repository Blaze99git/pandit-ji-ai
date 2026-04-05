import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>

      {/* 🔥 MAIN CONTENT */}
      <div className="pb-24"> {/* space for navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>

      {/* 🔥 NAVBAR */}
      <Navbar />

    </Router>
  );
}

export default App;