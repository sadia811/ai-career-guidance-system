import { Link } from "react-router-dom";
import "../styles/AuthPage.css";

const defaultNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

function Header({
    navLinks = defaultNavLinks,
    homePath = "/",
    showProfileButton = true,
    profilePath = "/auth",
    onProfileClick,
    rightAction = null,
}) {
    const resolvedRightAction =
        rightAction ??
        (showProfileButton
            ? {
                type: "profile",
                to: profilePath,
                onClick: onProfileClick,
            }
            : null);

    return (
        <header className="site-header">
            <Link to={homePath} className="site-brand brand-link">
                <BrandLogo />
                <span>Career Guidance</span>
            </Link>

            <nav className="site-nav">
                {navLinks.map((item) => (
                    <Link key={item.label} to={item.to}>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {resolvedRightAction?.type === "button" && (
                <Link to={resolvedRightAction.to} className="header-action-btn">
                    {resolvedRightAction.label}
                </Link>
            )}

            {resolvedRightAction?.type === "profile" &&
                (resolvedRightAction.onClick ? (
                    <button
                        type="button"
                        className="profile-btn"
                        aria-label="Profile"
                        onClick={resolvedRightAction.onClick}
                    >
                        <ProfileIcon />
                    </button>
                ) : (
                    <Link
                        to={resolvedRightAction.to}
                        className="profile-btn"
                        aria-label="Profile"
                    >
                        <ProfileIcon />
                    </Link>
                ))}
        </header>
    );
}

function BrandLogo() {
    return (
        <svg
            className="brand-logo"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="31" cy="32" r="17" stroke="#4B84E5" strokeWidth="7" />
            <circle cx="31" cy="32" r="7" stroke="#1F3767" strokeWidth="4" />
            <circle cx="14" cy="31" r="4" fill="#1F3767" />
            <circle cx="48" cy="15" r="4" fill="#1F3767" />
            <circle cx="48" cy="49" r="4" fill="#1F3767" />
            <path
                d="M18 21C22 15 28 12 35 12"
                stroke="#8FB8F4"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M43 43C39 48 34 51 27 51"
                stroke="#8FB8F4"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M12 12.25C14.7614 12.25 17 10.0114 17 7.25C17 4.48858 14.7614 2.25 12 2.25C9.23858 2.25 7 4.48858 7 7.25C7 10.0114 9.23858 12.25 12 12.25Z"
                fill="#78A8F0"
            />
            <path
                d="M3.5 20.5C3.5 16.9101 6.41015 14 10 14H14C17.5899 14 20.5 16.9101 20.5 20.5V21.25H3.5V20.5Z"
                fill="#78A8F0"
            />
        </svg>
    );
}

export default Header;