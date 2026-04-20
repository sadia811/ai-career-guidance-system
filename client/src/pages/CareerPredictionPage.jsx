import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import "../styles/CareerPredictionPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function CareerPredictionPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";

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
            } catch {
                setPredictionError("Unable to load career prediction right now.");
                setPredictionData(null);
            } finally {
                setLoadingPrediction(false);
            }
        };

        fetchPrediction();
    }, [token, navigate]);

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
        } catch {
            setPageMessage("Unable to set career goal right now.");
        } finally {
            setSettingGoal(false);
        }
    };

    return (
        <LoggedInShell
            activeKey="prediction"
            title="Career Prediction"
            subtitle="AI-based career suggestions from your saved profile."
        >
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
        </LoggedInShell>
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

function SkillAlertIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
    );
}

export default CareerPredictionPage;