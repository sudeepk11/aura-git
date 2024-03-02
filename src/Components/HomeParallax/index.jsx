import L1Img from "../../Assets/L1.png";
import L2Img from "../../Assets/L2.png";
import L3Img from "../../Assets/L3.png";
import L4Img from "../../Assets/L4.png";
import L5Img from "../../Assets/L5.png";
import BGImg from "../../Assets/BG.png";
import LogoImg from "../../Assets/main_logo.png";
import { Parallax } from "react-scroll-parallax";

function HomeParallax() {
  return (
    <div className="md:hidden relative min-h-screen">
      <img
        src={LogoImg}
        alt=""
        className="absolute left-1/2 -translate-x-1/2 top-10"
      />

      <img src={BGImg} alt="" className="absolute -z-50" />
      <img src={L1Img} alt="" className="absolute bottom-0" />

      <img src={L2Img} alt="" className="absolute -z-10 bottom-0" />

      <Parallax
        translateY={[0, 100]}
        speed={-2}
        className="absolute -z-20 top-32"
      >
        <img src={L3Img} alt="" />
      </Parallax>

      <Parallax translateY={[0, 60]} speed={-2} className="absolute -z-30">
        <img src={L4Img} alt="" />
      </Parallax>

      <Parallax translateY={[0, 80]} speed={-2} className="absolute -z-40">
        <img src={L5Img} alt="" />
      </Parallax>
    </div>
  );
}

export default HomeParallax;
