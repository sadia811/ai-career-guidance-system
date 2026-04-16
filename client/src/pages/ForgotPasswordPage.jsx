import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/ForgotPasswordPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const guestNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!email) {
            setErrorMessage("Please enter your email address.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(data.error || data.message || "Request failed.");
                return;
            }

            setSuccessMessage(
                data.message ||
                "If an account with that email exists, a reset link has been sent."
            );
            setEmail("");
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
                    <h1>Forgot Password</h1>
                    <p>
                        Enter your email address and we will send you a link to reset your password.
                    </p>

                    <form onSubmit={handleSubmit} className="forgot-form">
                        <div className="forgot-form-group">
                            <label>Email</label>
                            <div className="forgot-input-box">
                                <span className="forgot-input-icon">
                                    <MailIcon />
                                </span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
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
                            {loading ? "Sending..." : "Send Reset Link"}
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

function MailIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="3" fill="#77A8F0" />
            <path
                d="M5.5 8L12 12.7L18.5 8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default ForgotPasswordPage;