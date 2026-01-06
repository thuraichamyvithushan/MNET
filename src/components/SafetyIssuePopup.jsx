import React, { useState } from 'react';
import './SafetyIssuePopup.css';
import API_BASE_URL from '../config';

const SafetyIssuePopup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        department: '',
        issueType: '',
        date: '',
        time: '',
        location: '',
        title: '',
        description: '',
        severity: 'Low',
        isInjured: false,
        reportedBefore: false,
        immediateAction: false,
        consent: false,
    });

    const [files, setFiles] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const setToggle = (name, val) => {
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const resetForm = () => {
        if (window.confirm("Are you sure you want to clear the form?")) {
            setFormData({
                fullName: '', email: '', phone: '', department: '',
                issueType: '', date: '', time: '', location: '',
                title: '', description: '', severity: 'Low',
                isInjured: false, reportedBefore: false, immediateAction: false,
                consent: false,
            });
            setFiles([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.consent) {
            alert("You must consent to proceed.");
            return;
        }

        setIsSubmitting(true);
        const submissionData = new FormData();
        Object.keys(formData).forEach(key => {
            submissionData.append(key, formData[key]);
        });

        files.forEach(file => {
            submissionData.append('attachments', file);
        });

        // ... inside component ...

        const API_URL = `${API_BASE_URL}/send-safety-report`;
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: submissionData,
            });

            if (response.ok) {
                setIsSuccess(true);
                setTimeout(() => {
                    onClose();
                }, 3000);
            } else {
                const err = await response.json();
                alert("Error submitting report: " + (err.message || "Unknown error"));
            }
        } catch (error) {
            console.error(error);
            alert("Network error: Failed to reach server.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="safety-popup-overlay">
                <div className="safety-popup-content" style={{ height: 'auto', padding: '4rem', textAlign: 'center' }}>
                    <div style={{ color: '#4caf50', fontSize: '4rem', marginBottom: '1rem' }}>&#10003;</div>
                    <h2 style={{ color: '#fff', marginBottom: '0.5rem' }}>Report Submitted</h2>
                    <p style={{ color: '#aaa' }}>Thank you for helping keep our workplace safe.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="safety-popup-overlay">
            <div className="safety-popup-content">
                <div className="safety-popup-header">
                    <h2>
                        <span style={{ fontSize: '1.2em' }}>&#9888;</span>
                        Report Safety Issue
                    </h2>
                    <button className="close-btn-header" onClick={onClose}>&times;</button>
                </div>

                <form className="safety-popup-body" onSubmit={handleSubmit}>


                    <div className="form-section">
                        <span className="section-title">Reporter Details</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Jane Doe" />
                            </div>
                            <div className="form-group">
                                <label>Email Address *</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jane@company.com" />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+1 234 567 890" />
                            </div>
                            <div className="form-group">
                                <label>Department / Location</label>
                                <input name="department" value={formData.department} onChange={handleChange} placeholder="e.g. Warehouse A" />
                            </div>
                        </div>
                    </div>


                    <div className="form-section">
                        <span className="section-title">Issue Information</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Type of Issue</label>
                                <select name="issueType" value={formData.issueType} onChange={handleChange}>
                                    <option value="">Select Type...</option>
                                    <option value="Physical Hazard">Physical Hazard</option>
                                    <option value="Equipment Issue">Equipment Issue</option>
                                    <option value="Fire Risk">Fire Risk</option>
                                    <option value="Electrical Issue">Electrical Issue</option>
                                    <option value="Health Concern">Health Concern</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location of Issue *</label>
                                <input name="location" value={formData.location} onChange={handleChange} required placeholder="Building / Room / Spot" />
                            </div>
                            <div className="form-group">
                                <label>Date of Incident *</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label>Time</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} />
                            </div>
                        </div>
                    </div>


                    <div className="form-section">
                        <span className="section-title">Description</span>
                        <div className="form-group full-width">
                            <label>Brief Title *</label>
                            <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Exposed wiring in hallway" />
                        </div>
                        <div className="form-group full-width">
                            <label>Detailed Description *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} required placeholder="Describe what happened or what you observed..." />
                        </div>
                    </div>


                    <div className="form-section">
                        <span className="section-title">Risk Assessment</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Severity Level</label>
                                <div className="radio-group">
                                    {['Low', 'Medium', 'High', 'Critical'].map(level => (
                                        <label key={level} className={`radio-label ${formData.severity === level ? 'selected' : ''}`}>
                                            <input type="radio" name="severity" value={level} checked={formData.severity === level} onChange={handleChange} style={{ display: 'none' }} />
                                            <span>{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Is anyone injured?</label>
                                <div className="toggle-row">
                                    <span className="toggle-label">Injury Reported</span>
                                    <div className="toggle-switch">
                                        <div className={`toggle-option ${formData.isInjured ? 'active yes' : ''}`} onClick={() => setToggle('isInjured', true)}>Yes</div>
                                        <div className={`toggle-option ${!formData.isInjured ? 'active no' : ''}`} onClick={() => setToggle('isInjured', false)}>No</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="form-section">
                        <span className="section-title">Attachments (Photos/Videos)</span>
                        <div className="form-group full-width">
                            <label className="file-upload-box">
                                <input type="file" multiple accept="image/*,video/*" onChange={handleFileChange} style={{ display: 'none' }} />
                                <div style={{ fontSize: '1.5rem', marginBottom: '10px' }}>&#128247;</div>
                                <div>Click to Upload Photos/Videos</div>
                                {files.length > 0 && (
                                    <div className="selected-files">
                                        {files.length} file(s) selected: {files.map(f => f.name).join(', ')}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>


                    <div className="form-section">
                        <span className="section-title">Action & Consent</span>
                        <div className="form-grid">
                            <div className="form-group">
                                <div className="toggle-row">
                                    <span className="toggle-label">Reported Before?</span>
                                    <div className="toggle-switch">
                                        <div className={`toggle-option ${formData.reportedBefore ? 'active yes' : ''}`} onClick={() => setToggle('reportedBefore', true)}>Yes</div>
                                        <div className={`toggle-option ${!formData.reportedBefore ? 'active no' : ''}`} onClick={() => setToggle('reportedBefore', false)}>No</div>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="toggle-row">
                                    <span className="toggle-label">Immediate Action Needed?</span>
                                    <div className="toggle-switch">
                                        <div className={`toggle-option ${formData.immediateAction ? 'active yes' : ''}`} onClick={() => setToggle('immediateAction', true)}>Yes</div>
                                        <div className={`toggle-option ${!formData.immediateAction ? 'active no' : ''}`} onClick={() => setToggle('immediateAction', false)}>No</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-group full-width" style={{ marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#fff' }}>
                                <input type="checkbox" name="consent" checked={formData.consent} onChange={handleChange} required style={{ width: 'auto' }} />
                                I consent to be contacted for more information regarding this report.
                            </label>
                        </div>
                    </div>


                    <div className="safety-popup-footer">
                        <button type="button" className="btn-reset" onClick={resetForm}>Reset</button>
                        <button type="submit" className="btn-submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Sending...' : 'Submit Safety Report'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default SafetyIssuePopup;
