import React, { useState, useEffect } from "react";
import "./NoticeBoard.css";

// Import images from your project folder
import img1 from "../images/img1.jpg";
import img2 from "../images/img2.webp";

const images = [img1, img2];

export default function ImageSliderLocal() {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  // Auto slide every 3 seconds
  useEffect(() => {
    if (length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [length]);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  return (
    <div className="slider-container">
      <div className="slider">
        {images.map((img, index) => (
          <div
            className={index === current ? "slide active" : "slide"}
            key={index}
          >
            {index === current && <img src={img} alt={`Slide ${index}`} />}
          </div>
        ))}

        <button className="prev" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
}
