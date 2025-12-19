import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faNewspaper, faClock, faCloudSun, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [dailyQuote, setDailyQuote] = useState(null);
  const [latestNews, setLatestNews] = useState(null);
  const [loadingNews, setLoadingNews] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Fetch Daily Quote
    const fetchQuote = async () => {
      try {
        const doc = await firestore.collection("dailyQuote").doc("current").get();
        if (doc.exists) setDailyQuote(doc.data());
      } catch (error) {
        console.error("Error fetching daily quote:", error);
      }
    };

    // Fetch Latest News
    const fetchNews = async () => {
      try {
        const snapshot = await firestore.collection("news")
          .orderBy("createdAt", "desc")
          .limit(1)
          .get();
        if (!snapshot.empty) {
          setLatestNews(snapshot.docs[0].data());
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoadingNews(false);
      }
    };

    // Fetch Weather
 const fetchWeather = async () => {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-32.7833&longitude=151.6417&current_weather=true"
    );
    const data = await response.json();
    setWeather(data.current_weather);
  } catch (error) {
    console.error("Error fetching weather:", error);
  }
};
    // 
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    fetchQuote();
    fetchNews();
    fetchWeather();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(timer);
    };
  }, []);


  const getMainFontSize = () => {
    if (windowWidth < 480) return "32px";
    if (windowWidth < 768) return "45px";
    if (windowWidth < 1024) return "55px";
    return "65px";
  };

  const getGreetingFontSize = () => {
    if (windowWidth < 480) return "14px";
    if (windowWidth < 768) return "16px";
    if (windowWidth < 1024) return "18px";
    return "20px";
  };

  const getContainerHeight = () => {

    if (windowWidth < 768) return "110vh";
    return "85vh";
  };

  const containerStyle = {
    position: "relative",
    width: "100%",
    minHeight: "85vh", // Use minHeight instead of fixed height
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "2%",
    paddingBottom: "40px" // Ensure space at bottom
  }


  // const backgroundStyle = {
  //   position: "absolute",
  //   top: 0,
  //   left: 0,
  //   width: "100%",
  //   height: "100%",
  //   background: "linear-gradient(135deg, #070f1e 0%, #0b1b3a 50%, #020617 100%)",

  //   zIndex: 1,
  // };


  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: `
      radial-gradient(circle at 20% 30%, rgba(1, 1, 1, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(217, 119, 6, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, 
        rgba(0, 0, 0, 1) 0%, 
        rgba(0, 0, 0, 1) 100%
      )
    `,
    zIndex: 1,
  };
  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.3) contrast(1.2)",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "transparent",
    zIndex: 2,
  };

  const contentContainerStyle = {
    position: "relative",
    zIndex: 10,
    width: "100%",
    maxWidth: "1200px",
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%", // Take full height
    paddingTop: "100px", // Push title down a bit
    paddingBottom: "40px" // Space for cards
  };

  const textSectionStyle = {
    textAlign: "center",
    marginBottom: "40px",
    flex: "0 0 auto"
  };

  const greetingStyle = {
    fontFamily: "'Inter', 'Work Sans', sans-serif",
    fontSize: getGreetingFontSize(),
    fontWeight: 300,
    color: "#f59e0b",
    margin: "0 0 15px 0",
    letterSpacing: "4px",
    textTransform: "uppercase",
    opacity: 0.95,
    textShadow: "0 0 20px rgba(245, 158, 11, 0.5), 0 2px 4px rgba(90, 77, 0, 0.8)",
    animation: "fadeInDown 1s ease-out 0.3s both",
  };

  const titleStyle = {
    margin: 0,
    padding: 0,
    lineHeight: 1.1,
  };

  // Dark and amber/orange gradient for text
  const darkGoldGradient = `
    linear-gradient(
      45deg,
      #f59e0b 0%,
      #ed9a00ff 25%,
      #1a1a1a 45%,
      #f59e0b 55%,
      #d97706 75%,
      #f59e0b 100%
    )
  `;

  const fancyStyle = {
    fontFamily: "'Inter', 'Work Sans', sans-serif",
    fontSize: getMainFontSize(),
    fontWeight: 900,
    background: darkGoldGradient,
    backgroundSize: "300% 300%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textTransform: "uppercase",
    letterSpacing: windowWidth < 768 ? "2px" : "4px",
    animation: "gradientFlow 3s ease-in-out infinite, scaleUp 0.8s ease-out 0.6s both",
  };

  const accentLineStyle = {
    width: windowWidth < 768 ? "50px" : "80px",
    height: "3px",
    background: "linear-gradient(90deg, #f59e0b, #d97706)",
    margin: "20px auto 0",
    borderRadius: "2px",
    animation: "expandWidth 1s ease-out 0.9s both",
    boxShadow: "0 0 15px rgba(245, 158, 11, 0.6)",
  };

  // --- Cards Styling ---
  const cardsContainerStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    width: "100%",
    marginTop: "auto", // Push to bottom
    animation: "fadeInUp 1s ease-out 0.8s both",
  };

  const getCardWidth = () => {
    if (windowWidth < 600) return "100%"; // Mobile: 1 per row
    if (windowWidth < 1024) return "calc(50% - 20px)"; // Tablet: 2 per row
    return "calc(50% - 20px)"; // Desktop: 3 per row for first 3, then 2 per row
  };

  const cardStyle = {
    background: "rgba(255, 255, 255, 0)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(214, 136, 0, 0.68)",
    borderRadius: "15px",
    padding: "25px", // Increased padding
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    transition: "transform 0.3s ease",
    minHeight: "180px", // Increased from 160px
    justifyContent: "center",
    width: getCardWidth(),
    boxSizing: "border-box"
  };

  const cardIconStyle = {
    fontSize: "24px",
    color: "#f59e0b",
    marginBottom: "10px"
  };

  const cardTitleStyle = {
    fontSize: "14px",
    color: "#ffffffff",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "5px"
  };

  const cardTitleStyle2 = {
  fontSize: "12px",
  color: "#ffffffff",
  fontWeight: "400", // removes bold
  letterSpacing: "1px",
};


  const cardContentStyle = {
    fontSize: "16px",
    fontWeight: "600",
    lineHeight: "1.4"
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 0.95; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleUp {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes gradientFlow {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes expandWidth {
            from { width: 0; opacity: 0; }
            to { width: ${windowWidth < 768 ? "50px" : "80px"}; opacity: 1; }
          }
          .hero-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 0, 0, 0) !important;
  border-color: #f59e0b !important;
  box-shadow:
    0 6px 15px rgba(245, 158, 11, 0.22),
    0 0 10px rgba(245, 158, 11, 0.15);
}
          /* Disable animations for users who prefer reduced motion */
          @media (prefers-reduced-motion: reduce) {
            * {
              animation: none !important;
              transition: none !important;
            }
          }

          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .hero-fancy-text {
              background: #f59e0b !important;
              -webkit-background-clip: text !important;
              background-clip: text !important;
            }
            .hero-card:hover {
               border-color: #f59e0b !important;
            }
          }
        `}
      </style>

      <div style={containerStyle}>
        {/* Background Layer */}
        <div style={backgroundStyle}>
          <div style={overlayStyle}></div>
        </div>

        {/* Content Layer */}
        <div style={contentContainerStyle}>

          {/* Main Headings (Old Style) */}
          <div style={textSectionStyle}>
            <p style={greetingStyle}>Welcome To </p>
            <div style={titleStyle}>
              <span style={fancyStyle} className="hero-fancy-text">
                MNET
              </span>
            </div>
            <div style={accentLineStyle}></div>
          </div>

          {/* 4 Info Cards Row */}
          <div style={cardsContainerStyle}>
            {/* Card 1: Daily Quote */}
            <div style={cardStyle} className="hero-card">
              <div style={cardIconStyle}><FontAwesomeIcon icon={faQuoteLeft} /></div>
              <div style={cardTitleStyle}>Daily Inspiration</div>
              <div style={{ ...cardContentStyle, fontStyle: "italic", fontSize: "14px" }}>
                "{dailyQuote ? dailyQuote.text.substring(0, 60) + (dailyQuote.text.length > 60 ? "..." : "") : "Start your day with positivity."}"
              </div>
            </div>

            {/* Card 2: Latest News */}
            <div
              style={{ ...cardStyle, cursor: "pointer" }}
              className="hero-card"
              onClick={() => navigate('/news-list')}
            >
              <div style={cardIconStyle}><FontAwesomeIcon icon={faNewspaper} /></div>
              <div style={cardTitleStyle}>Latest Update</div>
              <div style={{ ...cardContentStyle }}>
                   {loadingNews ? (
                      ""
                      ) : latestNews ? (
                   <>
                       <h4 style={{ fontSize: "16px", marginBottom: "6px" }}>
                      {latestNews.title}
                      </h4>
                     <div style={cardTitleStyle2}>
                      {latestNews.content}
                      </div>
                       </>
                  ) : (
                 "No recent updates."
                   )}
               </div>

            </div>

             {/* Card 3: Calendar */}
            {/* <div
              style={{ ...cardStyle, cursor: "pointer", width: windowWidth >= 1024 ? "calc(30% - 20px)" : getCardWidth() }}
              className="hero-card"
              onClick={() => navigate('/calendar')}
            >
              <div style={cardIconStyle}><FontAwesomeIcon icon={faCalendarAlt} /></div>
              <div style={cardTitleStyle}>Calendar</div>
              <div style={{ ...cardContentStyle, fontSize: "18px" }}>
                View Events
              </div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                Manage Schedule
              </div>
            </div> */}

            {/* Card 4: Time */}
            <div style={cardStyle} className="hero-card">
              <div style={cardIconStyle}><FontAwesomeIcon icon={faClock} /></div>
              <div style={cardTitleStyle}>Thornton NSW Time</div>
              <div style={{ ...cardContentStyle, fontSize: "24px", color: "#f59e0b" }}>
                {currentTime.toLocaleTimeString('en-AU', {
                  timeZone: 'Australia/Sydney',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                {currentTime.toLocaleDateString('en-AU', {
                  timeZone: 'Australia/Sydney',
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>

            {/* Card 5: Weather Australia */}
            <div style={cardStyle} className="hero-card">     
            <div style={cardIconStyle}><FontAwesomeIcon icon={faCloudSun} /></div>
              <div style={cardTitleStyle}>Weather (Thornton NSW)</div>
              <div style={{ ...cardContentStyle, fontSize: "24px", color: "#f59e0b" }}>
                {weather ? `${weather.temperature}°C` : "--°C"}
              </div>
              <div style={{ fontSize: "12px", color: "#ccc" }}>
                Australia
              </div>
            </div>

           
          </div>

        </div>
      </div>
    </>
  );
};

export default Hero;