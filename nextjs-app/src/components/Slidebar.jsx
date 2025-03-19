"use client";
import React, { useEffect, useRef, useState } from 'react';

function Slidebar() {
  const [isHovered, setIsHovered] = useState(false);
  const slideRef = useRef(null);
  
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (slideRef.current) {
      slideRef.current.classList.add('paused');
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (slideRef.current) {
      slideRef.current.classList.remove('paused');
    }
  };

  return (
    <div>
      <section className="slidebar">
        <div className="container2 slidebar-container">
          <div 
            className="slidebar-content" 
            id="slidebar-content"
            ref={slideRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="slidebar-item">
              <img src="/asset/slider-6.webp" alt="anh1"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-7.webp" alt="anh2"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-1.webp" alt="anh3"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-3.webp" alt="anh4"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-2.webp" alt="anh5"/>
            </div>
            {/* Lặp lại các phần tử để tạo hiệu ứng vô hạn */}
            <div className="slidebar-item">
              <img src="/asset/slider-6.webp" alt="anh6"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-7.webp" alt="anh7"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-1.webp" alt="anh8"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-3.webp" alt="anh9"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-2.webp" alt="anh10"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Slidebar;