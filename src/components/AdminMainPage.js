

import AdminDashboard from "./AdminDashboard";
import AdminDashboardnavimg from "./AdminDashboardnavimg"
import AdminNavbar from './AdminNavbar'
import AdminCard from "./AdminCard";
import Footer from "./Footer"



const AdminPage = function () {
    return (
        <div>

            <AdminNavbar />
            <AdminDashboardnavimg />
            <AdminCard />
            <AdminDashboard />
        </div>
    )
}

export default AdminPage;