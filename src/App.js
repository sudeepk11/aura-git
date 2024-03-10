import "./App.css";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import api from "./Utils/axios.config";
import { useUser } from "./Contexts/userContext";
import { NavBar } from "./Components/Navbar/NavBar";
import { Footer } from "./Components/Footer/Footer";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthAvailabel } from "./Utils/AuthCheck/AuthCheck";
import HomePage from "./Pages/HomePage";
import EventsPage from "./Pages/EventsPage";
import EventsDetailsPage from "./Pages/EventDetailsPage";
import NotFoundPage from "./Pages/notFoundPage";
import Login from "./Components/Login/Login";
import SignUp from "./Components/Signup/Signup";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import Contact from "./Components/Contact/Contact";
import UserPage from "./Pages/UserPage";
import Rulebook from "./Components/Rulebook/Rulebook";
import Schedule from "./Components/Schedule/Schedule";
import DevTeam from "./Components/DevTeam/DevTeam";
import Changed from "./Components/ForgotPassword/Changed";
import ScrollToTop from "./Components/ScrollToTop/ScrollToTop";
import News from "./Components/News/News";
import "react-toastify/dist/ReactToastify.css";
import { getUserIPInfo } from "./Utils/ip.config";
import { errorToast } from "./Utils/Toasts/Toasts";
import InstituteReg from "./Components/Institute/InstituteRegistration";
import InstitutionReceiptsApproval from "./Components/Admin/InstituteReciepts";
import AdminHomePage from "./Components/Admin/AdminHome";
import CheckInPage from "./Components/Admin/CheckInPage";

function App() {
  const { user, setUser } = useUser();
  const path = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await api
        .get("/auth/user/status")
        .then((res) => {
          if (!res.data.data.authenticated) return setUser(null);
          console.log(res.data);
          setUser(res.data.profile);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [setUser]);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate("admin");
    }
  }, [user]);

  return (
    <div className="App select-none">
      <ScrollToTop />
      {path !== "/" && <NavBar />}
      <section>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="competitions" element={<EventsPage />} />
          <Route
            path="competitions/:club/:title"
            element={<EventsDetailsPage />}
          />
          <Route
            path="login"
            element={
              <AuthAvailabel>
                <Login />
              </AuthAvailabel>
            }
          />
          <Route
            path="signup"
            element={
              <AuthAvailabel>
                <SignUp />
              </AuthAvailabel>
            }
          />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ForgotPassword />} />
          <Route path="contact-us" element={<Contact />} />
          <Route path="profile" element={<UserPage />} />
          <Route path="rule-book" element={<Rulebook />} />
          <Route path="dev-team" element={<DevTeam />} />
          <Route path="verifyPass" element={<Changed />} />
          <Route path="verifyEmail" element={<Changed />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="news" element={<News />} />
          <Route path="admin/check-in" element={<CheckInPage />} />

          {/* <Route path="terms-and-conditions" element={<Policy />} />
          <Route path="privacy-policy" element={<Policy />} />
          <Route path="refund-policy" element={<Policy />} />
          <Route path="about-us" element={<AboutUs />} /> */}

          <Route path="institution-registration" element={<InstituteReg />} />
          <Route path="admin" element={<AdminHomePage />} />
          <Route
            path="admin/institution-reciepts-approval"
            element={<InstitutionReceiptsApproval />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </section>
      {path !== "/" && <Footer />}
      <ToastContainer className="mt-20" />
    </div>
  );
}

export default App;
