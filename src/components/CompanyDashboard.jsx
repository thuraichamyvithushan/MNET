import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGlobe,
    faMountain,
    faBolt,
    faLightbulb,
    faMagnet
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebook,
    faInstagram,
    faTiktok,
    faLinkedin,
    faTwitter,
    faYoutube
} from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const CompanyDashboard = () => {
    const companies = [
        {
            id: 1,
            name: "Moto Trekkin",
            icon: faMountain,
            website: "https://www.mototrekkin.com.au/",
            socials: {
                facebook: "https://www.facebook.com/mototrekkin/",
                instagram: "https://www.instagram.com/moto_trekkin_aus/",
                tiktok: "https://www.tiktok.com/@mototrekkin?is_from_webapp=1&sender_device=pc",
                youtube: "https://www.youtube.com/channel/UCe__2WpNr0v_FgmTMq-hvdQ/about?view_as=subscriber"
            },
            image: "/images/moto.png",
            color: "#be9e33ff" 
        },
        {
            id: 2,
            name: "Pink automotive",
            icon: faGlobe,
            website: "https://pinkautomotive.com.au/",
            socials: {
                facebook: "https://www.facebook.com/p/Pink-Automotive-100092975362404/",
                instagram: "https://www.instagram.com/pinkauto_aus/",
                linkedin: "https://www.linkedin.com/company/pink-automotive/",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/pink.png",
            color: "#be9e33ff" 
        },
        {
            id: 3,
            name: "Valley dj",
            icon: faLightbulb,
            website: "https://www.valleydj.com.au/",
            socials: {
                facebook: "https://www.facebook.com/people/Valley-DJ/61551460491896/",
                instagram: "#",
                linkedin: "#",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/vdj.png",
            color: "#be9e33ff" 
        },
       
         {
            id: 4,
            name: "medevac.flights",
            icon: faMagnet,
            website: "https://medevac.flights/",
            socials: {
                facebook: "https://www.facebook.com/Medevac.Flights/",
                instagram: "https://www.instagram.com/medevac.flights/",
                linkedin: "https://www.linkedin.com/company/medevac-flights?originalSubdomain=au",
                twitter: "https://twitter.com/medevacflights",
                youtube: "#"
            },
            image: "/images/mf.png",
            color: "#be9e33ff" 
        }, 
        {
            id: 5,
            name: "Tidy Tactics",
            icon: faMagnet,
            website: "https://tidytactics.au/",
            socials: {
                facebook: "#",
                instagram: "#",
                linkedin: "#",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/tt.png",
            color: "#be9e33ff" 
        },
         {
            id: 6,
            name: "Account Hero",
            icon: faMagnet,
            website: "https://ahero.com.au/",
            socials: {
                facebook: "#",
                instagram: "#",
                linkedin: "#",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/ah.png",
            color: "#be9e33ff" 
        },
        {
            id: 7,
            name: "GS Development Group",
            icon: faMagnet,
            website: "https://www.gsdevelopmentgroup.com/",
            socials: {
                facebook: "https://www.facebook.com/GsDevelopmentGroup",
                instagram: "https://www.instagram.com/gsdevelopmentgroup/",
                linkedin: "#",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/gsdg.png",
            color: "#be9e33ff" 
        },
        {
            id: 8,
            name: "Hunter V twin",
            icon: faMagnet,
            website: "#",
            socials: {
                facebook: "#",
                instagram: "#",
                linkedin: "#",
                twitter: "#",
                youtube: "#"
            },
            image: "/images/uc.jpg",
            color: "#be9e33ff" 
        },

    ];

    return (
        <>
            <style>
                {`
          .company-card {
            background: rgba(20, 20, 20, 0.6); /* Dark glass */
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 24px;
            backdrop-filter: blur(20px);
            transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
            overflow: hidden; /* For clean corners */
            position: relative;
          }
          
          .company-card:hover {
            transform: translateY(-12px) scale(1.02);
            box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
            border-color: rgba(245, 158, 11, 0.6);
            background: rgba(30, 30, 30, 0.8);
          }

          .company-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .company-card:hover::before {
            opacity: 1;
          }

          .social-icon-btn {
            transition: transform 0.2s ease, color 0.2s ease;
          }

          .social-icon-btn:hover {
            transform: scale(1.2);
          }

          .company-grid {
            display: grid;
            grid-template-columns: 2fr;
            gap: 40px;
            width: 100%;
            max-width: 1400px;
            padding: 20px;
          }

          @media (min-width: 768px) {
            .company-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
            </style>

            <div style={{
                minHeight: "100vh",
                maxWidth: "100%",
                background: "linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 50%, #000000 100%)", // Admin Dark Theme
                padding: "120px 20px 40px 20px",
                fontFamily: "'Inter', sans-serif",
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>

                {/* Header */}
                <div style={{
                    textAlign: "center",
                    marginBottom: "60px",
                    animation: "fadeIn 1s ease-out"
                }}>
                    <h1 style={{
                        fontSize: "3rem",
                        fontWeight: "800",
                        fontWeight: "800",
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)", // Gold Gradient
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        marginBottom: "15px",
                        letterSpacing: "-1px"
                    }}>
                        Our Ecosystem
                    </h1>
                    <p style={{
                        color: "#ccc",
                        fontSize: "1.1rem",
                        maxWidth: "600px",
                        margin: "0 auto",
                        lineHeight: "1.6"
                    }}>
                        Explore our integrated network of brands and partners.
                    </p>
                </div>

                {/* Grid Container */}
                <div className="company-grid">
                    {companies.map((company, index) => (
                        <div
                            key={company.id}
                            className="company-card"
                            style={{
                                borderRadius: "24px",
                                padding: "40px 30px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`
                            }}
                        >
                            {/* Image Area with modern styling */}
                            <div style={{
                                width: "100%",
                                height: "100%", // Taller image
                                borderRadius: "16px",
                                overflow: "hidden",
                                marginBottom: "25px",
                                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                                position: "relative"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.2) 0%, transparent 40%)",
                                    zIndex: 1
                                }}></div>
                                <img
                                    src={company.image}
                                    alt={company.name}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        transition: "transform 0.7s ease"
                                    }}
                                    onMouseOver={(e) => e.target.style.transform = "scale(1.15)"}
                                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                                />
                            </div>

                            {/* Company Name */}
                            <h2 style={{
                                fontSize: "1.5rem",
                                fontWeight: "700",
                                color: "#ffffff",
                                marginBottom: "10px"
                            }}>
                                {company.name}
                            </h2>

                            {/* Website Link */}
                            <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    color: "#a0aec0",
                                    textDecoration: "none",
                                    fontSize: "0.95rem",
                                    marginBottom: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    transition: "color 0.2s"
                                }}
                                onMouseOver={(e) => e.target.style.color = company.color}
                                onMouseOut={(e) => e.target.style.color = "#a0aec0"}
                            >
                                Visit Website <FontAwesomeIcon icon={faGlobe} style={{ fontSize: "12px" }} />
                            </a>

                            {/* Social Icons */}
                            <div style={{
                                display: "flex",
                                gap: "20px",
                                marginTop: "auto", // Push to bottom
                                paddingTop: "20px",
                                borderTop: "1px solid rgba(0,0,0,0.05)",
                                width: "100%",
                                justifyContent: "center"
                            }}>
                                {[
                                    { icon: faFacebook, link: company.socials.facebook, color: "#3b5998" },
                                    { icon: faInstagram, link: company.socials.instagram, color: "#e4405f" },
                                    { icon: faLinkedin, link: company.socials.linkedin, color: "#0077b5" },
                                    { icon: faTiktok, link: company.socials.tiktok, color: "#000000ff" },
                                    { icon: faTwitter, link: company.socials.twitter, color: "#1da1f2" },
                                    { icon: faYoutube, link: company.socials.youtube, color: "#ff0000" },
                                ].filter(social => social.link && social.link !== "#" && social.link.trim() !== "").map((social, idx) => (
                                    <a
                                        key={idx}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="social-icon-btn"
                                        style={{ color: "#9ca3af" }} // Default grey
                                        onMouseOver={(e) => e.currentTarget.style.color = social.color}
                                        onMouseOut={(e) => e.currentTarget.style.color = "#9ca3af"}
                                    >
                                        <FontAwesomeIcon icon={social.icon} style={{ fontSize: "20px" }} />
                                    </a>
                                ))}
                            </div>

                        </div>
                    ))}
                </div >

            </div >
            <Footer />
        </>
    );
};

export default CompanyDashboard;
