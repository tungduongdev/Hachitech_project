import Image from 'next/image'
import React from 'react'

function MainFeatures() {
  return (
    <section className="main-features">
    <div className="container">
      <div className="features-heading">
        <h3>Features</h3>
        <p>Pack with awesome features,
          <br/>well-coded and easy-to-use user interface.</p>
      </div>
      <div className="features-content">
        
        <div className="features-items">
          <div className="features-item">
            <Image src="/asset/icon-bootstrap.png" width={100} height={100} alt="anh1"/>
            <h4>Bootstrap 5.x</h4>
            <p>Keen to find new projects that use the most popular front-end framework? You've come to the right place!</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-browser.png" width={100} height={100} alt="anh1"/>
            <h4>Easy to Customize</h4>
            <p>Change colors, fonts, background and more</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-custom.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-document.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-font.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-icons.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-perfomance.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-responsive.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-slider.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-support.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-update.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
          <div className="features-item">
            <Image src="/asset/icon-w3c.png" width={100} height={100} alt="anh1"/>
            <h4>Well Documented</h4>
            <p>Step by step guide to help you get started</p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default MainFeatures