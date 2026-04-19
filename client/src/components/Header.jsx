import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Header.css";

function Header({
  navLinks = [],
  homePath = "/",
  rightAction = null,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isLoggedIn = Boolean(userInfo?.token);
  const userName = userInfo?.name || "User";
  const hasCompletedProfile = Boolean(userInfo?.hasCompletedProfile);

  useEffect(() => {
    const syncUserInfo = () => {
      setUserInfo(JSON.parse(localStorage.getItem("userInfo") || "null"));
    };

    syncUserInfo();
    window.addEventListener("storage", syncUserInfo);

    return () => {
      window.removeEventListener("storage", syncUserInfo);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
    setIsDropdownOpen(false);
    navigate("/auth");
  };

  const dropdownItems = [
    { label: "Dashboard", to: "/dashboard" },
    {
      label: hasCompletedProfile ? "Update Profile" : "Complete Profile",
      to: "/profile-setup",
    },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "Welcome Page", to: "/welcome" },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to={homePath} className="brand-link">
          <div className="brand-mark">
            <BrandLogo />
          </div>
          <span className="brand-text">Career Guidance</span>
        </Link>

        <nav className="site-nav">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;

            return (
              <Link
                key={link.label}
                to={link.to}
                className={`site-nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-header-right">
          {isLoggedIn ? (
            <div className="profile-dropdown-wrap" ref={dropdownRef}>
              <button
                type="button"
                className={`profile-chip-btn ${isDropdownOpen ? "open" : ""}`}
                onClick={() => setIsDropdownOpen((prev) => !prev)}
              >
                <AvatarCircle name={userName} />
                <span className="profile-chip-name">{userName}</span>
                <ChevronDownIcon />
              </button>

              {isDropdownOpen && (
                <div className="profile-dropdown-menu">
                  <div className="profile-dropdown-user">
                    <AvatarCircle name={userName} large />
                    <div>
                      <strong>{userName}</strong>
                      <p>{hasCompletedProfile ? "Profile completed" : "Profile incomplete"}</p>
                    </div>
                  </div>

                  <div className="profile-dropdown-links">
                    {dropdownItems.map((item) => (
                      <Link key={item.label} to={item.to} className="profile-dropdown-link">
                        {item.label}
                      </Link>
                    ))}

                    <button
                      type="button"
                      className="profile-dropdown-link logout-link"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : rightAction ? (
            <Link to={rightAction.to} className="header-action-btn">
              {rightAction.label}
            </Link>
          ) : (
            <div className="header-right-spacer" />
          )}
        </div>
      </div>
    </header>
  );
}

function AvatarCircle({ name, large = false }) {
  const firstLetter = (name || "U").charAt(0).toUpperCase();

  return (
    <span className={`header-avatar ${large ? "large" : ""}`} aria-hidden="true">
      {firstLetter}
    </span>
  );
}

function ChevronDownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandLogo() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
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

export default Header;