import React from "react";
import { useNavigate } from "react-router-dom";
import { Parallax } from "react-scroll-parallax";

function NavButton({ imgUrl, text, url, index, absolute, centered }) {
  const buttonText = text.toUpperCase();
  const navigate = useNavigate();

  const navigationHandler = (url) => {
    navigate(url);
  };

  return (
    <Parallax
      className={`w-full ${absolute ? "absolute" : "static"} ${
        centered ? "left-1/2 -translate-x-1/2" : ""
      }`}
      translateX={[20, 0]}
      shouldAlwaysCompleteAnimation
      speed={-2}
    >
      {/* <button
        className="w-full bg-black bg-opacity-50 text-white font-semibold text-center p-2 rounded-md"
        onClick={() => navigationHandler(url)}
      >
        {buttonText}
      </button> */}
      <img
        src={imgUrl}
        alt=""
        className="w-full h-20 object-contain cursor-pointer"
        onClick={() => navigationHandler(url)}
      />
    </Parallax>
  );
}

export default NavButton;
