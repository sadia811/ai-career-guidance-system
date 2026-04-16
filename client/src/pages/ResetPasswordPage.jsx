import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ForgotPasswordPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const guestNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

function ResetPasswordPage() {
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!password || !confirmPassword) {
            setErrorMessage("Please fill in both password fields.");
            return;
        }

        if (password.length < 6) {
            setErrorMessage("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/api/auth/reset-password/${token}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ password }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.message || "Password reset failed.");
                return;
            }

            setSuccessMessage("Password reset successful. Redirecting to login...");

            setTimeout(() => {
                navigate("/auth");
            }, 1200);
        } catch (error) {
            setErrorMessage("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-page">
            <Header
                navLinks={guestNavLinks}
                homePath="/"
                showProfileButton={true}
                profilePath="/auth"
            />

            <main className="forgot-main">
                <section className="forgot-card">
                    <h1>Reset Password</h1>
                    <p>Enter your new password below.</p>

                    <form onSubmit={handleSubmit} className="forgot-form">
                        <div className="forgot-form-group">
                            <label>New Password</label>
                            <div className="forgot-input-box">
                                <span className="forgot-input-icon">
                                    <LockIcon />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage("");
                                        setSuccessMessage("");
                                    }}
                                />
                            </div>
                        </div>

                        <div className="forgot-form-group">
                            <label>Confirm Password</label>
                            <div className="forgot-input-box">
                                <span className="forgot-input-icon">
                                    <LockIcon />
                                </span>
                                <input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setErrorMessage("");
                                        setSuccessMessage("");
                                    }}
                                />
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="forgot-message forgot-error">{errorMessage}</p>
                        )}

                        {successMessage && (
                            <p className="forgot-message forgot-success">{successMessage}</p>
                        )}

                        <button type="submit" className="forgot-submit-btn">
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <button
                        type="button"
                        className="back-to-auth-btn"
                        onClick={() => navigate("/auth")}
                    >
                        Back to Login
                    </button>
                </section>
            </main>

            <Footer homePath="/" />
        </div>
    );
}

function LockIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="5" y="10" width="14" height="10" rx="2.5" fill="#77A8F0" />
            <path
                d="M8.5 10V7.8C8.5 5.59 10.29 3.8 12.5 3.8C14.71 3.8 16.5 5.59 16.5 7.8V10"
                stroke="#77A8F0"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="12" cy="14.4" r="1.4" fill="white" />
            <path
                d="M12 15.8V17.3"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default ResetPasswordPage;