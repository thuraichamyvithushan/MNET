import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { firestore } from "../firebase"; 
import "./navbar.css";
import { Link } from "react-router-dom";
import UserDetailsModal from "./UserDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faUserCircle } from "@fortawesome/free-solid-svg-icons";

const DealerNavbar = () => {
  const searchBarStyle = {
    position: "absolute",
    top: "50%",
    right: "7%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    // marginRight: "-250px",

  };

  const logoStyle = {
    height: "40px",
    marginLeft: "20px",
    marginBottom:"7%",
    marginTop: "4%",
  };

  const [showModal, setShowModal] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

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

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Removed sidebar menu button */}
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
                  style={{ fontSize: "40px", color: "#fff" }}
                  onClick={toggleModal}
                />
              )}
              {showModal && <UserDetailsModal />}
            </li>
          </div>

          <Link to="">
            <img src="./images/logo_02.png" style={logoStyle} alt="logo" />
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default DealerNavbar;