import React, { useState } from 'react';
import './ReimbursementPopup.css';

const ReimbursementPopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        date: '',
        amount: '',
        description: '',
        department: '',
        notes: ''
    });
    const [receiptFile, setReceiptFile] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setReceiptFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        if (receiptFile) {
            data.append('receipt', receiptFile);
        }

        try {
            const response = await fetch('https://mnet-3c33.vercel.app/send-reimbursement', {
                method: 'POST',
                body: data // 
            });

            if (response.ok) {
                setIsSubmitted(true);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                alert(`Error: ${errorData.error || 'Failed to submit claim'}`);
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
        <div className="reimbursement-popup-overlay" onClick={handleOverlayClick}>
            <div className="reimbursement-popup-content">
                <button className="close-btn" onClick={onClose} aria-label="Close">
                    &times;
                </button>

                {!isSubmitted ? (
                    <>
                        <div className="reimbursement-popup-header">
                            <h2>Reimbursements & Receipts</h2>
                            <p style={{ color: '#888', marginTop: '0.5rem' }}>Submit your expense claim with proof of purchase.</p>
                        </div>

                        <form className="reimbursement-popup-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name *</label>
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
                                <label htmlFor="email">Email Address *</label>
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
                                <label htmlFor="date">Expense Date *</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="amount">Amount ($) *</label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    placeholder="125.50"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Expense Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Items purchased, business purpose..."
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="department">Department / Project</label>
                                <input
                                    type="text"
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    placeholder="Marketing"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="receipt">Receipt Upload *</label>
                                <input
                                    type="file"
                                    id="receipt"
                                    name="receipt"
                                    onChange={handleFileChange}
                                    required
                                    accept="image/*,application/pdf"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="notes">Notes / Comments</label>
                                <input
                                    type="text"
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Additional context..."
                                />
                            </div>

                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Claim'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <span className="success-icon">&#10003;</span>
                        <h3 style={{ color: '#fff' }}>Claim Submitted</h3>
                        <p style={{ color: '#aaa', marginTop: '1rem' }}>
                            Your reimbursement request and receipt have been sent to Admin.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReimbursementPopup;
