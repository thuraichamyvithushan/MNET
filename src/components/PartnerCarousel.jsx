
import React from "react";

const PartnerCarousel = () => {

    const partners = [
        { id: 1, src: "/images/lo1.jpg", alt: "Huntsman" },
        { id: 2, src: "/images/lo2.jpg", alt: "Shopify" },
        { id: 3, src: "/images/lo3.jpg", alt: "Unleashed" },
        { id: 4, src: "/images/lo4.jpg", alt: "B2B Portal" },
        { id: 5, src: "/images/lo5.jpg", alt: "BigCommerce" },
        { id: 6, src: "/images/lo6.jpg", alt: "X" }, // Optional
    ];

    const carouselItems = [...partners, ...partners];

    return (
        <div style={carouselContainerStyle} className="partner-carousel-container">
            <style>
                {`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); } 
                    }
                    .partner-track {
                        display: flex;
                        width: max-content;
                        animation: scroll 20s linear infinite;
                    }
                    .partner-track:hover {
                        animation-play-state: paused;
                    }
                    /* Responsive Margin */
                    .partner-carousel-container {
                        margin-top: 2%;
                    }

                `}
            </style>
         
            <div style={sliderStyle}>
                <div className="partner-track">
                    {carouselItems.map((partner, index) => (
                        <div key={`${partner.id}-${index}`} style={slideStyle}>
                            <img
                                src={partner.src}
                                alt={partner.alt}
                                style={imageStyle}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Styles ---

const carouselContainerStyle = {
    width: "100%",
    background: "transparent",
    // padding: "20px 0",
    // marginTop handled by class .partner-carousel-container
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden"
};

const titleStyle = {
    fontSize: "1rem",
    textTransform: "uppercase",
    letterSpacing: "3px",
    color: "#f59e0b", // Theme color (Gold)
    marginBottom: "20px",
    fontWeight: "700",
    textShadow: "0 1px 2px rgba(0,0,0,0.1)"
};

const sliderStyle = {
    width: "100%",
    maxWidth: "800px", // Limit max width so it doesn't stretch too far on large screens
    overflow: "hidden",
    position: "relative",
    maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
};

const slideStyle = {
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
};

const imageStyle = {
    height: "50px", // Fixed height for consistency
    width: "auto",
    objectFit: "contain",
    // filter: "grayscale(100%) opacity(0.7)", // Removed filter for original colors
    transition: "transform 0.3s ease",
    cursor: "pointer"
};

export default PartnerCarousel;
