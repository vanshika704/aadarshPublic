import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import About from './pages/About';
import Principal from './pages/Principal';
import MissionandVision from './pages/MissionandVision';
import Affiliation from './pages/Affiliation';
import Infrastructure from './pages/Facilities';
import NewsGallery from './pages/NewsEvents';
import Activities from './pages/Activities';
import RulesRegulations from './pages/RulesPolicies';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';



function App() {
  const location = useLocation();

  // Check if we are on the admin login page
  const hideNavbarRoutes = ['/adminLogin'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {/* Only show Navbar if not on admin login */}
      {!shouldHideNavbar && <Navbar />}

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-adarsh" element={<About />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/mission-vision" element={<MissionandVision />} />
          <Route path="/affiliation-info" element={<Affiliation />} />
          <Route path="/facilities" element={<Infrastructure />} />
          <Route path="/news-events" element={<NewsGallery />} />
          <Route path="/activities/:category?" element={<Activities />} />
          <Route path="/rules-regulations" element={<RulesRegulations />} />
          <Route path="/contacts" element={<Contact />} />
          <Route path="/adminLogin" element={<AdminLogin />} />
       
           
        </Routes>

        {/* Hide Footer also on adminLogin (optional) */}
        {!shouldHideNavbar && <Footer />}
      </div>
    </>
  );
}

export default App;
