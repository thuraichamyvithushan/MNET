
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faUserShield, faUser, faEnvelope, faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

const UserManager = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const snapshot = await firestore.collection("users").orderBy("createdAt", "desc").get();
            const userList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(userList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("Failed to load users.");
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            try {
                // Determine collection based on where user data is stored. 
                // Based on RegisterForm, it is "users" collection.
                await firestore.collection("users").doc(userId).delete();
                toast.success("User deleted successfully.");
                fetchUsers(); // Refresh list
            } catch (error) {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            }
        }
    };

    const handleMakeAdmin = async (userId, currentRole) => {
        if (currentRole === 'admin') {
            toast.info("User is already an admin.");
            return;
        }

        if (window.confirm("Are you sure you want to promote this user to Admin?")) {
            try {
                await firestore.collection("users").doc(userId).update({
                    role: "admin"
                });
                toast.success("User promoted to Admin successfully.");
                fetchUsers(); // Refresh list
            } catch (error) {
                console.error("Error promoting user:", error);
                toast.error("Failed to promote user.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // --- Styles (Black/Gold Palette) ---
    const containerStyle = {
        padding: "20px",
        color: "#fff",
        maxWidth: "100%",
        overflowX: "auto" // Allow table scroll on small screens
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

    // Table Styles
    const tableStyle = {
        width: "100%",
        borderCollapse: "collapse",
        marginTop: "20px",
        background: "#000000",
        border: "1px solid rgba(245, 158, 11, 0.2)",
        borderRadius: "8px", // Note: border-radius on table needs rendering tricks, usually on container
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

    const roleBadgeStyle = (role) => ({
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "0.75rem",
        fontWeight: "bold",
        textTransform: "uppercase",
        background: role === 'admin' ? "linear-gradient(45deg, #f59e0b, #d97706)" : "#333",
        color: role === 'admin' ? "#000" : "#ccc",
        display: "inline-block"
    });

    const btnStyle = (type) => ({
        padding: "8px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "0.85rem",
        marginLeft: "10px",
        transition: "opacity 0.2s",
        background: type === 'delete' ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
        color: type === 'delete' ? "#ef4444" : "#f59e0b",
        border: `1px solid ${type === 'delete' ? "#ef4444" : "#f59e0b"}`
    });

    if (loading) {
        return <div style={{ textAlign: "center", color: "#f59e0b", padding: "50px" }}>Loading users...</div>;
    }

    return (
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h2 style={titleStyle}>User Management</h2>
                <p style={{ color: "#a0aec0" }}>Manage registered users and their roles.</p>
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

            {/* User List (Table View) */}
            {filteredUsers.length === 0 ? (
                <div style={{ textAlign: "center", color: "#a0aec0", marginTop: "50px" }}>No users found.</div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={{ ...thStyle, minWidth: "180px" }}>User</th>
                                <th style={{ ...thStyle, minWidth: "120px" }}>Role</th>
                                <th style={{ ...thStyle, minWidth: "200px" }}>Email</th>
                                <th style={{ ...thStyle, minWidth: "140px" }}>Joined Date</th>
                                <th style={{ ...thStyle, textAlign: "right", minWidth: "200px" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="user-row-hover" style={{ transition: "background 0.2s" }}>
                                    <td style={{ ...tdStyle, minWidth: "180px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{
                                                width: "35px", height: "35px", borderRadius: "50%",
                                                background: "#333", color: "#f59e0b", display: "flex",
                                                alignItems: "center", justifyContent: "center"
                                            }}>
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                            <span style={{ fontWeight: "bold", color: "#fff" }}>{user.name || "Unnamed"}</span>
                                        </div>
                                    </td>
                                    <td style={{ ...tdStyle, minWidth: "120px" }}>
                                        <span style={roleBadgeStyle(user.role)}>
                                            {user.role || "USER"}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, minWidth: "200px" }}>{user.email}</td>
                                    <td style={{ ...tdStyle, minWidth: "140px" }}>
                                        {user.createdAt && user.createdAt.toDate
                                            ? user.createdAt.toDate().toLocaleDateString()
                                            : "N/A"}
                                    </td>
                                    <td style={{ ...tdStyle, textAlign: "right", minWidth: "200px" }}>
                                        {/* Make Admin Button */}
                                        {user.role !== 'admin' && (
                                            <button
                                                style={btnStyle('admin')}
                                                onClick={() => handleMakeAdmin(user.id, user.role)}
                                                title="Promote to Admin"
                                            >
                                                <FontAwesomeIcon icon={faUserShield} /> <span className="btn-text">Promote</span>
                                            </button>
                                        )}

                                        {/* Delete Button */}
                                        <button
                                            style={btnStyle('delete')}
                                            onClick={() => handleDeleteUser(user.id)}
                                            title="Delete User"
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

export default UserManager;
