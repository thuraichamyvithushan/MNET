import React, { useState } from 'react';
import './LeavePopup.css';

const LeavePopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        leaveDate: '',
        reason: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('https://mnet-3c33.vercel.app/send-leave', {
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
                alert(`Error: ${errorData.error || 'Failed to submit leave request'}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("Could not connect to server. Ensure the backend is running.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="leave-popup-overlay" onClick={handleOverlayClick}>
            <div className="leave-popup-content">
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="leave-popup-header">
                            <h2>Leave Application</h2>
                            <p style={{ color: '#888', marginTop: '0.5rem' }}>Submit your leave request to Admin.</p>
                        </div>

                        <form className="leave-popup-form" onSubmit={handleSubmit}>
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
                                <label htmlFor="leaveDate">Leave Date</label>
                                <input
                                    type="date"
                                    id="leaveDate"
                                    name="leaveDate"
                                    value={formData.leaveDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="reason">Reason / Description</label>
                                <textarea
                                    id="reason"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    placeholder="Feeling unwell, need rest"
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Leave Request'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <span className="success-icon">&#10003;</span>
                        <h3 style={{ color: '#fff' }}>Application Sent</h3>
                        <p style={{ color: '#aaa', marginTop: '1rem' }}>
                            Your leave request has been sent to Admin (MNET).
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeavePopup;
