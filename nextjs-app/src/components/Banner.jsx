"use client";
import React, { useEffect, useState } from 'react';

function Banner() {
  const words = ['Ecommerce', 'Business', 'Store', 'Shop'];
  const [indexWord, setIndexWord] = useState(0);
  const [isDelete, setIsDelete] = useState(false);
  const [letterIndex, setLetterIndex] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const currentWord = words[indexWord];
    
    const timeout = setTimeout(() => {
      // Nếu đang xoá chữ
      if (isDelete) {
        setText(currentWord.substring(0, letterIndex - 1));
        setLetterIndex(prev => prev - 1);
        
        // Nếu đã xoá hết chữ, chuyển sang chữ tiếp theo
        if (letterIndex <= 1) {
          setIsDelete(false);
          setIndexWord(prev => (prev + 1) % words.length);
        }
      } 
      // Nếu đang gõ chữ
      else {
        setText(currentWord.substring(0, letterIndex + 1));
        setLetterIndex(prev => prev + 1);
        
        // Nếu đã gõ hết chữ, bắt đầu xoá
        if (letterIndex >= currentWord.length) {
          // Dừng lại một chút trước khi bắt đầu xoá
          setTimeout(() => {
            setIsDelete(true);
          }, 1000);
        }
      }
    }, isDelete ? 100 : 200); // Tốc độ xoá nhanh hơn tốc độ gõ
    
    return () => clearTimeout(timeout);
  }, [indexWord, letterIndex, isDelete, words]);

  return (
    <div className="container">
      <section className="main-banner">
        <div className="heading1">
          <h3>
            Bootstrap 4 <br/>E-commerce Template
          </h3>
          <p>
            Alls You Need To Create An <span id="changing-text">{text}</span> Website
          </p>
        </div>
      </section>
    </div>
  );
}

export default Banner;