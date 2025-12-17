import React, { useState } from "react";
import { auth, firestore } from '../firebase';
import { toast } from "react-toastify";
import "./SignUpSignIn.css";
import Loader from "./Loader";

const RegisterForm = ({ onSuccessfulRegistration }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Prevent double toasts
  const [toastShown, setToastShown] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const { password, confirmPassword } = formData;

    // Validation
    if (!name) return toast.error("Please enter your name");
    if (!email) return toast.error("Please enter your email");
    if (!password) return toast.error("Please enter a password");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    const allowed = email.endsWith("@mototrekkin.com.au") || email.endsWith("@gmail.com");
    if (!allowed) return toast.error("Only @mototrekkin.com.au emails allowed");

    try {
      setIsLoading(true);

      // Create user
      const { user } = await auth.createUserWithEmailAndPassword(email, password);

      // Send verification email
      await user.sendEmailVerification();

      // Save user data in Firestore
      await firestore.collection("users").doc(user.uid).set({
        name,
        email,
        role: "user", // Default role for new users
        createdAt: new Date(),
        emailVerified: false,
        isTestAccount: email === "mithushan0099@gmail.com"
      });

      // Success toast (only one)
      toast.success("Account created! Check your email to verify.");

      // Reset form
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

      // Tell parent to switch to Login tab (NO toast here)
      onSuccessfulRegistration();

    } catch (error) {
      console.error("Registration failed:", error);

      if (!toastShown) {
        setToastShown(true);

        if (error.code === "auth/email-already-in-use") {
          toast.error("This email is already registered.");
        } else if (error.code === "auth/weak-password") {
          toast.error("Password is too weak.");
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }

      // Clear sensitive fields
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: '',
        email: '',
      }));

    } finally {
      setIsLoading(false);
      setToastShown(false); // reset duplicate-toast guard
    }
  };

  return (
    <div className="form-containerA sign-up-containerA">
      {isLoading && (
        <div className="loader1-container">
          <Loader />
        </div>
      )}

      <form onSubmit={handleSignUp} className="form1">
        <h2 style={{ fontWeight: "bold", marginBottom: "20px", textAlign: "center" }}>
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="input-common"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="input-common"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-common"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="input-common"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit" className="cmn-btn" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;