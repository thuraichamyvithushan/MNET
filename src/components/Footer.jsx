import React from "react";
import "./Footer.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhoneVolume } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faYoutube, faTiktok, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer>
      <div className="content">
        <div className="left box">
          <div className="upper">
            <h2 style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "36px",
              fontWeight: "900",
              background: "linear-gradient(135deg, #f59e0b 0%, #ffd700 25%, #d97706 50%, #b8860b 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              textTransform: "uppercase",
              letterSpacing: "3px",
              margin: "0 0 15px 0",
              filter: "drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3))"
            }}>MNET</h2>
            <div className="topic">About us</div>
            <p>
              MotoTrekkin delivers thrilling motorcycle adventures, expert-guided tours, premium gear, and training, ensuring safe, unforgettable journeys for every rider.   </p>
          </div>

        </div>
        <div className="middle box">
          <div className="topic">Opening hours:</div>
          <div>
            <p >Mon–Fri: 8AM–5PM</p>
          </div>
          <div>
            <p>Sat: 9AM–Noon</p>
          </div>
          <div>
            <p >Sun: Closed</p>
          </div>
        </div>
        <div className="right box">
          <div className="lower">
            <div className="topic">Contact us</div>
            <div className="contact-info">
              <div className="phone">
                <a href="https://wa.me/+61450662270" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faPhoneVolume} style={{ marginRight: "15px" }} /> +61450662270
                </a>
              </div>
              <div className="email">
                <a href="mailto:haris@pinkauto.com.au" target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: "15px" }} />haris@pinkauto.com.au
                </a>
              </div>
            </div>
          </div>
          <div className="media-icons">
            <a target="_blank" href="https://www.facebook.com/mototrekkin/" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            {/* fb link copied for avoid error warning */}
            <a target="_blank" href="https://www.instagram.com/moto_trekkin_aus/" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a target="_blank" href="https://www.tiktok.com/@mototrekkin?is_from_webapp=1&sender_device=pc" rel="noreferrer">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
            <a target="_blank" href="https://www.youtube.com/channel/UCe__2WpNr0v_FgmTMq-hvdQ/about?view_as=subscriber" rel="noreferrer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>

          </div>
        </div>
      </div>
      <hr />
      <div className="bottom">
        <p style={{ textAlign: "center" }}>
          Copyright © 2025 <a target="_blank" href="#" rel="noreferrer">Mototrekkin</a> All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;