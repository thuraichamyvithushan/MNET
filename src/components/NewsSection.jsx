
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";

const NewsSection = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const snapshot = await firestore.collection("news").orderBy("date", "desc").limit(5).get();
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

        fetchNews();
    }, []);

    const containerStyle = {
        background: "#000000",
        padding: "60px 20px",
        position: "relative",
        overflow: "hidden"
    };

    const wrapperStyle = {
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 2
    };

    const headerStyle = {
        textAlign: "center",
        marginBottom: "40px"
    };

    const titleStyle = {
        fontSize: "2.5rem",
        fontWeight: "700",
        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        marginBottom: "10px",
        textTransform: "uppercase",
        letterSpacing: "2px"
    };

    const dividerStyle = {
        width: "60px",
        height: "3px",
        background: "linear-gradient(90deg, #f59e0b, #000000)",
        margin: "0 auto"
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px"
    };

    const cardStyle = {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        padding: "25px",
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
        marginBottom: "10px",
        fontWeight: "600",
        letterSpacing: "1px"
    };

    const newsTitleStyle = {
        color: "#fff",
        fontSize: "1.4rem",
        marginBottom: "15px",
        lineHeight: "1.4"
    };

    const contentStyle = {
        color: "#a0aec0",
        fontSize: "1rem",
        lineHeight: "1.6",
        flex: 1
    };

    if (loading) {
        return <div style={{ ...containerStyle, textAlign: "center", color: "#f59e0b" }}>Loading news...</div>;
    }

    if (news.length === 0) {
        return null; // Don't show section if no news
    }

    return (
        <section style={containerStyle}>
            {/* Background Element matching footer style */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "1px",
                background: "linear-gradient(90deg, transparent, #f59e0b, #d97706, #b45309, transparent)",
                opacity: 0.5
            }}></div>

            <div style={wrapperStyle}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>Latest News</h2>
                    <div style={dividerStyle}></div>
                </div>

                <div style={gridStyle}>
                    {news.map(item => (
                        <div
                            key={item.id}
                            style={cardStyle}
                            className="news-card-hover"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.5)";
                                e.currentTarget.style.boxShadow = "0 10px 30px rgba(245, 158, 11, 0.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "none";
                                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.1)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <div style={dateStyle}>{new Date(item.date).toLocaleDateString()}</div>
                            <h3 style={newsTitleStyle}>{item.title}</h3>
                            <p style={contentStyle}>{item.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
