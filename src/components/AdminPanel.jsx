import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import QuoteManager from "./QuoteManager";
import NewsManager from "./NewsManager";
import UserManager from "./UserManager";
import LeaveManager from "./LeaveManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuoteLeft, faNewspaper, faChartLine, faUsers, faCogs, faArrowLeft, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import "./AdminPanel.css";

const AdminPanel = () => {
    const { user, isAdmin, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");


    if (loading) {
        return <div className="admin-loading">Loading...</div>;
    }


    if (!user || !isAdmin) {
        return <Navigate to="/home" replace />;
    }

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return (
                    <div className="admin-grid">
                        {/* User Management Card */}
                        <div className="admin-card" onClick={() => setActiveTab("users")}>
                            <div className="admin-card-icon">
                                <FontAwesomeIcon icon={faUsers} />
                            </div>
                            <h3>User Management</h3>
                            <p>View and manage all registered users</p>
                            <button className="admin-btn">Manage Users</button>
                        </div>

                        {/* Quote Management Card */}
                        <div className="admin-card" onClick={() => setActiveTab("quotes")}>
                            <div className="admin-card-icon">
                                <FontAwesomeIcon icon={faQuoteLeft} />
                            </div>
                            <h3>Daily Quote</h3>
                            <p>Set a unique quote for the day</p>
                            <button className="admin-btn">Manage Quote</button>
                        </div>

                        {/* News Management Card */}
                        <div className="admin-card" onClick={() => setActiveTab("news")}>
                            <div className="admin-card-icon">
                                <FontAwesomeIcon icon={faNewspaper} />
                            </div>
                            <h3>News Management</h3>
                            <p>Update notices, news, and announcements</p>
                            <button className="admin-btn">Manage News</button>
                        </div>

                        {/* Leave Management Card */}
                        <div className="admin-card" onClick={() => setActiveTab("leaves")}>
                            <div className="admin-card-icon">
                                <FontAwesomeIcon icon={faCalendarCheck} />
                            </div>
                            <h3>Leave Requests</h3>
                            <p>Review and approve staff leave requests</p>
                            <button className="admin-btn">Manage Leaves</button>
                        </div>


                    </div>
                );
            case "quotes":
                return <QuoteManager />;
            case "news":
                return <NewsManager />;
            case "users":
                return <UserManager />;
            case "leaves":
                return <LeaveManager />;
            case "reports":
                return <div className="placeholder-view"><h2>Reports Coming Soon</h2></div>;
            case "settings":
                return <div className="placeholder-view"><h2>Settings Coming Soon</h2></div>;
            default:
                return null;
        }
    };

    return (
        <div className="admin-panel-page">
            <Navbar />
            <div className="admin-panel-container">
                <div className="admin-header">
                    {activeTab !== "dashboard" && (
                        <button className="back-btn" onClick={() => setActiveTab("dashboard")}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </button>
                    )}
                    <h1>Admin Panel</h1>
                    <p>Welcome, {user.name || "Admin"}! Manage your portal from here.</p>
                </div>

                {renderContent()}


            </div>
            <Footer />
        </div>
    );
};

export default AdminPanel;
