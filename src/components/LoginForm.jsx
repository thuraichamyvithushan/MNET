import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase'; // Only need auth now
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUpSignIn.css";
import Loader from "./Loader";

const LoginForm = ({ onForgotPassword }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (!password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);

      // Sign in with Firebase Auth
      const userCredential = await auth.signInWithEmailAndPassword(email.trim(), password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await auth.signOut();
        toast.error("Please verify your email before logging in.");
        return;
      }

      // Success! Redirect to dashboard
      toast.success("Login successful!");
      navigate('/home', { replace: true });

    } catch (error) {
      console.error("Login error:", error);

      if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
        toast.error("Invalid email or password");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many attempts. Try again later.");
      } else {
        toast.error("Login failed. Please try again.");
      }

      // Clear password on error
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-containerA sign-in-containerA">
      {isLoading && (
        <div className="loader2-container">
          <Loader />
        </div>
      )}

      <form onSubmit={handleLogin} className="form1">
        <h2 style={{ fontWeight: "bold", marginBottom: "15px" }}>
          Sign In
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="input-common"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input-common"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <p className="anchor" onClick={onForgotPassword}>
          Forgot your password?
        </p>

        <button
          type="submit"
          className="cmn-btn"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Log In"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;