import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CareerPredictionPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { key: "profile", label: "Profile", icon: <ProfileIcon />, to: "/profile-setup" },
    { key: "prediction", label: "Career Prediction", icon: <PredictionIcon />, to: "/career-prediction" },
    { key: "explore", label: "Explore Careers", icon: <BagIcon />, to: "/app/explore-careers" },
    { key: "roadmap", label: "Roadmap", icon: <RoadmapIcon />, comingSoon: true },
    { key: "progress", label: "Progress Tracker", icon: <ProgressIcon />, comingSoon: true },
    { key: "courses", label: "Courses", icon: <CoursesIcon />, comingSoon: true },
    { key: "resources", label: "Resources", icon: <ResourcesIcon />, comingSoon: true },
    { key: "logout", label: "Logout", icon: <LogoutIcon />, action: "logout" },
];

function CareerPredictionPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";
    const userName = storedUser?.name || "User";

    const [pageMessage, setPageMessage] = useState("");
    const [loadingPrediction, setLoadingPrediction] = useState(true);
    const [predictionError, setPredictionError] = useState("");
    const [predictionData, setPredictionData] = useState(null);
    const [settingGoal, setSettingGoal] = useState(false);

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const fetchPrediction = async () => {
            try {
                setLoadingPrediction(true);
                setPredictionError("");

                const response = await fetch(`${API_URL}/api/prediction/me`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setPredictionError(data.message || "Failed to load prediction.");
                    setPredictionData(null);
                    return;
                }

                setPredictionData(data);
            } catch (error) {
                setPredictionError("Unable to load career prediction right now.");
                setPredictionData(null);
            } finally {
                setLoadingPrediction(false);
            }
        };

        fetchPrediction();
    }, [token, navigate]);

    const handleSidebarClick = (item) => {
        setPageMessage("");

        if (item.action === "logout") {
            localStorage.removeItem("userInfo");
            navigate("/auth");
            return;
        }

        if (item.comingSoon) {
            setPageMessage(`${item.label} page will be connected next.`);
            return;
        }

        if (item.to) {
            navigate(item.to);
        }
    };

    const handleSetCareerGoal = async () => {
        if (!predictionData?.topCareerDetails?._id || !token) return;

        try {
            setSettingGoal(true);

            const response = await fetch(
                `${API_URL}/api/careers/${predictionData.topCareerDetails._id}/set-goal`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPageMessage(data.message || "Failed to set career goal.");
                return;
            }

            setPageMessage(data.message || "Career goal updated.");
        } catch (error) {
            setPageMessage("Unable to set career goal right now.");
        } finally {
            setSettingGoal(false);
        }
    };

    return (
        <div className="prediction-page">
            <aside className="prediction-sidebar">
                <div className="prediction-brand">
                    <BrandLogo />
                    <span>Career Guidance</span>
                </div>

                <nav className="prediction-sidebar-nav">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`sidebar-item ${item.key === "prediction" ? "active" : ""}`}
                            onClick={() => handleSidebarClick(item)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="prediction-content-wrap">
                <header className="prediction-topbar">
                    <div className="prediction-topbar-left">
                        <h1>Career Prediction</h1>
                        <p>AI-based career suggestions from your saved profile.</p>
                    </div>

                    <button type="button" className="profile-chip" onClick={() => navigate("/dashboard")}>
                        <AvatarLetter name={userName} />
                        <span>{userName}</span>
                        <ChevronDownIcon />
                    </button>
                </header>

                {pageMessage && <div className="page-message-banner">{pageMessage}</div>}

                <main className="prediction-main">
                    {loadingPrediction ? (
                        <div className="prediction-state-card">Generating your prediction...</div>
                    ) : predictionError ? (
                        <div className="prediction-state-card error-state">
                            <h2>Prediction unavailable</h2>
                            <p>{predictionError}</p>
                            <button
                                type="button"
                                className="secondary-action-btn"
                                onClick={() => navigate("/profile-setup")}
                            >
                                Update Profile
                            </button>
                        </div>
                    ) : !predictionData ? (
                        <div className="prediction-state-card">
                            <h2>No prediction result found</h2>
                            <p>Please complete your profile first and try again.</p>
                            <button
                                type="button"
                                className="primary-action-btn"
                                onClick={() => navigate("/profile-setup")}
                            >
                                Complete Profile
                            </button>
                        </div>
                    ) : (
                        <>
                            <section className="prediction-hero-card">
                                <div className="prediction-badge">Best Career Match</div>

                                <div className="prediction-hero-grid">
                                    <div className="prediction-hero-left">
                                        <h2>{predictionData.topCareer || "No top career"}</h2>

                                        <p className="prediction-hero-description">
                                            Based on your degree, skills, interests, and experience, this is your
                                            strongest career match right now.
                                        </p>

                                        {predictionData.topCareerDetails && (
                                            <div className="prediction-hero-meta">
                                                <span>{predictionData.topCareerDetails.industry}</span>
                                                <span>
                                                    {formatSalary(
                                                        predictionData.topCareerDetails.salaryMin,
                                                        predictionData.topCareerDetails.salaryMax
                                                    )}
                                                </span>
                                            </div>
                                        )}

                                        <div className="prediction-hero-actions">
                                            <button
                                                type="button"
                                                className="primary-action-btn"
                                                onClick={handleSetCareerGoal}
                                                disabled={settingGoal}
                                            >
                                                {settingGoal ? "Saving..." : "Set as Career Goal"}
                                            </button>

                                            <button
                                                type="button"
                                                className="secondary-action-btn"
                                                onClick={() => navigate("/app/explore-careers")}
                                            >
                                                Explore Careers
                                            </button>
                                        </div>
                                    </div>

                                    <div className="prediction-hero-right">
                                        <div className="match-score-ring">
                                            <div className="match-score-inner">
                                                <span>{toPercent(predictionData.predictions?.[0]?.probability || 0)}%</span>
                                                <small>Top Match</small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="prediction-grid">
                                <article className="prediction-panel">
                                    <div className="panel-head">
                                        <h3>Top Career Predictions</h3>
                                    </div>

                                    <div className="probability-list">
                                        {(predictionData.predictions || []).map((item, index) => (
                                            <div key={item.career} className="probability-card">
                                                <div className="probability-card-top">
                                                    <div className="probability-rank">{index + 1}</div>
                                                    <div>
                                                        <h4>{item.career}</h4>
                                                        <p>{toPercent(item.probability)}% match</p>
                                                    </div>
                                                </div>

                                                <div className="probability-bar">
                                                    <div
                                                        className="probability-fill"
                                                        style={{ width: `${toPercent(item.probability)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                <article className="prediction-panel">
                                    <div className="panel-head">
                                        <h3>Career Details</h3>
                                    </div>

                                    {predictionData.topCareerDetails ? (
                                        <div className="details-stack">
                                            <div className="detail-box">
                                                <span className="detail-label">Career</span>
                                                <strong>{predictionData.topCareerDetails.title}</strong>
                                            </div>

                                            <div className="detail-box">
                                                <span className="detail-label">Industry</span>
                                                <strong>{predictionData.topCareerDetails.industry}</strong>
                                            </div>

                                            <div className="detail-box">
                                                <span className="detail-label">Salary Range</span>
                                                <strong>
                                                    {formatSalary(
                                                        predictionData.topCareerDetails.salaryMin,
                                                        predictionData.topCareerDetails.salaryMax
                                                    )}
                                                </strong>
                                            </div>

                                            <div className="detail-box">
                                                <span className="detail-label">Required Skills</span>
                                                <div className="tag-wrap">
                                                    {(predictionData.topCareerDetails.requiredSkills || []).map((skill) => (
                                                        <span key={skill} className="skill-tag">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="empty-text">Career details are not available yet.</p>
                                    )}
                                </article>
                            </section>

                            <section className="prediction-grid second-grid">
                                <article className="prediction-panel">
                                    <div className="panel-head">
                                        <h3>Missing Skills</h3>
                                    </div>

                                    {predictionData.missingSkills && predictionData.missingSkills.length > 0 ? (
                                        <div className="missing-skills-list">
                                            {predictionData.missingSkills.map((skill) => (
                                                <div key={skill} className="missing-skill-item">
                                                    <span className="missing-skill-icon">
                                                        <SkillAlertIcon />
                                                    </span>
                                                    <span>{skill}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="empty-text">
                                            Great job. No major missing skills were identified for the top match.
                                        </p>
                                    )}
                                </article>

                                <article className="prediction-panel">
                                    <div className="panel-head">
                                        <h3>Recommended Next Steps</h3>
                                    </div>

                                    <div className="next-step-list">
                                        <div className="next-step-item">
                                            <div className="next-step-number">1</div>
                                            <div>
                                                <h4>Set your career goal</h4>
                                                <p>Save the top predicted career as your main target path.</p>
                                            </div>
                                        </div>

                                        <div className="next-step-item">
                                            <div className="next-step-number">2</div>
                                            <div>
                                                <h4>Review missing skills</h4>
                                                <p>Focus on the skills you still need to strengthen.</p>
                                            </div>
                                        </div>

                                        <div className="next-step-item">
                                            <div className="next-step-number">3</div>
                                            <div>
                                                <h4>Explore roadmap and courses</h4>
                                                <p>Move to roadmap and learning resources next.</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </section>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}

function toPercent(value) {
    return Math.round((Number(value) || 0) * 100);
}

function formatSalary(min, max) {
    if (!min && !max) return "Salary not available";
    if (min && max) return `${salaryMini(min)} - ${salaryMini(max)} / year`;
    if (min) return `From ${salaryMini(min)} / year`;
    return `Up to ${salaryMini(max)} / year`;
}

function salaryMini(value) {
    if (!value) return "$0";
    return `$${Math.round(value / 1000)}k`;
}

function AvatarLetter({ name }) {
    return <span className="avatar-letter">{(name || "U").charAt(0).toUpperCase()}</span>;
}

function BrandLogo() {
    return (
        <svg className="brand-logo-svg" viewBox="0 0 64 64" fill="none" aria-hidden="true" width="42" height="42">
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

function ResourcesIcon() {
    return <SimpleIcon d="M6 4H16L20 8V20H6V4ZM16 4V8H20" strokeOnly />;
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

function ChevronDownIcon() {
    return <SimpleIcon d="M6 9L12 15L18 9" strokeOnly />;
}

function SkillAlertIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
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

export default CareerPredictionPage;