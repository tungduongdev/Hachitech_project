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

  // Thiết lập các hàm điều khiển slide
  const scrollLeft = () => {
    if (slideRef.current) {
      slideRef.current.scrollLeft -= 220;
    }
  };

  const scrollRight = () => {
    if (slideRef.current) {
      slideRef.current.scrollLeft += 220;
    }
  };

  return (
    <div>
      <section className="slidebar">
        <div className="container slidebar-container">
          <div 
            className="slidebar-content" 
            id="slidebar-content"
            ref={slideRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="slidebar-item">
              <img src="/asset/slider-6.png" alt="anh1"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-7.png" alt="anh2"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-1.png" alt="anh3"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-3.png" alt="anh4"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-2.png" alt="anh5"/>
            </div>
            {/* Lặp lại các phần tử để tạo hiệu ứng vô hạn */}
            <div className="slidebar-item">
              <img src="/asset/slider-6.png" alt="anh6"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-7.png" alt="anh7"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-1.png" alt="anh8"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-3.png" alt="anh9"/>
            </div>
            <div className="slidebar-item">
              <img src="/asset/slider-2.png" alt="anh10"/>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Slidebar;