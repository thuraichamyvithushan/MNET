import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { auth } from "../firebase";
import Loader from "./Loader";
import "./UserDetailsModal.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";

const UserDetailsModal = ({ show, onClose, onEditProfile }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Use the auth context which has properly loaded user data
  const { user } = useAuth();

  const handleEditProfile = () => {
    if (onEditProfile) {
      onEditProfile(); // Call the parent's handler to open EditProfileModal
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      toast.success("Logout successful! See You Again!");
      navigate("/");
    } catch (error) {
      toast.error("Failed to logout. Please try again.");
    }
  };

  // Close modal on outside click
  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  if (!show) return null;

  return (
    <div className="user-details-modal">
      <div className="user-profile-container" ref={modalRef}>
        {loading ? (
          <div style={{ marginTop: "-200px" }}>
            <Loader className="loader" />
          </div>
        ) : user ? (
          <div>
            <img
              src={user.profilePicture || "/images/dp.jpg"}
              alt="Profile"
              className="user-profile-image"
            />
            <div className="user-info">
              <h4 className="user-name">{user.name || "User Name"}</h4>
              <p className="user-email">{user.email || "user@example.com"}</p>
              <hr />
              <div className="user-actions">
                <button className="edit-profile bUtton" onClick={handleEditProfile}>
                  <FontAwesomeIcon icon={faUserEdit} style={{ paddingRight: "5px" }} />
                  Update
                </button>
                <button className="logout bUtton" onClick={handleLogout}>
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ paddingRight: "5px" }} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p>No user logged in</p>
        )}
      </div>
    </div>
  );
};

export default UserDetailsModal;