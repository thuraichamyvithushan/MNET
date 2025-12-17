import React, { useState } from 'react';
import './ITSupportPopup.css';

const ITSupportPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        email: '',
        description: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://mnet-5wyk.vercel.app//send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsSubmitted(true);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                // Show the actual error from backend to help user debug
                alert(`Error: ${errorData.error || 'Failed to send ticket'}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Could not connect to server. Ensure the backend is running.");
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="it-popup-overlay" onClick={handleOverlayClick}>
            <div className="it-popup-content">
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="it-popup-header">
                            <h2>IT Support Ticket</h2>
                            <p style={{ color: '#888', marginTop: '0.5rem' }}>We're here to help. Describe your issue below.</p>
                        </div>

                        <form className="it-popup-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+61 400 000 000"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Issue Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="What seems to be the problem?"
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Submit Ticket
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <span className="success-icon">&#10003;</span>
                        <h3 style={{ color: '#fff' }}>Ticket Received</h3>
                        <p style={{ color: '#aaa', marginTop: '1rem' }}>
                            We've sent the details to iTek solutions team.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ITSupportPopup;
