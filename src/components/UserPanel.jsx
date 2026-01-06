import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Loader from './Loader';
import './UserPanel.css'; // We'll create this or reuse admin css
import { useAuth } from '../context/AuthContext';

const UserPanel = () => {
    const [leaves, setLeaves] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        const fetchMyLeaves = async () => {
            if (authLoading) return; // Wait for auth to initialize
            if (!user) {
                setDataLoading(false); // No user, stop loading data
                return;
            }

            try {
                const q = query(collection(firestore, "leaves"), where("userId", "==", user.uid));
                const querySnapshot = await getDocs(q);
                const leavesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setLeaves(leavesData);
            } catch (error) {
                console.error("Error fetching leaves:", error);
            } finally {
                setDataLoading(false);
            }
        };

        fetchMyLeaves();
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
                                <th>Reason</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((leave) => (
                                <tr key={leave.id}>
                                    <td>{leave.startDate}</td>
                                    <td>{leave.endDate}</td>
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
