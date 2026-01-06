import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { firestore } from "../firebase";
import "./navbar.css";
import { Link } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import EditProfileModal from "./EditProfileModal";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnet,
  faBoltLightning,
  faStream,
  faNewspaper,
  faBinoculars,
  faPersonBiking,
  faCrosshairs,
  faPersonHiking,
  faHouse,
  faChevronDown,
  faChevronUp,
  faUserCircle,
  faTimes,
  faUserShield, // Admin icon
  faUserClock,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const searchBarStyle = {
    position: "absolute",
    top: "50%",
    right: "7%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
  };

  /* MNET Logo Style */
  const mnetLogoStyle = {
    fontFamily: "'Inter', sans-serif",
    fontSize: "28px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #f59e0b 0%, #ffd700 25%, #d97706 50%, #b8860b 100%)",
    backgroundSize: "200% auto",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginLeft: "20px",
    cursor: "pointer",
    filter: "drop-shadow(0 2px 4px rgba(217, 119, 6, 0.3))",
    animation: "shine 3s linear infinite",
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  // Get admin status from auth context
  const { isAdmin, user: authUser } = useAuth();

  // Debug: Log admin status (remove this after debugging)
  console.log("Auth User:", authUser);
  console.log("Is Admin:", isAdmin);
  console.log("User Role:", authUser?.role);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    const fetchUserProfilePicture = async () => {
      if (user) {
        try {
          const userDoc = await firestore.collection("users").doc(user.uid).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setProfilePicture(userData.profilePicture || null);
          }
        } catch (error) {
          console.error("Error fetching user profile picture:", error);
        }
      }
    };

    fetchUserProfilePicture();
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  // Handle opening edit profile modal
  const handleOpenEditProfile = () => {
    setShowModal(false); // Close user details modal
    setShowEditModal(true); // Open edit profile modal
  };

  // Handle closing edit profile modal
  const handleCloseEditProfile = () => {
    setShowEditModal(false);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Single menu button for all devices */}
          <button
            className="menu-button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <i className="bi bi-list menu" style={{ color: "#fff" }}></i>
          </button>

          <div style={searchBarStyle}>
            <li style={{ marginTop: "0px", marginLeft: "20px" }}>
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="user-profile-image"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginBottom: "0",
                  }}
                  onClick={toggleModal}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  style={{ fontSize: "40px", color: "#ffff" }}
                  onClick={toggleModal}
                />
              )}
              {showModal && (
                <UserDetailsModal
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  onEditProfile={handleOpenEditProfile}
                />
              )}
            </li>
          </div>

          {/* Overlay for mobile/tablet */}
          {isSidebarOpen && (
            <div className="sidebar-overlay" onClick={closeSidebar}></div>
          )}

          {/* Sidebar */}
          <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
            {/* Close button inside sidebar */}
            <button
              className="close-btn"
              onClick={closeSidebar}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "24px",
                cursor: "pointer",
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            <Link to="/home" className="menu_links" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faHouse} />
              <span style={{ marginLeft: "10px" }}>Home</span>
            </Link>

            {/* Admin Panel - Only visible to admins */}
            {isAdmin && (
              <Link to="/admin-panel" className="menu_links admin-menu-item" onClick={closeSidebar}>
                <FontAwesomeIcon icon={faUserShield} />
                <span style={{ marginLeft: "10px" }}>Admin Panel</span>
              </Link>
            )}

            <Link to="/news-list" className="menu_links" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faNewspaper} />
              <span style={{ marginLeft: "10px" }}>News & updates</span>
            </Link>
            {!isAdmin && (
              <Link to="/user-panel" className="menu_links" onClick={closeSidebar}>
                <FontAwesomeIcon icon={faUserClock} />
                <span style={{ marginLeft: "10px" }}>User Panel</span>
              </Link>
            )}
            <Link to="/company-dashboard" className="menu_links" onClick={closeSidebar}>
              <FontAwesomeIcon icon={faCrosshairs} />
              <span style={{ marginLeft: "10px" }}> Website & Socials</span>
            </Link>
            <hr style={{ margin: 0, padding: "5px", height: "10px", color: "var(--primary-color)" }}></hr>

            {/* <Link
              className="menu_links"
              onClick={toggleDropdown}
              style={{ display: "flex", alignItems: "center" }}
            >
              <FontAwesomeIcon icon={faStream} />
              <span style={{ marginLeft: "10px" }}>Business Sub-brand</span>
              <FontAwesomeIcon
                icon={isDropdownOpen ? faChevronUp : faChevronDown}
                style={{ marginLeft: "25px", verticalAlign: "middle" }}
              />
            </Link> */}
            {isDropdownOpen && (
              <div className="dropdown-content">
                <Link to="/huntsman-thermo" className="menu_links" onClick={closeSidebar}>
                  <FontAwesomeIcon icon={faBinoculars} />
                  <span style={{ marginLeft: "10px" }}>Huntsman Thermography</span>
                </Link>
                <Link to="/coast-outdoor" className="menu_links" onClick={closeSidebar}>
                  <FontAwesomeIcon icon={faPersonBiking} />
                  <span style={{ marginLeft: "10px" }}>Coast Outdoor</span>
                </Link>
                <Link to="/demo-deals" className="menu_links" onClick={closeSidebar}>
                  <FontAwesomeIcon icon={faPersonHiking} />
                  <span style={{ marginLeft: "10px" }}>Outdoor demo deals</span>
                </Link>
                <Link to="/speros-flashlight" className="menu_links" onClick={closeSidebar}>
                  <FontAwesomeIcon icon={faBoltLightning} />
                  <span style={{ marginLeft: "10px" }}>SperasFlashlights</span>
                </Link>
                <Link to="/magnetech" className="menu_links" onClick={closeSidebar}>
                  <FontAwesomeIcon icon={faMagnet} />
                  <span style={{ marginLeft: "10px" }}>Magne Tech</span>
                </Link>
              </div>
            )}
          </div>

          <Link to="/home" style={{ textDecoration: 'none' }}>
            <span style={mnetLogoStyle} className="mnet-logo">MNET</span>
          </Link>
        </div>
      </nav>

      {/* Edit Profile Modal - rendered outside nav for proper layering */}
      {showEditModal && (
        <EditProfileModal
          show={showEditModal}
          onClose={handleCloseEditProfile}
          onUpdate={() => {
            handleCloseEditProfile();
            // Refresh profile picture if needed
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
