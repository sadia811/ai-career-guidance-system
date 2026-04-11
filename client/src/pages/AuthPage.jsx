import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/AuthPage.css";

const guestNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

function AuthPage() {
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

    const isLoginActive = activeTab === "login";
    const isRegisterActive = activeTab === "register";

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRegisterChange = (e) => {
        const { name, value } = e.target;
        setRegisterForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        // Later backend integration:
        // await fetch("http://localhost:5000/api/auth/login", {...})

        console.log("Login payload:", loginForm);
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        // Later backend integration:
        // await fetch("http://localhost:5000/api/auth/register", {...})

        console.log("Register payload:", registerForm);
    };

    return (
        <div className="auth-page">
            <Header
                navLinks={guestNavLinks}
                homePath="/"
                showProfileButton={true}
                profilePath="/auth"
            />

            <main className="auth-main">
                <section className="auth-section">
                    <h1 className="auth-heading">
                        <span>Register / </span>
                        <span className="heading-accent">Login</span>
                    </h1>

                    <div className="auth-tab-switcher">
                        <button
                            type="button"
                            className={`tab-btn ${isLoginActive ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Login
                        </button>

                        <button
                            type="button"
                            className={`tab-btn ${isRegisterActive ? "active" : ""}`}
                            onClick={() => setActiveTab("register")}
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
                                <fieldset disabled={!isLoginActive} className="form-fieldset">
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

                                    <button type="submit" className="primary-button full-btn">
                                        Login
                                    </button>
                                </fieldset>
                            </form>

                            <p className="switch-text">
                                Don’t have an account?{" "}
                                <button
                                    type="button"
                                    className="text-link"
                                    onClick={() => setActiveTab("register")}
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
                                <fieldset disabled={!isRegisterActive} className="form-fieldset">
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

                                    <button type="submit" className="primary-button full-btn">
                                        Register
                                    </button>
                                </fieldset>
                            </form>

                            <p className="switch-text">
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    className="text-link"
                                    onClick={() => setActiveTab("login")}
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