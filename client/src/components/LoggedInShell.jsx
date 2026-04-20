import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoggedInShell.css";
import { clearStoredUser, getStoredUser } from "../utils/auth";

const navItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { key: "profile", label: "Profile", icon: <ProfileIcon />, to: "/profile-setup" },
    { key: "prediction", label: "Career Prediction", icon: <PredictionIcon />, to: "/career-prediction" },
    { key: "explore", label: "Explore Careers", icon: <BagIcon />, to: "/app/explore-careers" },
    { key: "roadmap", label: "Roadmap", icon: <RoadmapIcon />, to: "/roadmap" },
    { key: "progress", label: "Progress Tracker", icon: <ProgressIcon />, to: "/progress-tracker" },
    { key: "courses", label: "Courses", icon: <CoursesIcon />, to: "/courses" },
    { key: "logout", label: "Logout", icon: <LogoutIcon />, action: "logout" },
];

function LoggedInShell({ activeKey, title, subtitle, children }) {
    const navigate = useNavigate();
    const profileMenuRef = useRef(null);

    const storedUser = getStoredUser() || {};
    const userName = storedUser?.name || "User";

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!profileMenuRef.current?.contains(event.target)) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        clearStoredUser();
        setProfileMenuOpen(false);
        navigate("/auth");
    };

    const handleNavClick = (item) => {
        setBannerMessage("");

        if (item.action === "logout") {
            handleLogout();
            return;
        }

        if (item.to) {
            navigate(item.to);
            setSidebarOpen(false);
            return;
        }
    };

    return (
        <div className="logged-shell">
            <button
                type="button"
                className="logged-menu-btn"
                onClick={() => setSidebarOpen((prev) => !prev)}
                aria-label="Toggle sidebar"
            >
                <MenuIcon />
            </button>

            <aside className={`logged-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="logged-sidebar-brand">
                    <BrandLogo />
                    <span>Career Guidance</span>
                </div>

                <nav className="logged-sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`logged-sidebar-item ${activeKey === item.key ? "active" : ""}`}
                            onClick={() => handleNavClick(item)}
                        >
                            <span className="logged-sidebar-icon">{item.icon}</span>
                            <span className="logged-sidebar-label">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {sidebarOpen && (
                <button
                    type="button"
                    className="logged-sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close sidebar overlay"
                />
            )}

            <div className={`logged-shell-main ${sidebarOpen ? "shifted" : ""}`}>
                <header className="logged-shell-topbar">
                    <div className="logged-shell-heading">
                        <h1>{title}</h1>
                        {subtitle ? <p>{subtitle}</p> : null}
                    </div>

                    <div className="logged-profile-dropdown" ref={profileMenuRef}>
                        <button
                            type="button"
                            className="logged-profile-chip"
                            onClick={() => setProfileMenuOpen((prev) => !prev)}
                        >
                            <span className="logged-avatar-letter">
                                {(userName || "U").charAt(0).toUpperCase()}
                            </span>
                            <span className="logged-profile-name">{userName}</span>
                            <ChevronDownIcon />
                        </button>

                        {profileMenuOpen && (
                            <div className="logged-profile-menu">
                                <button
                                    type="button"
                                    className="logged-profile-menu-link"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        navigate("/profile-setup");
                                    }}
                                >
                                    Update Profile
                                </button>

                                <button
                                    type="button"
                                    className="logged-profile-menu-link"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        navigate("/settings");
                                    }}
                                >
                                    Settings
                                </button>

                                <button
                                    type="button"
                                    className="logged-profile-menu-link"
                                    onClick={() => {
                                        setProfileMenuOpen(false);
                                        navigate("/contact");
                                    }}
                                >
                                    Contact Us
                                </button>

                                <button
                                    type="button"
                                    className="logged-profile-menu-link danger"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {bannerMessage ? <div className="logged-shell-banner">{bannerMessage}</div> : null}

                <main className="logged-shell-content">{children}</main>
            </div>
        </div>
    );
}

function BrandLogo() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" width="42" height="42">
            <circle cx="31" cy="32" r="17" stroke="#4B84E5" strokeWidth="7" />
            <circle cx="31" cy="32" r="7" stroke="#1F3767" strokeWidth="4" />
            <circle cx="14" cy="31" r="4" fill="#1F3767" />
            <circle cx="48" cy="15" r="4" fill="#1F3767" />
            <circle cx="48" cy="49" r="4" fill="#1F3767" />
            <path d="M18 21C22 15 28 12 35 12" stroke="#8FB8F4" strokeWidth="4" strokeLinecap="round" />
            <path d="M43 43C39 48 34 51 27 51" stroke="#8FB8F4" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function MenuIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M4 7H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M4 12H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M4 17H20" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="20" height="20">
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DashboardIcon() {
    return <SimpleIcon d="M4 4H10V10H4V4ZM14 4H20V10H14V4ZM4 14H10V20H4V14ZM14 14H20V20H14V14Z" />;
}

function ProfileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
            <path d="M5 20C5 16.686 7.686 14 11 14H13C16.314 14 19 16.686 19 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function PredictionIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8 11H14M11 8V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function BagIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M5 8H19L18 20H6L5 8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M9 9V7C9 5.343 10.343 4 12 4C13.657 4 15 5.343 15 7V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function RoadmapIcon() {
    return <SimpleIcon d="M5 18C8 18 8 6 12 6C16 6 16 18 19 18M12 6V18" strokeOnly />;
}

function ProgressIcon() {
    return <SimpleIcon d="M5 18L10 13L13 16L19 10" strokeOnly />;
}

function CoursesIcon() {
    return <SimpleIcon d="M4 6H20V18H4V6ZM8 10H16M8 14H13" strokeOnly />;
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 4H18C19.105 4 20 4.895 20 6V18C20 19.105 19.105 20 18 20H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function SimpleIcon({ d, strokeOnly = false }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            {strokeOnly ? (
                <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
                <path d={d} fill="currentColor" />
            )}
        </svg>
    );
}

export default LoggedInShell;