import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faSave, faEraser } from "@fortawesome/free-solid-svg-icons";

const QuoteManager = () => {
    const [quote, setQuote] = useState("");
    const [author, setAuthor] = useState("");
    const [heading, setHeading] = useState("");
    const [loading, setLoading] = useState(false);
    const [currentQuote, setCurrentQuote] = useState(null);

    useEffect(() => {
        fetchCurrentQuote();
    }, []);

    const fetchCurrentQuote = async () => {
        try {
            const doc = await firestore.collection("dailyQuote").doc("current").get();
            if (doc.exists) {
                const data = doc.data();
                setCurrentQuote(data);
                setQuote(data.text);
                setAuthor(data.author);
                setHeading(data.heading || "");
            }
        } catch (error) {
            console.error("Error fetching quote:", error);
            toast.error("Failed to load current quote");
        }
    };

    const handleSaveQuote = async (e) => {
        e.preventDefault();
        if (!quote.trim()) {
            toast.warning("Quote text cannot be empty");
            return;
        }

        setLoading(true);
        try {
            await firestore.collection("dailyQuote").doc("current").set({
                heading: heading || "Daily Inspiration",
                text: quote,
                author: author || "Unknown",
                updatedAt: new Date(),
            });
            setCurrentQuote({ heading: heading || "Daily Inspiration", text: quote, author: author || "Unknown" });
            toast.success("Daily quote updated successfully!");
        } catch (error) {
            console.error("Error updating quote:", error);
            toast.error("Failed to update quote");
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setQuote("");
        setAuthor("");
        setHeading("");
    };

    return (
        <div className="admin-section-container">
            <div className="section-header">
                <h2><FontAwesomeIcon icon={faQuoteLeft} className="header-icon" /> Daily Quote Management</h2>
                <p>Set a unique quote for the day. This will be displayed on the home page.</p>
            </div>

            <div className="quote-manager-content">
                <div className="current-quote-preview">
                    <h3>Current Active Quote</h3>
                    {currentQuote ? (
                        <div className="quote-card-preview">
                            <h4 style={{ color: '#f59e0b', marginBottom: '5px' }}>{currentQuote.heading || "Daily Inspiration"}</h4>
                            <p className="quote-text">"{currentQuote.text}"</p>
                            <p className="quote-author">- {currentQuote.author}</p>
                        </div>
                    ) : (
                        <p className="no-data">No active quote set.</p>
                    )}
                </div>

                <form onSubmit={handleSaveQuote} className="admin-form">
                    <div className="form-group">
                        <label>Heading (Optional)</label>
                        <input
                            type="text"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            placeholder="e.g. Monday Motivation"
                        />
                    </div>

                    <div className="form-group">
                        <label>Quote Text</label>
                        <textarea
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            placeholder="Enter the daily quote..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Author (Optional)</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. Albert Einstein"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="save-btn" disabled={loading}>
                            <FontAwesomeIcon icon={faSave} /> {loading ? "Saving..." : "Set as Daily Quote"}
                        </button>
                        <button type="button" className="clear-btn" onClick={handleClear} disabled={loading}>
                            <FontAwesomeIcon icon={faEraser} /> Clear Form
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuoteManager;
