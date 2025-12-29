import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordModal from "./ResetPasswordModal";
import PartnerCarousel from "./PartnerCarousel";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../firebase";
import "./SignUpSignIn.css";

const SignInSignUpForm = () => {
  const [isSignUp, setIsSignUp] = useState(false); // desktop toggle
  const [showRegisterMobile, setShowRegisterMobile] = useState(false); // mobile toggle
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");

  // Handle successful registration (NO toast here)
  const handleSuccessfulRegistration = () => {
    setIsSignUp(false);
    setShowRegisterMobile(false);
  };

  const handleForgotPassword = () => {
    setEmail("");
    setShowForgotPassword(true);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
  };

  const handleForgotPasswordSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email syntax");
      setEmail("");
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      toast.success("Password reset email sent successfully!");
      setShowForgotPassword(false);
      setIsSignUp(false); // Switch to Login view on desktop
      setShowRegisterMobile(false); // Switch to Login view on mobile
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email.");
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div style={bodyStyle}>

      {/* Mobile View */}
      <div className="mobile-auth">
        {!showRegisterMobile ? (
          <div className="mobile-form">
            <LoginForm onForgotPassword={handleForgotPassword} />
            <p className="switch-text">
              Don’t have an account?{" "}
              <button
                className="link-btn"
                onClick={() => setShowRegisterMobile(true)}
              >
                Register
              </button>
            </p>
          </div>
        ) : (
          <div className="mobile-form">
            <RegisterForm onSuccessfulRegistration={handleSuccessfulRegistration} />
            <p className="switch-text">
              Already have an account?{" "}
              <button
                className="link-btn"
                onClick={() => setShowRegisterMobile(false)}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Desktop Overlay */}
      <div
        className={`containerA ${isSignUp ? "right-panel-active" : ""}`}
        id="containerA"
      >
        {isSignUp ? (
          <RegisterForm onSuccessfulRegistration={handleSuccessfulRegistration} />
        ) : (
          <LoginForm onForgotPassword={handleForgotPassword} />
        )}

        <div className="overlay-containerA">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1 className="heading1">Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button
                className="ghost cmn-btn"
                onClick={() => setIsSignUp(false)}
              >
                Log In
              </button>
            </div>

            <div className="overlay-panel overlay-right">
              <h1 className="heading1">Hi there</h1>
              <p>Enter your personal details and start journey with us</p>
              <button
                className="ghost cmn-btn"
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <ResetPasswordModal
        isOpen={showForgotPassword}
        onClose={closeForgotPasswordModal}
        onSubmit={handleForgotPasswordSubmit}
        email={email}
        handleEmailChange={handleEmailChange}
      />

      {/* Partner Logos */}
      <div style={{ width: "100%", zIndex: 0 }}>
        <PartnerCarousel />
      </div>
    </div>
  );
};

const bodyStyle = {
  background: "#f6f5f7",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  fontFamily: `'Montserrat', sans-serif`,
  minHeight: "100vh", // Changed from height to minHeight to allow scrolling
  padding: "20px 0", // Add some padding
};

export default SignInSignUpForm;