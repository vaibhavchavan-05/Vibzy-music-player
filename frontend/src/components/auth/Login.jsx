import React, { useState } from "react";
import Input from "../common/Input";
import validator from "validator";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setError, setLoading, clearError, setUser } from "../../redux/slices/authSlice";
import { closeAuthModal, switchAuthMode } from "../../redux/slices/uiSlice";
import "../../css/auth/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { authMode } = useSelector((state) => state.ui);  
  const isForgot = authMode === "forgot";

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(clearError());

    if (!validator.isEmail(email)) {
      dispatch(setError("Please enter a valid email address"));
      return;
    }
    if (!password) {
      dispatch(setError("Please enter your password"));
      return;
    }

    dispatch(setLoading(true));
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const data = res.data || {};
      dispatch(setUser({ user: data.user, token: data.token })); 
      // Note: your setUser reducer already handles localStorage.setItem, 
      // so the line below is optional but fine to keep.
      localStorage.setItem("token", data.token);
      dispatch(closeAuthModal());
    } catch (error) {
      const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
      dispatch(setError(serverMessage || "Login Failed"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setForgotMsg("Please enter your email");
      return;
    }

    try {
      setForgotMsg("Sending reset link...");
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`, {
        email: forgotEmail,
      });
      setForgotMsg("Reset link sent! Check your email 📩");
    } catch (error) {
      // Fixed the space in .data.
      setForgotMsg(error?.response?.data?.message || "Failed to send the reset email");
    }
  };

  return (
    <div className="login-wrapper">
      {/* Changed title based on mode */}
      <h3 className="login-title">{isForgot ? "Reset Password" : "Welcome Back"}</h3>
      <p className="login-subtitle">
        {isForgot ? "Enter your email to receive a reset link" : "Please enter your details to login"}
      </p>

      <form className="login-form" onSubmit={handleLogin}>
        {!isForgot ? (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              placeholder="johndoe@gmail.com"
              type="email"
            />
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="Min 8 characters"
              type="password"
            /> 
          </>
        ) : (
          <div className="forgot-box">
            <Input 
               label="Email" 
               type="email"
               placeholder="Enter your registered email"
               value={forgotEmail}
               onChange={(e) => setForgotEmail(e.target.value)}
            />
            {forgotMsg && <p className="forgot-msg">{forgotMsg}</p>} 
            <button type="button" className="forgot-btn" onClick={handleForgotPassword}>
               Send reset link
            </button>
            <p className="forgot-link" style={{marginTop: '15px', textAlign: 'center', cursor: 'pointer'}} 
               onClick={() => {
                 setForgotMsg("");
                 dispatch(switchAuthMode("login"));
               }}>
               Back to Login
            </p>
          </div>
        )}

        <div className="forgit-wrapper">
          {!isForgot && (
            <>
              <span className="forgot-link" onClick={() => {
                dispatch(clearError());
                dispatch(switchAuthMode("forgot"));
              }}>
                Forgot Password?
              </span>
              <span className="forgot-link" onClick={() => {
                dispatch(clearError());
                dispatch(switchAuthMode("signup"));
              }}>Don't have an account? Sign up</span>
            </>
          )}
        </div>

        {error && <div className="login-error">{error}</div>}

        {!isForgot && (
          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            <span>{isLoading ? "Logging in..." : "Login"}</span>
          </button>
        )}
      </form>
    </div>
  );
};

export default Login;