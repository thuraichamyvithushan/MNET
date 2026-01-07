import React, { useEffect, useState } from "react";
import { firestore } from "../firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faSearch, faClock, faCalendarDay, faTimes } from "@fortawesome/free-solid-svg-icons";
import { doc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import API_BASE_URL from '../config';

const LeaveManager = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const leavesSnapshot = await getDocs(collection(firestore, "leaves"));
            const leavesData = leavesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLeaves(leavesData);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching leaves:", error);
            toast.error("Failed to load leave requests.");
            setLoading(false);
        }
    };

    const approveLeave = async (leave) => {
        if (!window.confirm(`Approve leave for ${leave.fullName}?`)) return;
        try {
            const leaveRef = doc(firestore, "leaves", leave.id);
            await updateDoc(leaveRef, { status: "Approved" });

            await fetch(`${API_BASE_URL}/send-leave-approval`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leave)
            });

            toast.success("Leave approved and email sent!");
            setLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: "Approved" } : l));
        } catch (error) {
            console.error("Error approving leave:", error);
            toast.error("Failed to approve leave.");
        }
    };

    const rejectLeave = async (leave) => {
        if (!window.confirm(`Reject leave request for ${leave.fullName}?`)) return;
        try {
            const leaveRef = doc(firestore, "leaves", leave.id);
            await updateDoc(leaveRef, { status: "Rejected" });

            await fetch(`${API_BASE_URL}/send-leave-rejection`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(leave)
            });

            toast.success("Leave rejected and email sent!");
            setLeaves(prev => prev.map(l => l.id === leave.id ? { ...l, status: "Rejected" } : l));
        } catch (error) {
            console.error("Error rejecting leave:", error);
            toast.error("Failed to reject leave.");
        }
    };

    const deleteLeave = async (leaveId) => {
        if (!window.confirm("Delete this leave request?")) return;
        try {
            await deleteDoc(doc(firestore, "leaves", leaveId));
            setLeaves(prev => prev.filter(l => l.id !== leaveId));
            toast.success("Leave request deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete leave request");
        }
    };

    const filteredLeaves = leaves.filter(leave =>
        (leave.fullName && leave.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (leave.email && leave.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );


    const containerStyle = {
        padding: "20px",
        color: "#fff",
        maxWidth: "100%",
        overflowX: "auto"
    };

    const headerStyle = {
        marginBottom: "30px",
        textAlign: "center"
    };

    const titleStyle = {
        fontSize: "2rem",
        color: "#f59e0b",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "10px"
    };

    const searchContainerStyle = {
        marginBottom: "30px",
        display: "flex",
        justifyContent: "center"
    };

    const searchInputStyle = {
        padding: "12px 20px",
        borderRadius: "30px",
        border: "1px solid #f59e0b",
        background: "rgba(0, 0, 0, 0.5)",
        color: "#fff",
        width: "100%",
        maxWidth: "500px",
        outline: "none",
        fontSize: "1rem"
    };

    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        background: "#000000",
        border: "1px solid rgba(245, 158, 11, 0.2)",
        borderRadius: "8px",
        overflow: "hidden"
    };

    const thStyle = {
        background: "linear-gradient(90deg, #1a1a1a, #000)",
        color: "#f59e0b",
        padding: "15px",
        textAlign: "left",
        fontWeight: "bold",
        textTransform: "uppercase",
        fontSize: "0.9rem",
        borderBottom: "2px solid #f59e0b",
        minWidth: "150px",
        whiteSpace: "nowrap"
    };

    const tdStyle = {
        padding: "15px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        color: "#cbd5e0",
        verticalAlign: "middle",
        minWidth: "150px"
    };

    const statusBadgeStyle = (status) => {
        let bgColor, textColor, borderColor;

        if (status === 'Approved') {
            bgColor = "rgba(34, 197, 94, 0.2)";
            textColor = "#4ade80";
            borderColor = "#4ade80";
        } else if (status === 'Rejected') {
            bgColor = "rgba(239, 68, 68, 0.2)";
            textColor = "#ef4444";
            borderColor = "#ef4444";
        } else {
            bgColor = "rgba(234, 179, 8, 0.2)";
            textColor = "#facc15";
            borderColor = "#facc15";
        }

        return {
            padding: "4px 10px",
            borderRadius: "12px",
            fontSize: "0.75rem",
            fontWeight: "bold",
            textTransform: "uppercase",
            background: bgColor,
            color: textColor,
            border: `1px solid ${borderColor}`,
            display: "inline-block"
        };
    };

    const btnStyle = (type) => {
        let bgColor, textColor, borderColor;

        if (type === 'delete') {
            bgColor = "rgba(239, 68, 68, 0.2)";
            textColor = "#ef4444";
            borderColor = "#ef4444";
        } else if (type === 'approve') {
            bgColor = "rgba(34, 197, 94, 0.2)";
            textColor = "#4ade80";
            borderColor = "#4ade80";
        } else if (type === 'reject') {
            bgColor = "rgba(251, 146, 60, 0.2)";
            textColor = "#fb923c";
            borderColor = "#fb923c";
        }

        return {
            padding: "8px 12px",
            border: `1px solid ${borderColor}`,
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.85rem",
            marginLeft: "15px",
            marginBottom:"10px",
            transition: "all 0.2s",
            background: bgColor,
            color: textColor
        };
    };

    if (loading) {
        return <div style={{ textAlign: "center", color: "#f59e0b", padding: "50px" }}>Loading leave requests...</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>Leave Management</h2>
                <p style={{ color: "#a0aec0" }}>Review and approve staff leave requests.</p>
            </div>

            {/* Search Bar */}
            <div style={searchContainerStyle}>
                <div style={{ position: "relative", width: "100%", maxWidth: "500px" }}>
                    <FontAwesomeIcon icon={faSearch} style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)", color: "#f59e0b" }} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        style={{ ...searchInputStyle, paddingLeft: "45px" }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Leave List (Table View) */}
            {filteredLeaves.length === 0 ? (
                <div style={{ textAlign: "center", color: "#a0aec0", marginTop: "50px" }}>No leave requests found.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, minWidth: "180px" }}>Employee</th>
                                <th style={{ ...thStyle, minWidth: "200px" }}>Date & Time</th>
                                <th style={{ ...thStyle, minWidth: "250px" }}>Reason</th>
                                <th style={{ ...thStyle, minWidth: "120px" }}>Status</th>
                                <th style={{ ...thStyle, textAlign: "right", minWidth: "200px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeaves.map(leave => (
                                <tr key={leave.id} style={{ transition: "background 0.2s" }}>
                                    <td style={{ ...tdStyle, minWidth: "180px" }}>
                                        <div style={{ fontWeight: "bold", color: "#fff" }}>{leave.fullName || "Unnamed"}</div>
                                        <div style={{ fontSize: "0.8rem", color: "#888" }}>{leave.email}</div>
                                    </td>
                                    <td style={{ ...tdStyle, minWidth: "200px" }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            <FontAwesomeIcon icon={faCalendarDay} style={{ color: '#f59e0b' }} />
                                            {leave.startDate} to {leave.endDate}
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px', fontSize: '0.85rem' }}>
                                            <FontAwesomeIcon icon={faClock} style={{ color: '#888' }} />
                                            {leave.startTime} - {leave.endTime}
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, minWidth: '250px', maxWidth: '300px' }}>
                                        {leave.reason}
                                    </td>
                                    <td style={{ ...tdStyle, minWidth: "120px" }}>
                                        <span style={statusBadgeStyle(leave.status)}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: "right", minWidth: "200px" }}>
                                        {/* Approve Button */}
                                        {leave.status !== 'Approved' && (
                                            <button
                                                style={btnStyle('approve')}
                                                onClick={() => approveLeave(leave)}
                                                title="Approve Leave"
                                            >
                                                <FontAwesomeIcon icon={faCheck} /> <span className="btn-text">Approve</span>
                                            </button>
                                        )}

                                        {/* Reject Button */}
                                        {leave.status !== 'Rejected' && (
                                            <button
                                                style={btnStyle('reject')}
                                                onClick={() => rejectLeave(leave)}
                                                title="Reject Leave"
                                            >
                                                <FontAwesomeIcon icon={faTimes} /> <span className="btn-text">Reject</span>
                                            </button>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            style={btnStyle('delete')}
                                            onClick={() => deleteLeave(leave.id)}
                                            title="Delete Request"
                                        >
                                            <FontAwesomeIcon icon={faTrash} /> <span className="btn-text">Delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LeaveManager;
