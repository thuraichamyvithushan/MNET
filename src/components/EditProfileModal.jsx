import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { firestore } from '../firebase';
import ResetPasswordModal from "./ResetPasswordModal";
import { auth } from '../firebase';
import './EditProfileModal.css';

const EditProfileModal = ({ show, onClose, onUpdate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleForgotPassword = () => setShowForgotPassword(true);
  const closeForgotPasswordModal = () => setShowForgotPassword(false);

  const handleForgotPasswordSubmit = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      toast.success('Password reset email sent successfully!');
      setShowForgotPassword(false);
    } catch (error) {
      toast.error('Failed to send password reset email.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (user && show) {
        setLoading(true);
        try {
          const userDoc = await firestore.collection('users').doc(user.uid).get();
          if (userDoc.exists) {
            const data = userDoc.data();
            setName(data.name || user.displayName || '');
            setEmail(data.email || user.email || '');
            setProfilePicture(data.profilePicture || '/images/dp.jpg');
          } else {
            // Use Firebase Auth data if no Firestore doc
            setName(user.displayName || user.email?.split('@')[0] || '');
            setEmail(user.email || '');
            setProfilePicture('/images/dp.jpg');
          }
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          toast.error('Failed to fetch user data.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [show]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePicture(e.target.files[0]);
      setProfilePicture(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDeleteProfilePicture = async () => {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    if (!user) return;
    setLoading(true);
    try {
      const defaultPic = '/images/dp.jpg';
      setProfilePicture(defaultPic);
      await firestore.collection('users').doc(user.uid).update({ profilePicture: defaultPic });
      toast.success('Profile picture removed!');
    } catch (err) {
      console.error('Failed to delete profile picture:', err);
      toast.error('Failed to delete profile picture.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let profilePicURL = profilePicture;
      const authInstance = getAuth();
      const user = authInstance.currentUser;
      if (!user) throw new Error('User not authenticated');

      if (newProfilePicture) {
        const storage = getStorage();
        const storageRef = ref(storage, `profilePictures/${user.uid}/${newProfilePicture.name}`);
        await uploadBytes(storageRef, newProfilePicture);
        profilePicURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, { displayName: name, photoURL: profilePicURL });
      await firestore.collection('users').doc(user.uid).update({
        name,
        profilePicture: profilePicURL
      });

      if (onUpdate) {
        onUpdate({ name, email, profilePicture: profilePicURL });
      }
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="edit-profile-overlay">
      <div className="edit-profile-content">
        <form onSubmit={handleSubmit}>
          {/* Close Icon */}
          <div className="edit-profile-header">
            <h2>Edit Profile</h2>
            <FontAwesomeIcon
              icon={faTimes}
              className="close-icon"
              onClick={onClose}
            />
          </div>

          {loading ? (
            <div className="loading-container">
              <p>Loading...</p>
            </div>
          ) : (
            <>
              {/* Profile Picture */}
              <div className="profile-picture-section">
                <img
                  src={profilePicture || '/images/dp.jpg'}
                  alt="Profile"
                  className="edit-profile-image"
                />
                <div className="picture-actions">
                  <button
                    type="button"
                    className="icon-btn edit-btn"
                    onClick={() => document.getElementById('file-input').click()}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn delete-btn"
                    onClick={handleDeleteProfilePicture}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>

              {/* Name Input */}
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your name"
                />
              </div>

              {/* Email Input */}
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="disabled-input"
                />
              </div>

              {/* Change Password */}
              <button
                type="button"
                onClick={handleForgotPassword}
                className="change-password-btn"
              >
                Change Password
              </button>

              {/* Save / Cancel Buttons */}
              <div className="action-buttons">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </form>

        <ResetPasswordModal
          isOpen={showForgotPassword}
          onClose={closeForgotPasswordModal}
          onSubmit={handleForgotPasswordSubmit}
          email={email}
          handleEmailChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </div>
  );
};

export default EditProfileModal;
