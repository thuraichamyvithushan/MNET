import React, { useState } from 'react';
import './LeavePopup.css';
import { firestore, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import API_BASE_URL from '../config';

const LeavePopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        startDate: '',
        endDate: '',
        startTime: '',
        endTime: '',
        leaveType: '',
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
            // 1. Save to Firestore
            const user = auth.currentUser;
            if (user) {
                await addDoc(collection(firestore, "leaves"), {
                    userId: user.uid,
                    fullName: formData.fullName,
                    email: formData.email,
                    startDate: formData.startDate,
                    startTime: formData.startTime,
                    endDate: formData.endDate,
                    endTime: formData.endTime,
                    leaveType: formData.leaveType,
                    reason: formData.reason,
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                });
            } else {
                console.warn("No authenticated user found when submitting leave.");
            }

            // 2. Send Email to Admin (Backend)
            const response = await fetch(`${API_BASE_URL}/send-leave`, {
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
                                <label htmlFor="leaveType">Leave Type</label>
                                <select
                                    id="leaveType"
                                    name="leaveType"
                                    value={formData.leaveType}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Select Leave Type</option>
                                    <option value="Annual Leave">Annual Leave</option>
                                    <option value="Parental Leave (Unpaid)">Parental Leave (Unpaid)</option>
                                    <option value="Personal (Sick/Carer’s) Leave">Personal (Sick/Carer’s) Leave</option>
                                    <option value="Carer’s Leave (Unpaid)">Carer’s Leave (Unpaid)</option>
                                    <option value="Compassionate Leave (Unpaid)">Compassionate Leave (Unpaid)</option>
                                    <option value="Community Service Leave">Community Service Leave</option>
                                    <option value="Other Unpaid Leave">Other Unpaid Leave</option>
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="startTime">Start Time</label>
                                    <input
                                        type="time"
                                        id="startTime"
                                        name="startTime"
                                        value={formData.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label htmlFor="endDate">End Date</label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endTime">End Time</label>
                                    <input
                                        type="time"
                                        id="endTime"
                                        name="endTime"
                                        value={formData.endTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
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

                            <p className="leave-note" style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', marginBottom: '1rem' }}>
                                “Within 7 days prior — no active job/leave accumulated and not in breach of employment conditions.”
                            </p>

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
