import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import Loader from './Loader';
import './UserPanel.css'; // We'll create this or reuse admin css
import { useAuth } from '../context/AuthContext';

const UserPanel = () => {
    const [leaves, setLeaves] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (authLoading) return; // Wait for auth to initialize
        if (!user) {
            setDataLoading(false); // No user, stop loading data
            return;
        }

        console.log("Setting up real-time listener for user:", user.uid);

        // Set up real-time listener
        const q = query(collection(firestore, "leaves"), where("userId", "==", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const leavesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            console.log("Leaves updated in real-time:", leavesData.length, "items");
            setLeaves(leavesData);
            setDataLoading(false);
        }, (error) => {
            console.error("Error fetching leaves:", error);
            setDataLoading(false);
        });

        // Cleanup listener on unmount
        return () => {
            console.log("Cleaning up real-time listener");
            unsubscribe();
        };
    }, [user, authLoading]);

    if (authLoading || dataLoading) return <Loader />;

    return (
        <div className="user-panel-container">
            <h2>My Leave Requests</h2>

            {leaves.length === 0 ? (
                <p className="no-leaves-message">No leave requests found.</p>
            ) : (
                <div className="user-panel-table-wrapper">
                    <table className="user-panel-table">
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Type</th>
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.startDate}</td>
                                    <td>{leave.endDate}</td>
                                    <td>{leave.leaveType || "N/A"}</td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <span className={`status-badge ${leave.status === 'Approved' ? 'status-approved' :
                                            (leave.status === 'Rejected' ? 'status-rejected' : 'status-pending')
                                            }`}>
                                            {leave.status}
                                        </span>
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

export default UserPanel;
