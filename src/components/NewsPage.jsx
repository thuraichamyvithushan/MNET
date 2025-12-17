
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import Navbar from "./navbar";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllNews = async () => {
            try {
                // Fetch ALL news items, ordered by date
                const snapshot = await firestore.collection("news").orderBy("createdAt", "desc").get();
                const newsList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setNews(newsList);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching news:", error);
                setLoading(false);
            }
        };

        fetchAllNews();
    }, []);

    const pageStyle = {
        background: "#000000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
    };

    const containerStyle = {
        flex: 1,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "120px 20px 60px", // Top padding for fixed navbar
        position: "relative"
    };

    const headerStyle = {
        textAlign: "center",
        marginBottom: "60px"
    };

    const titleStyle = {
        fontSize: "3rem",
        fontWeight: "800",
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        marginBottom: "15px",
        textTransform: "uppercase",
        letterSpacing: "3px"
    };

    const subtitleStyle = {
        color: "#a0aec0",
        fontSize: "1.1rem",
        maxWidth: "600px",
        margin: "0 auto"
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "30px"
    };

    const cardStyle = {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "20px",
        padding: "30px",
        border: "1px solid rgba(245, 158, 11, 0.1)",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: "100%"
    };

    const dateStyle = {
        color: "#f59e0b",
        fontSize: "0.9rem",
        marginBottom: "15px",
        fontWeight: "600",
        letterSpacing: "1px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    };

    const newsTitleStyle = {
        color: "#fff",
        fontSize: "1.5rem",
        marginBottom: "20px",
        lineHeight: "1.3",
        fontWeight: "700"
    };

    const contentStyle = {
        color: "#cbd5e0",
        fontSize: "1rem",
        lineHeight: "1.7",
        flex: 1,
        whiteSpace: "pre-line" // Preserve paragraph breaks
    };

    // Animation styles
    const fadeAnimation = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    return (
        <div style={pageStyle}>
            {/* Inject Animation Styles */}
            <style>{fadeAnimation}</style>

            {/* Add placeholder for Navbar - simpler than importing the complex one if it needs auth logic context */}
            {/* Actually we should use the main Navbar if possible, wrapped in MainPage logic. 
                But for now, sticking to clean page structure. 
                Since this is a Route inside App.js, the main <Navbar/> from the layout will likely show if we nest it properly.
                However, looking at App.js, Navbar is rendered in the Layout wrapper. 
                So we DON'T need to render Navbar here if we put this route inside the PrivateRoute wrapper!
            */}

            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Company News</h1>
                    <p style={subtitleStyle}>Stay updated with the latest announcements and events.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: "center", color: "#f59e0b", fontSize: "1.2rem" }}>Loading updates...</div>
                ) : news.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#a0aec0", padding: "50px" }}>No news items found.</div>
                ) : (
                    <div style={gridStyle}>
                        {news.map((item, index) => (
                            <div
                                key={item.id}
                                style={{
                                    ...cardStyle,
                                    animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-10px)";
                                    e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.4)";
                                    e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 0, 0, 0.5)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "none";
                                    e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.1)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div style={dateStyle}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString() : 'Date N/A'}
                                </div>
                                <h2 style={newsTitleStyle}>{item.title}</h2>
                                <p style={contentStyle}>{item.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default NewsPage;
