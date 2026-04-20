import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/AuthPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");
const REDIRECT_AFTER_AUTH = "/welcome";

const guestNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

function AuthPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const feature = searchParams.get("feature");

    const featureMessages = {
        "career-prediction": "Please login or register to use Career Prediction.",
        "skill-gap-analysis":
            "Please login or register to use Skill Gap Analysis.",
        "learning-roadmap":
            "Please login or register to access your personalized Learning Roadmap.",
        "progress-tracking":
            "Please login or register to track your career progress.",
    };

    const featurePrompt = featureMessages[feature] || "";

    const [activeTab, setActiveTab] = useState("register");

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    });

    const [registerForm, setRegisterForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loginLoading, setLoginLoading] = useState(false);
    const [registerLoading, setRegisterLoading] = useState(false);

    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [loginSuccess, setLoginSuccess] = useState("");
    const [registerSuccess, setRegisterSuccess] = useState("");

    const isLoginActive = activeTab === "login";
    const isRegisterActive = activeTab === "register";

    const clearMessages = () => {
        setLoginError("");
        setRegisterError("");
        setLoginSuccess("");
        setRegisterSuccess("");
    };

    const handleLoginChange = (e) => {
        const { name, value } = e.target;

        setLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setLoginError("");
        setLoginSuccess("");
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;

        setRegisterForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setRegisterError("");
        setRegisterSuccess("");
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError("");
        setLoginSuccess("");

        if (!loginForm.email || !loginForm.password) {
            setLoginError("Please provide email and password.");
            return;
        }

        try {
            setLoginLoading(true);

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginForm),
            });

            const data = await response.json();

            if (!response.ok) {
                setLoginError(data.message || "Login failed.");
                return;
            }

            localStorage.setItem("userInfo", JSON.stringify(data.user));
            setLoginSuccess("Login successful. Redirecting...");

            setTimeout(() => {
                navigate(REDIRECT_AFTER_AUTH);
            }, 700);
        } catch (error) {
            setLoginError("Unable to connect to server. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setRegisterError("");
        setRegisterSuccess("");

        if (!registerForm.name || !registerForm.email || !registerForm.password) {
            setRegisterError("Please fill in all fields.");
            return;
        }

        if (registerForm.password.length < 6) {
            setRegisterError("Password must be at least 6 characters.");
            return;
        }

        try {
            setRegisterLoading(true);

            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(registerForm),
            });

            const data = await response.json();

            if (!response.ok) {
                setRegisterError(data.message || "Registration failed.");
                return;
            }

            localStorage.setItem("userInfo", JSON.stringify(data.user));
            setRegisterSuccess("Registration successful. Redirecting...");

            setTimeout(() => {
                navigate(REDIRECT_AFTER_AUTH);
            }, 700);
        } catch (error) {
            setRegisterError("Unable to connect to server. Please try again.");
        } finally {
            setRegisterLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <Header
                navLinks={guestNavLinks}
                homePath="/"
                showProfileButton={true}
                profilePath="/auth"
                mode="guest"
            />

            <main className="auth-main">
                <section className="auth-section">
                    <h1 className="auth-heading">
                        <span>Register / </span>
                        <span className="heading-accent">Login</span>
                    </h1>

                    {featurePrompt && (
                        <div className="auth-feature-message">{featurePrompt}</div>
                    )}

                    <div className="auth-tab-switcher">
                        <button
                            type="button"
                            className={`tab-btn ${isLoginActive ? "active" : ""}`}
                            onClick={() => {
                                clearMessages();
                                setActiveTab("login");
                            }}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={`tab-btn ${isRegisterActive ? "active" : ""}`}
                            onClick={() => {
                                clearMessages();
                                setActiveTab("register");
                            }}
                        >
                            Register
                        </button>
                    </div>

                    <div className={`auth-card active-${activeTab}`}>
                        <div
                            className={`form-panel left-panel ${isLoginActive ? "panel-active" : "panel-inactive"
                                }`}
                            aria-hidden={!isLoginActive}
                        >
                            <h2>Login</h2>

                            <form onSubmit={handleLoginSubmit}>
                                <fieldset disabled={!isLoginActive || loginLoading} className="form-fieldset">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="input-box">
                                            <span className="input-icon">
                                                <MailIcon />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={loginForm.email}
                                                onChange={handleLoginChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="input-box">
                                            <span className="input-icon">
                                                <LockIcon />
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={loginForm.password}
                                                onChange={handleLoginChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="forgot-password-wrap">
                                        <button
                                            type="button"
                                            className="forgot-password-link"
                                            onClick={() => navigate("/forgot-password")}
                                        >
                                            Forgot Password?
                                        </button>
                                    </div>

                                    {loginError && <p className="auth-form-message auth-form-error">{loginError}</p>}
                                    {loginSuccess && (
                                        <p className="auth-form-message auth-form-success">{loginSuccess}</p>
                                    )}

                                    <button type="submit" className="primary-button full-btn">
                                        {loginLoading ? "Logging in..." : "Login"}
                                    </button>
                                </fieldset>
                            </form>

                            <p className="switch-text">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    className="text-link"
                                    onClick={() => {
                                        clearMessages();
                                        setActiveTab("register");
                                    }}
                                >
                                    Register
                                </button>
                            </p>
                        </div>

                        <div
                            className={`form-panel right-panel ${isRegisterActive ? "panel-active" : "panel-inactive"
                                }`}
                            aria-hidden={!isRegisterActive}
                        >
                            <h2>Register</h2>

                            <form onSubmit={handleRegisterSubmit}>
                                <fieldset
                                    disabled={!isRegisterActive || registerLoading}
                                    className="form-fieldset"
                                >
                                    <div className="form-group">
                                        <label>Name</label>
                                        <div className="input-box">
                                            <span className="input-icon">
                                                <UserIcon />
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                placeholder="Name"
                                                value={registerForm.name}
                                                onChange={handleRegisterChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Email</label>
                                        <div className="input-box">
                                            <span className="input-icon">
                                                <MailIcon />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="Email"
                                                value={registerForm.email}
                                                onChange={handleRegisterChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Password</label>
                                        <div className="input-box">
                                            <span className="input-icon">
                                                <LockIcon />
                                            </span>
                                            <input
                                                type="password"
                                                name="password"
                                                placeholder="Password"
                                                value={registerForm.password}
                                                onChange={handleRegisterChange}
                                            />
                                        </div>
                                    </div>

                                    {registerError && (
                                        <p className="auth-form-message auth-form-error">{registerError}</p>
                                    )}
                                    {registerSuccess && (
                                        <p className="auth-form-message auth-form-success">
                                            {registerSuccess}
                                        </p>
                                    )}

                                    <button type="submit" className="primary-button full-btn">
                                        {registerLoading ? "Registering..." : "Register"}
                                    </button>
                                </fieldset>
                            </form>

                            <p className="switch-text">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-link"
                                    onClick={() => {
                                        clearMessages();
                                        setActiveTab("login");
                                    }}
                                >
                                    Login
                                </button>
                            </p>
                        </div>
                    </div>
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

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="8" r="4" fill="#77A8F0" />
            <path
                d="M4 19C4 15.6863 6.68629 13 10 13H14C17.3137 13 20 15.6863 20 19V20H4V19Z"
                fill="#77A8F0"
            />
        </svg>
    );
}

export default AuthPage;