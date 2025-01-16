// src/LoginForm.js
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Correct import
import axios from "axios";
import "../assets/Styles/Login.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const signUp = () => {
    navigate("/Register");
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const [isLocked, setIsLocked] = useState(false);
  const [lockMessage, setLockMessage] = useState('');

  const calculateRemainingTime = (lockUntil) => {
    const now = Date.now();
    const remaining = lockUntil - now;

    if (remaining <= 0) return null;

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.ceil((remaining % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hour(s) and ${minutes} minute(s)`;
  };

  const onSubmit = async (data) => {
    const userInfo = {
      email: data.email,
      password: data.password,
    };

    // Client-side validation
    if (!/\S+@\S+\.\S+/.test(userInfo.email)) {
      toast.error("Email is not valid.");
      return;
    }
    if (
      userInfo.password.length < 8 ||
      userInfo.password.length > 15 ||
      !/[A-Z]/.test(userInfo.password) ||
      !/[!@#$%^&*]/.test(userInfo.password)
    ) {
      toast.error(
        "Password should contain at least one capital letter and special character and be 8-15 characters long."
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/user/login", userInfo);
      if (response.data && response.data.userId) {
        toast.success("Login Successful");
        sessionStorage.setItem("userId", response.data.userId);
        navigate("/");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Invalid Credentials";
      toast.error(message);

      if (message.includes("locked")) {
        setIsLocked(true);
        setLockMessage(message);
        const lockUntil = error.response.data.lockUntil ? new Date(error.response.data.lockUntil) : null;

        if (lockUntil) {
          const remainingTime = calculateRemainingTime(lockUntil);
          setLockMessage(`Account locked. Try again in ${remainingTime}.`);
          localStorage.setItem('lockUntil', lockUntil.toISOString());

          // Start countdown timer
          const timer = setInterval(() => {
            const now = Date.now();
            const newRemaining = lockUntil - now;

            if (newRemaining <= 0) {
              setIsLocked(false);
              setLockMessage('');
              localStorage.removeItem('lockUntil');
              clearInterval(timer);
            } else {
              const updatedRemaining = calculateRemainingTime(lockUntil);
              setLockMessage(`Account locked. Try again in ${updatedRemaining}.`);
            }
          }, 60000); // Update every minute

          // Cleanup timer on component unmount
          return () => clearInterval(timer);
        }
      }
    }
  };

  useEffect(() => {
    const storedLockUntil = localStorage.getItem('lockUntil');
    if (storedLockUntil) {
      const lockUntilDate = new Date(storedLockUntil);
      const remaining = lockUntilDate - Date.now();

      if (remaining > 0) {
        setIsLocked(true);
        setLockMessage(`Account locked. Try again in ${calculateRemainingTime(lockUntilDate)}.`);

        const timer = setInterval(() => {
          const now = Date.now();
          const newRemaining = lockUntilDate - now;

          if (newRemaining <= 0) {
            setIsLocked(false);
            setLockMessage('');
            localStorage.removeItem('lockUntil');
            clearInterval(timer);
          } else {
            setLockMessage(`Account locked. Try again in ${calculateRemainingTime(lockUntilDate)}.`);
          }
        }, 60000); // Update every minute

        // Cleanup timer on component unmount
        return () => clearInterval(timer);
      } else {
        localStorage.removeItem('lockUntil');
      }
    }
  }, []);

  return (
    <div className="back-login-container">
      <div className="login-main-container">
        <div className="signin-container">
          <form className="signin-form" onSubmit={handleSubmit(onSubmit)}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              disabled={isLocked}
            />
            {errors.email && <span className="error">{errors.email.message}</span>}
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              disabled={isLocked}
            />
            {errors.password && <span className="error">{errors.password.message}</span>}
            <button className="signin-button" type="submit" disabled={isLocked}>
              Log In
            </button>
            {isLocked && <p className="lock-message">{lockMessage}</p>}
          </form>
        </div>
        <div className="signup-container">
          <h2>Hello, Friend!</h2>
          <p>
            Register with your personal details to use all of the site features
          </p>
          <button className="signup-button" onClick={signUp}>
            Sign Up
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
