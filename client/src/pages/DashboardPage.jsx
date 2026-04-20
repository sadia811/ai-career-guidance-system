import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/DashboardPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const dashboardNavLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "Roadmap", to: "/roadmap" },
    { label: "Contact", to: "/contact" },
];

function DashboardPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");

    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!storedUser?.token) {
                setLoadingProfile(false);
                setErrorMessage("Please log in to view your dashboard.");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${storedUser.token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 404) {
                        setProfile(null);
                        setLoadingProfile(false);
                        return;
                    }

                    setErrorMessage(data.message || "Failed to load dashboard data.");
                    setLoadingProfile(false);
                    return;
                }

                setProfile(data);
            } catch (error) {
                setErrorMessage("Unable to load dashboard right now.");
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [storedUser?.token]);

    const userName = storedUser?.name || "User";

    const dashboardStats = useMemo(() => {
        if (!profile) {
            return {
                completion: 0,
                technicalSkillsCount: 0,
                softSkillsCount: 0,
                interestCount: 0,
                experienceCount: 0,
            };
        }

        return {
            completion: profile.profileCompletion || 0,
            technicalSkillsCount: profile.technicalSkills?.length || 0,
            softSkillsCount: profile.softSkills?.length || 0,
            interestCount: profile.careerInterests?.length || 0,
            experienceCount: profile.experienceTags?.length || 0,
        };
    }, [profile]);

    const handleLogout = () => {
        localStorage.removeItem("userInfo");
        navigate("/auth");
    };

    return (
        <div className="dashboard-page">
            <Header
                navLinks={dashboardNavLinks}
                homePath="/dashboard"
                showProfileButton={true}
                profilePath="/dashboard"
                mode="user"
            />

            <main className="dashboard-main">
                <section className="dashboard-hero-card">
                    <div className="dashboard-hero-left">
                        <div className="dashboard-badge">Personal Dashboard</div>

                        <h1 className="dashboard-title">
                            Welcome back, <span>{userName}</span>
                        </h1>

                        <p className="dashboard-description">
                            Track your progress, review your profile, and continue building your ideal
                            career path with personalized guidance.
                        </p>

                        <div className="dashboard-hero-actions">
                            <Link to="/profile-setup" className="dashboard-primary-btn">
                                Update Profile
                            </Link>

                            <Link to="/app/explore-careers" className="dashboard-secondary-btn">
                                Explore Careers
                            </Link>
                        </div>
                    </div>

                    <div className="dashboard-hero-right">
                        <div className="completion-ring-card">
                            <div className="completion-ring">
                                <div className="completion-ring-inner">
                                    <span>{dashboardStats.completion}%</span>
                                    <small>Complete</small>
                                </div>
                            </div>

                            <p className="completion-label">Profile Completion</p>
                        </div>
                    </div>
                </section>

                {loadingProfile ? (
                    <div className="dashboard-loading-card">Loading your dashboard...</div>
                ) : errorMessage ? (
                    <div className="dashboard-message-card dashboard-error-card">
                        <p>{errorMessage}</p>
                        <Link to="/auth" className="dashboard-inline-link">
                            Go to Login
                        </Link>
                    </div>
                ) : !profile ? (
                    <div className="dashboard-message-card">
                        <h2>Your profile is not set up yet</h2>
                        <p>
                            Complete your profile to unlock personalized career suggestions,
                            prediction results, and roadmap planning.
                        </p>
                        <Link to="/profile-setup" className="dashboard-primary-btn small-btn">
                            Complete Profile
                        </Link>
                    </div>
                ) : (
                    <>
                        <section className="dashboard-stats-grid">
                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-icon">
                                    <CompletionIcon />
                                </div>
                                <div>
                                    <h3>{dashboardStats.completion}%</h3>
                                    <p>Profile Completion</p>
                                </div>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-icon">
                                    <CodeIcon />
                                </div>
                                <div>
                                    <h3>{dashboardStats.technicalSkillsCount}</h3>
                                    <p>Technical Skills</p>
                                </div>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-icon">
                                    <SoftSkillIcon />
                                </div>
                                <div>
                                    <h3>{dashboardStats.softSkillsCount}</h3>
                                    <p>Soft Skills</p>
                                </div>
                            </article>

                            <article className="dashboard-stat-card">
                                <div className="dashboard-stat-icon">
                                    <InterestIcon />
                                </div>
                                <div>
                                    <h3>{dashboardStats.interestCount}</h3>
                                    <p>Career Interests</p>
                                </div>
                            </article>
                        </section>

                        <section className="dashboard-content-grid">
                            <article className="dashboard-panel profile-summary-panel">
                                <div className="dashboard-panel-head">
                                    <h2>Profile Summary</h2>
                                    <Link to="/profile-setup" className="dashboard-text-link">
                                        Edit
                                    </Link>
                                </div>

                                <div className="summary-grid">
                                    <div className="summary-item">
                                        <span className="summary-label">Degree</span>
                                        <strong>{profile.degree || "Not added"}</strong>
                                    </div>

                                    <div className="summary-item">
                                        <span className="summary-label">Major</span>
                                        <strong>{profile.major || "Not added"}</strong>
                                    </div>

                                    <div className="summary-item">
                                        <span className="summary-label">Technical Skills</span>
                                        <strong>{profile.technicalSkills?.join(", ") || "Not added"}</strong>
                                    </div>

                                    <div className="summary-item">
                                        <span className="summary-label">Soft Skills</span>
                                        <strong>{profile.softSkills?.join(", ") || "Not added"}</strong>
                                    </div>

                                    <div className="summary-item">
                                        <span className="summary-label">Career Interests</span>
                                        <strong>{profile.careerInterests?.join(", ") || "Not added"}</strong>
                                    </div>

                                    <div className="summary-item">
                                        <span className="summary-label">Experience Areas</span>
                                        <strong>{profile.experienceTags?.join(", ") || "Not added"}</strong>
                                    </div>
                                </div>

                                <div className="experience-box">
                                    <span className="summary-label">Experience Details</span>
                                    <p>{profile.experienceText || "No experience details added yet."}</p>
                                </div>
                            </article>

                            <article className="dashboard-panel quick-actions-panel">
                                <div className="dashboard-panel-head">
                                    <h2>Quick Actions</h2>
                                </div>

                                <div className="quick-action-list">
                                    <Link to="/profile-setup" className="quick-action-card">
                                        <div className="quick-action-icon">
                                            <ProfileIcon />
                                        </div>
                                        <div>
                                            <h3>Update Profile</h3>
                                            <p>Keep your education, skills, and interests up to date.</p>
                                        </div>
                                    </Link>

                                    <Link to="/app/explore-careers" className="quick-action-card">
                                        <div className="quick-action-icon">
                                            <CareerIcon />
                                        </div>
                                        <div>
                                            <h3>Explore Careers</h3>
                                            <p>Browse roles, salary ranges, and required skills.</p>
                                        </div>
                                    </Link>

                                    <button type="button" className="quick-action-card button-card" onClick={handleLogout}>
                                        <div className="quick-action-icon">
                                            <LogoutIcon />
                                        </div>
                                        <div>
                                            <h3>Logout</h3>
                                            <p>Sign out from your account securely.</p>
                                        </div>
                                    </button>
                                </div>
                            </article>
                        </section>

                        <section className="dashboard-next-steps">
                            <div className="dashboard-panel-head">
                                <h2>Recommended Next Steps</h2>
                            </div>

                            <div className="next-steps-grid">
                                <article className="next-step-card">
                                    <div className="next-step-number">1</div>
                                    <h3>Review Your Profile</h3>
                                    <p>
                                        Make sure your skills, interests, and experience are complete and accurate.
                                    </p>
                                </article>

                                <article className="next-step-card">
                                    <div className="next-step-number">2</div>
                                    <h3>Explore Career Paths</h3>
                                    <p>
                                        Start browsing careers that match your current background and interests.
                                    </p>
                                </article>

                                <article className="next-step-card">
                                    <div className="next-step-number">3</div>
                                    <h3>Prepare for Prediction</h3>
                                    <p>
                                        Your saved profile will be used next for AI-based career prediction and roadmap generation.
                                    </p>
                                </article>
                            </div>
                        </section>
                    </>
                )}
            </main>

            <Footer homePath="/dashboard" />
        </div>
    );
}

function CompletionIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="18" fill="#EEF4FF" stroke="#BCD2F8" strokeWidth="4" />
            <path d="M23 32L29 38L41 25" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CodeIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="10" y="14" width="44" height="28" rx="5" fill="#EEF4FF" stroke="#8AB3F4" strokeWidth="3" />
            <path d="M24 28L19 32L24 36" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 28L45 32L40 36" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M34 24L30 40" stroke="#7BAAF1" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function SoftSkillIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="24" cy="24" r="10" fill="#DDEBFF" />
            <circle cx="40" cy="20" r="8" fill="#C9DFFE" />
            <path d="M14 50C14 42.8 19.8 37 27 37H31C38.2 37 44 42.8 44 50V52H14V50Z" fill="#77A8F0" />
        </svg>
    );
}

function InterestIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M32 52C31.2 52 30.5 51.7 29.9 51.2L18.5 41C14.5 37.4 14.2 31.1 17.8 27.1C21.4 23.1 27.6 22.8 31.7 26.4C35.7 22.8 41.9 23.1 45.5 27.1C49.1 31.1 48.8 37.4 44.8 41L33.4 51.2C32.8 51.7 32.1 52 32 52Z" fill="#F6C7D1" />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="22" r="10" fill="#DCEBFF" />
            <path d="M16 50C16 41.16 23.16 34 32 34C40.84 34 48 41.16 48 50V52H16V50Z" fill="#77A8F0" />
        </svg>
    );
}

function CareerIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M18 20H46L44 48H20L18 20Z" fill="#EEF4FF" stroke="#8AB3F4" strokeWidth="3" />
            <path d="M25 20V16C25 12.69 27.69 10 31 10H33C36.31 10 39 12.69 39 16V20" stroke="#4F86E8" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M28 42L38 32L28 22" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M38 32H16" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" />
            <path d="M34 12H46C48.21 12 50 13.79 50 16V48C50 50.21 48.21 52 46 52H34" stroke="#8AB3F4" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

export default DashboardPage;