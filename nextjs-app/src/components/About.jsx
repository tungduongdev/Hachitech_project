import React from 'react'

function About() {
  return (
    <div>
    <section className="about">
      <div className="container">
        <div className="about-content">
          <div className="about-item">
            <img src="/asset/hero-1.jpg" alt="anh1"/>
            <h4>Responsive Design</h4>
            <p>Looks great on desktop, tablet and mobile devices</p>
          </div>
          <div className="about-item">
            <img src="/asset/hero-2.jpg" alt="anh1"/>
            <h4>Easy to Customize</h4>
            <p>Change colors, fonts, background and more</p>
          </div>
          <div className="about-item">
            <img src="/asset/hero-3.jpg" alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="about-item">
            <img src="/asset/hero-4.jpg" alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
        </div>
      </div>
    </section>
  </div>
  )
}

export default About