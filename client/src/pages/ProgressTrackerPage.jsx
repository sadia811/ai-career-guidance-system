import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import "../styles/ProgressTrackerPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function ProgressTrackerPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const [profileData, setProfileData] = useState(null);
    const [goalCareer, setGoalCareer] = useState(null);
    const [courses, setCourses] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [roadmapProgressDoc, setRoadmapProgressDoc] = useState(null);
    const [isFallbackGoal, setIsFallbackGoal] = useState(false);

    const [updatingStepKey, setUpdatingStepKey] = useState("");
    const [updatingCourseId, setUpdatingCourseId] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const loadTracker = async () => {
            try {
                setLoading(true);
                setPageError("");
                setInfoMessage("");

                const profileResponse = await fetch(`${API_URL}/api/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profileJson = await profileResponse.json();

                if (!profileResponse.ok) {
                    setPageError(profileJson.message || "Unable to load progress tracker.");
                    setLoading(false);
                    return;
                }

                setProfileData(profileJson);

                let selectedCareerId = "";
                let predictionMissingSkills = [];

                if (profileJson?.careerGoal && typeof profileJson.careerGoal === "object") {
                    selectedCareerId = profileJson.careerGoal._id || "";
                } else if (profileJson?.careerGoal && typeof profileJson.careerGoal === "string") {
                    selectedCareerId = profileJson.careerGoal;
                }

                if (!selectedCareerId) {
                    const predictionResponse = await fetch(`${API_URL}/api/prediction/me`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const predictionJson = await predictionResponse.json();

                    if (!predictionResponse.ok) {
                        setPageError(
                            predictionJson.message || "No career goal found. Please set a goal first."
                        );
                        setLoading(false);
                        return;
                    }

                    selectedCareerId = predictionJson.topCareerDetails?._id || "";
                    predictionMissingSkills = predictionJson.missingSkills || [];
                    setMissingSkills(predictionMissingSkills);
                    setIsFallbackGoal(true);
                    setInfoMessage(
                        "This tracker is using your top predicted career because no final career goal is saved yet."
                    );
                }

                if (!selectedCareerId) {
                    setPageError("No career goal or predicted career found.");
                    setLoading(false);
                    return;
                }

                const careerResponse = await fetch(`${API_URL}/api/careers/${selectedCareerId}`);
                const careerJson = await careerResponse.json();

                if (!careerResponse.ok) {
                    setPageError(careerJson.message || "Unable to load target career.");
                    setLoading(false);
                    return;
                }

                setGoalCareer(careerJson);

                const userSkillSet = new Set(
                    [
                        ...(profileJson?.technicalSkills || []),
                        ...(profileJson?.softSkills || []),
                    ].map((item) => String(item).toLowerCase())
                );

                const calculatedMissingSkills = (careerJson.requiredSkills || []).filter(
                    (skill) => !userSkillSet.has(String(skill).toLowerCase())
                );

                setMissingSkills(
                    predictionMissingSkills.length > 0 ? predictionMissingSkills : calculatedMissingSkills
                );

                const coursesResponse = await fetch(`${API_URL}/api/careers/${selectedCareerId}/courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const coursesJson = await coursesResponse.json();

                if (coursesResponse.ok) {
                    setCourses(Array.isArray(coursesJson) ? coursesJson : []);
                } else {
                    setCourses([]);
                }

                const progressResponse = await fetch(
                    `${API_URL}/api/roadmap/progress/${selectedCareerId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const progressJson = await progressResponse.json();

                if (progressResponse.ok) {
                    setCompletedSteps(progressJson.progress?.completedSteps || []);
                    setRoadmapProgressDoc(progressJson.progress || null);
                } else {
                    setCompletedSteps([]);
                    setRoadmapProgressDoc(null);
                }
            } catch (error) {
                setPageError("Unable to load progress tracker right now.");
            } finally {
                setLoading(false);
            }
        };

        loadTracker();
    }, [token, navigate]);

    const userSkills = useMemo(() => {
        return [
            ...new Set([
                ...(profileData?.technicalSkills || []),
                ...(profileData?.softSkills || []),
            ]),
        ];
    }, [profileData]);

    const matchedSkills = useMemo(() => {
        const required = goalCareer?.requiredSkills || [];
        const userSkillSet = new Set(userSkills.map((item) => String(item).toLowerCase()));

        return required.filter((skill) =>
            userSkillSet.has(String(skill).toLowerCase())
        );
    }, [goalCareer, userSkills]);

    const skillMatchPercentage = useMemo(() => {
        const required = goalCareer?.requiredSkills || [];
        if (!required.length) return 0;
        return Math.round((matchedSkills.length / required.length) * 100);
    }, [goalCareer, matchedSkills]);

    const roadmapSteps = useMemo(() => {
        const careerTitle = goalCareer?.title || "your target career";

        return [
            {
                key: "step-1",
                title: "Understand the career foundation",
                description: `Learn what ${careerTitle} professionals do, what tools they use, and what skills are required.`,
            },
            {
                key: "step-2",
                title: "Strengthen missing core skills",
                description:
                    missingSkills.length > 0
                        ? `Focus first on: ${missingSkills.slice(0, 4).join(", ")}.`
                        : "You already match most of the required core skills for this career.",
            },
            {
                key: "step-3",
                title: "Complete guided learning resources",
                description:
                    courses.length > 0
                        ? "Finish the recommended courses one by one to build structured knowledge."
                        : "Course recommendations will appear once they are connected.",
            },
            {
                key: "step-4",
                title: "Build practical portfolio projects",
                description: `Create 2 to 3 portfolio-ready projects related to ${careerTitle}.`,
            },
            {
                key: "step-5",
                title: "Prepare for opportunities",
                description:
                    "Update your CV, LinkedIn, GitHub portfolio, and start interview preparation.",
            },
        ];
    }, [goalCareer, missingSkills, courses]);

    const roadmapProgressPercentage = useMemo(() => {
        if (!roadmapSteps.length) return 0;
        return Math.round((completedSteps.length / roadmapSteps.length) * 100);
    }, [completedSteps, roadmapSteps]);

    const averageCourseProgress = useMemo(() => {
        if (!courses.length) return 0;
        const total = courses.reduce((sum, course) => sum + (Number(course.progress) || 0), 0);
        return Math.round(total / courses.length);
    }, [courses]);

    const completedCoursesCount = useMemo(() => {
        return courses.filter((course) => Number(course.progress) >= 100).length;
    }, [courses]);

    const inProgressCoursesCount = useMemo(() => {
        return courses.filter((course) => {
            const progress = Number(course.progress) || 0;
            return progress > 0 && progress < 100;
        }).length;
    }, [courses]);

    const overallProgressPercentage = useMemo(() => {
        return Math.round(
            roadmapProgressPercentage * 0.4 +
            skillMatchPercentage * 0.35 +
            averageCourseProgress * 0.25
        );
    }, [roadmapProgressPercentage, skillMatchPercentage, averageCourseProgress]);

    const milestoneItems = useMemo(() => {
        return [
            {
                title: "Career goal selected",
                description: "A target career path has been chosen for tracking.",
                done: Boolean(goalCareer?._id),
            },
            {
                title: "Skill foundation built",
                description: "At least half of the required skills are already matched.",
                done: skillMatchPercentage >= 50,
            },
            {
                title: "Roadmap halfway completed",
                description: "At least half of the roadmap steps are done.",
                done: roadmapProgressPercentage >= 50,
            },
            {
                title: "Learning progress established",
                description: "Courses have been started and are moving forward.",
                done: averageCourseProgress >= 25,
            },
            {
                title: "Career-ready stage",
                description: "You are approaching strong readiness for applications.",
                done: overallProgressPercentage >= 80,
            },
        ];
    }, [
        goalCareer,
        skillMatchPercentage,
        roadmapProgressPercentage,
        averageCourseProgress,
        overallProgressPercentage,
    ]);

    const handleToggleStep = async (stepKey) => {
        if (!goalCareer?._id || !token) return;

        const isCompleted = completedSteps.includes(stepKey);

        try {
            setUpdatingStepKey(stepKey);

            const response = await fetch(
                `${API_URL}/api/roadmap/progress/${goalCareer._id}/step`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        stepKey,
                        completed: !isCompleted,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setInfoMessage(data.message || "Failed to update roadmap step.");
                return;
            }

            setCompletedSteps(data.progress?.completedSteps || []);
            setRoadmapProgressDoc(data.progress || null);
            setInfoMessage(data.message || "Roadmap step updated.");
        } catch (error) {
            setInfoMessage("Unable to update roadmap step right now.");
        } finally {
            setUpdatingStepKey("");
        }
    };

    const handleOpenCourse = async (course) => {
        if (!token) return;

        const currentProgress = Number(course.progress) || 0;
        const nextProgress = currentProgress === 0 ? 5 : currentProgress;

        try {
            setUpdatingCourseId(course._id);

            const response = await fetch(`${API_URL}/api/courses/${course._id}/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ progress: nextProgress }),
            });

            const data = await response.json();

            if (response.ok) {
                setCourses((prev) =>
                    prev.map((item) =>
                        item._id === course._id
                            ? {
                                ...item,
                                progress: data.progress?.progress ?? item.progress,
                                status: data.progress?.status ?? item.status,
                            }
                            : item
                    )
                );
            }

            if (course.url) {
                window.open(course.url, "_blank", "noopener,noreferrer");
            }

            if (!response.ok) {
                setInfoMessage(data.message || "Unable to update course progress.");
            }
        } catch (error) {
            setInfoMessage("Unable to open course right now.");
        } finally {
            setUpdatingCourseId("");
        }
    };

    return (
        <LoggedInShell
            activeKey="progress"
            title="Progress Tracker"
            subtitle="Track your career growth, roadmap completion, skills, and learning progress."
        >
            {infoMessage && <div className="tracker-info-banner">{infoMessage}</div>}

            {loading ? (
                <div className="tracker-state-card">Loading your progress tracker...</div>
            ) : pageError ? (
                <div className="tracker-state-card error">
                    <h2>Progress tracker unavailable</h2>
                    <p>{pageError}</p>

                    <div className="tracker-state-actions">
                        <button
                            type="button"
                            className="tracker-primary-btn"
                            onClick={() => navigate("/career-prediction")}
                        >
                            Go to Career Prediction
                        </button>

                        <button
                            type="button"
                            className="tracker-secondary-btn"
                            onClick={() => navigate("/profile-setup")}
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div className="tracker-page-grid">
                    <section className="tracker-hero-card">
                        <div className="tracker-hero-copy">
                            <span className="tracker-chip">
                                {isFallbackGoal ? "Predicted Goal Tracking" : "Selected Career Goal"}
                            </span>

                            <h2>{goalCareer?.title || "Career Goal"}</h2>

                            <p>
                                This page tracks how far you have progressed toward your selected career path
                                using roadmap completion, skill match, and course activity.
                            </p>

                            <div className="tracker-meta-row">
                                <span>{goalCareer?.industry || "Career Path"}</span>
                                <span>{formatSalary(goalCareer?.salaryMin, goalCareer?.salaryMax)}</span>
                                <span>{skillMatchPercentage}% skill match</span>
                            </div>

                            <div className="tracker-hero-actions">
                                <button
                                    type="button"
                                    className="tracker-primary-btn"
                                    onClick={() => navigate("/roadmap")}
                                >
                                    View Roadmap
                                </button>

                                <button
                                    type="button"
                                    className="tracker-secondary-btn"
                                    onClick={() => navigate("/app/explore-careers")}
                                >
                                    Explore Careers
                                </button>
                            </div>
                        </div>

                        <div
                            className="tracker-progress-ring"
                            style={{
                                background: `conic-gradient(#4f86e8 0deg, #4f86e8 ${overallProgressPercentage * 3.6
                                    }deg, #e9effa ${overallProgressPercentage * 3.6}deg 360deg)`,
                            }}
                        >
                            <div className="tracker-progress-inner">
                                <span>{overallProgressPercentage}%</span>
                                <small>Overall Progress</small>
                            </div>
                        </div>
                    </section>

                    <section className="tracker-stats-grid">
                        <article className="tracker-stat-card">
                            <span className="tracker-stat-label">Roadmap Progress</span>
                            <strong>{roadmapProgressPercentage}%</strong>
                            <p>
                                {completedSteps.length} of {roadmapSteps.length} steps completed
                            </p>
                        </article>

                        <article className="tracker-stat-card">
                            <span className="tracker-stat-label">Skill Match</span>
                            <strong>{skillMatchPercentage}%</strong>
                            <p>
                                {matchedSkills.length} matched / {(goalCareer?.requiredSkills || []).length} required
                            </p>
                        </article>

                        <article className="tracker-stat-card">
                            <span className="tracker-stat-label">Course Progress</span>
                            <strong>{averageCourseProgress}%</strong>
                            <p>
                                {completedCoursesCount} completed · {inProgressCoursesCount} in progress
                            </p>
                        </article>

                        <article className="tracker-stat-card">
                            <span className="tracker-stat-label">Missing Skills</span>
                            <strong>{missingSkills.length}</strong>
                            <p>Still to strengthen for this career goal</p>
                        </article>
                    </section>

                    <section className="tracker-main-grid">
                        <article className="tracker-panel">
                            <div className="tracker-panel-head">
                                <h3>Roadmap Step Status</h3>
                            </div>

                            <div className="tracker-roadmap-list">
                                {roadmapSteps.map((step, index) => {
                                    const isDone = completedSteps.includes(step.key);

                                    return (
                                        <div key={step.key} className="tracker-roadmap-card">
                                            <div className={`tracker-step-index ${isDone ? "done" : "active"}`}>
                                                {index + 1}
                                            </div>

                                            <div className="tracker-roadmap-body">
                                                <h4>{step.title}</h4>
                                                <p>{step.description}</p>
                                            </div>

                                            <label className="tracker-checkbox-wrap">
                                                <input
                                                    type="checkbox"
                                                    checked={isDone}
                                                    onChange={() => handleToggleStep(step.key)}
                                                    disabled={updatingStepKey === step.key}
                                                />
                                                <span className="tracker-checkbox-mark"></span>
                                                <span className="tracker-checkbox-label">
                                                    {updatingStepKey === step.key
                                                        ? "Saving..."
                                                        : isDone
                                                            ? "Completed"
                                                            : "Mark complete"}
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>

                        <article className="tracker-panel">
                            <div className="tracker-panel-head">
                                <h3>Course Progress</h3>
                            </div>

                            {courses.length > 0 ? (
                                <div className="tracker-course-list">
                                    {courses.map((course) => (
                                        <div key={course._id} className="tracker-course-card">
                                            <div className="tracker-course-left">
                                                <h4>{course.title}</h4>
                                                <p>{course.provider}</p>

                                                <div className="tracker-course-bar">
                                                    <div
                                                        className="tracker-course-fill"
                                                        style={{ width: `${course.progress || 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="tracker-course-right">
                                                <strong>{course.progress || 0}%</strong>
                                                <button
                                                    type="button"
                                                    className="tracker-inline-btn"
                                                    onClick={() => handleOpenCourse(course)}
                                                    disabled={updatingCourseId === course._id}
                                                >
                                                    {updatingCourseId === course._id
                                                        ? "Opening..."
                                                        : course.progress > 0
                                                            ? "Continue"
                                                            : "Start"}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="tracker-empty-text">
                                    No courses are connected to this goal yet.
                                </p>
                            )}
                        </article>

                        <article className="tracker-panel">
                            <div className="tracker-panel-head">
                                <h3>Skills Overview</h3>
                            </div>

                            <div className="tracker-skill-section">
                                <h4>Matched Skills</h4>
                                {matchedSkills.length > 0 ? (
                                    <div className="tracker-tag-wrap">
                                        {matchedSkills.map((skill) => (
                                            <span key={skill} className="tracker-match-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="tracker-empty-text">No required skills matched yet.</p>
                                )}
                            </div>

                            <div className="tracker-divider" />

                            <div className="tracker-skill-section">
                                <h4>Missing Skills</h4>
                                {missingSkills.length > 0 ? (
                                    <div className="tracker-tag-wrap">
                                        {missingSkills.map((skill) => (
                                            <span key={skill} className="tracker-missing-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="tracker-empty-text">No major skill gaps detected.</p>
                                )}
                            </div>

                            <div className="tracker-divider" />

                            <div className="tracker-skill-section">
                                <h4>Your Current Strengths</h4>
                                {userSkills.length > 0 ? (
                                    <div className="tracker-tag-wrap">
                                        {userSkills.map((skill) => (
                                            <span key={skill} className="tracker-strength-tag">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="tracker-empty-text">No strengths added to profile yet.</p>
                                )}
                            </div>
                        </article>

                        <article className="tracker-panel">
                            <div className="tracker-panel-head">
                                <h3>Milestone Tracker</h3>
                            </div>

                            <div className="tracker-milestone-list">
                                {milestoneItems.map((item) => (
                                    <div key={item.title} className="tracker-milestone-card">
                                        <span className={`tracker-milestone-dot ${item.done ? "done" : ""}`} />
                                        <div>
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="tracker-divider" />

                            <div className="tracker-snapshot-box">
                                <h4>Recent Snapshot</h4>
                                <p>
                                    Goal: <strong>{goalCareer?.title || "Not set"}</strong>
                                </p>
                                <p>
                                    Last roadmap update:{" "}
                                    <strong>{formatDateTime(roadmapProgressDoc?.updatedAt || roadmapProgressDoc?.lastViewedAt)}</strong>
                                </p>
                                <p>
                                    Profile major: <strong>{profileData?.major || "Not provided"}</strong>
                                </p>
                            </div>
                        </article>
                    </section>
                </div>
            )}
        </LoggedInShell>
    );
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

function formatDateTime(value) {
    if (!value) return "Not available";
    try {
        return new Date(value).toLocaleString();
    } catch {
        return "Not available";
    }
}

export default ProgressTrackerPage;