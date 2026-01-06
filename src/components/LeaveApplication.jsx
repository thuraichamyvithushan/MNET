import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeavePopup from './LeavePopup';
import './LeaveApplication.css';

const LeaveApplication = () => {
    const [showLeavePopup, setShowLeavePopup] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="leave-dashboard-container">
            <h1 className="leave-dashboard-title">Leave Management</h1>
            <p className="leave-dashboard-subtitle">Request leave or view your leave history</p>

            <div className="leave-card-row">
                {/* Tile 1: Request a Leave */}
                <div className="leave-card" onClick={() => setShowLeavePopup(true)}>
                    <div className="leave-card-icon">📝</div>
                    <h3 className="leave-card-title">Request a Leave</h3>
                    <p className="leave-card-description">Submit a new leave request</p>
                </div>

                {/* Tile 2: My Leave Requests */}
                <div className="leave-card" onClick={() => navigate('/user-panel')}>
                    <div className="leave-card-icon">📋</div>
                    <h3 className="leave-card-title">My Leave Requests</h3>
                    <p className="leave-card-description">View your leave request status</p>
                </div>
            </div>

            {/* Leave Request Popup */}
            {showLeavePopup && <LeavePopup onClose={() => setShowLeavePopup(false)} />}
        </div>
    );
};

export default LeaveApplication;
