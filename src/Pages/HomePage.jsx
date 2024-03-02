// import { useEffect } from "react";
// import GlobeComponent from "../Components/Globe/Globe";
// import { messageToast } from "../Utils/Toasts/Toasts";
import { Parallax } from "react-scroll-parallax";
import BgImg from "../Assets/layer_1.png";
import Layer21Img from "../Assets/layer_2_1.png";
import Layer22Img from "../Assets/layer_2_2.png";
import Layer31Img from "../Assets/layer_3_1.png";
import Layer32Img from "../Assets/layer_3_2.png";
import MainLogo from "../Assets/main_logo.png";
import HomeParallax from "../Components/HomeParallax";
import one from "../Assets/navbar/1.png";
import two from "../Assets/navbar/2.png";
import three from "../Assets/navbar/3.png";
import four from "../Assets/navbar/4.png";
import five from "../Assets/navbar/5.png";
import six from "../Assets/navbar/6.png";
import seven from "../Assets/navbar/7.png";
import { Link } from "react-router-dom";
import NavButton from "../Components/common/NavButton";
import Schedule from "../Components/Schedule/Schedule";
import EventsPage from "./EventsPage";

const HomePage = () => (
  // useEffect(() => {
  //   messageToast(
  //     "Online Registration will close on 14 March 5:00 PM",
  //     "bottom-left",
  //     5000
  //   );
  //   messageToast(
  //     "No registrations will be accepted if the payment is not completed",
  //     "bottom-left",
  //     5000
  //   );
  // }, []),
  <div>
    <HomeParallax />
    <div className="hidden lg:block relative h-screen overflow-hidden">
      {/* <Map /> */}
      {/* <h1 className="text-3xl font-bold text-center">Home</h1> */}
      {/* <GlobeComponent /> */}

      <img
        src={MainLogo}
        alt=""
        className="h-40 xl:h-96 absolute z-10 -translate-x-1/2 top-10 left-1/2"
        loading="lazy"
      />

      <Parallax
        translateX={[0, -50]}
        shouldAlwaysCompleteAnimation
        className="absolute bottom-4"
      >
        <img
          src={Layer21Img}
          alt=""
          // className="absolute bottom-4"
          loading="lazy"
        />
      </Parallax>

      <Parallax
        translateX={[0, 50]}
        shouldAlwaysCompleteAnimation
        className="absolute -z-10"
      >
        <img
          src={Layer22Img}
          alt=""
          // className="absolute -z-10"
          loading="lazy"
        />
      </Parallax>

      <Parallax
        translateX={[0, -50]}
        shouldAlwaysCompleteAnimation
        className="absolute -z-40 top-28"
      >
        <img
          src={Layer31Img}
          alt=""
          // className="absolute -z-40 top-28"
          loading="lazy"
        />
      </Parallax>

      <Parallax
        translateX={[0, -50]}
        shouldAlwaysCompleteAnimation
        className="absolute -z-50 top-28"
      >
        <img
          src={Layer32Img}
          alt=""
          // className="absolute -z-50 top-28"
          loading="lazy"
        />
      </Parallax>

      <img src={BgImg} alt="" className="absolute bottom-0" loading="lazy" />
    </div>

    <nav className="bg-[#093e34]">
      <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center  p-8 pb-20 gap-y-6 overflow-x-hidden">
        {/* <Link url="/" className="lg:contents hidden">
          <NavButton text="Registration" />
        </Link> */}

        {/* <Link to="/#/login"> */}
        {/* <img src={two} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Register" url="/login" imgUrl={one} />
        {/* </Link> */}

        {/* <Link url="/#/competitions"> */}
        {/* <img src={three} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Competitions" url="/competitions" imgUrl={two} />
        {/* </Link> */}

        {/* <Link url="/#/rule-book"> */}
        {/* <img src={four} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Rulebook" url="/rule-book" imgUrl={three} />
        {/* </Link> */}

        {/* <Link url="/#/schedule"> */}
        {/* <img src={five} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Schedule" url="/schedule" imgUrl={four} />
        {/* </Link> */}

        {/* <Link url="/#/profile"> */}
        {/* <img src={six} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Profile" url="/profile" imgUrl={five} />
        {/* </Link> */}

        {/* <Link url="/#/contact-us"> */}
        {/* <img src={seven} alt="legend" draggable={false} className="my-1" /> */}
        <NavButton text="Contact Us" url="/contact-us" imgUrl={six} />
        {/* </Link> */}

        {/* <Link url="/#/dev-team"> */}
        {/* <img src={eight} alt="legend" draggable={false} className="my-1" /> */}

        {/* </Link> */}
      </div>

      <div className="flex items-center justify-center relative -top-10">
        <NavButton text="Developers" url="/dev-team" imgUrl={seven} />
      </div>
    </nav>

    {/* <Schedule /> */}
    <EventsPage />
  </div>
);
export default HomePage;
