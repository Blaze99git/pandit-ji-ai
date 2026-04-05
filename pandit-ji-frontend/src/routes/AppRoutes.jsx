import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import KundliForm from "../pages/KundliForm";
import Report from "../pages/Report";
import AskAI from "../pages/AskAI";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kundli" element={<KundliForm />} />
        <Route path="/report/:id" element={<Report />} />
        <Route path="/ask" element={<AskAI />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;