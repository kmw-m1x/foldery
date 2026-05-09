import { Routes, Route } from "react-router-dom";
import MainLayout from "./Layout/Mainlayout";
import Home from "./Page/Home";
import About from "./Page/About";
import MissionDashboard from "./Page/MissionDashboard";
import Giving from "./Page/Giving";
import Contact from "./Page/Contact";
import Events from "./Page/Event";
import EventDetail from "./Page/EventDetail";
import MissionDetail from "./Page/MissionDetail";
import ProvinceManager from "./admin/ProvinceManager";
function App() {
  return (
    <Routes>
      {/* Admin — standalone, no Navbar/Footer */}
      <Route path="/admin" element={<ProvinceManager />} />

      {/* Main site */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="mission" element={<MissionDashboard />} />
        <Route path="giving" element={<Giving />} />
        <Route path="contact" element={<Contact />} />
        <Route path="events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/mission/:id" element={<MissionDetail />} />
      </Route>
    </Routes>
  );
}

export default App;