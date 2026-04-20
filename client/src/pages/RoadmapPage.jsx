import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import "../styles/RoadmapPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

function RoadmapPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";

    const [loading, setLoading] = useState(true);
    const [roadmapError, setRoadmapError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const [profileData, setProfileData] = useState(null);
    const [goalCareer, setGoalCareer] = useState(null);
    const [courses, setCourses] = useState([]);
    const [missingSkills, setMissingSkills] = useState([]);
    const [isFallbackRoadmap, setIsFallbackRoadmap] = useState(false);

    const [completedSteps, setCompletedSteps] = useState([]);
    const [updatingStepKey, setUpdatingStepKey] = useState("");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const loadRoadmap = async () => {
            try {
                setLoading(true);
                setRoadmapError("");
                setInfoMessage("");

                const profileResponse = await fetch(`${API_URL}/api/profile/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profileJson = await profileResponse.json();

                if (!profileResponse.ok) {
                    setRoadmapError(profileJson.message || "Unable to load your profile.");
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
                        setRoadmapError(
                            predictionJson.message || "No career goal found. Please set a career goal first."
                        );
                        setLoading(false);
                        return;
                    }

                    selectedCareerId = predictionJson.topCareerDetails?._id || "";
                    predictionMissingSkills = predictionJson.missingSkills || [];
                    setMissingSkills(predictionMissingSkills);
                    setIsFallbackRoadmap(true);
                    setInfoMessage(
                        "This roadmap is based on your top predicted career. Set a career goal to make it your final roadmap."
                    );
                }

                if (!selectedCareerId) {
                    setRoadmapError("No career goal or predicted career found for roadmap generation.");
                    setLoading(false);
                    return;
                }

                const careerResponse = await fetch(`${API_URL}/api/careers/${selectedCareerId}`);
                const careerJson = await careerResponse.json();

                if (!careerResponse.ok) {
                    setRoadmapError(careerJson.message || "Unable to load roadmap career details.");
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
                } else {
                    setCompletedSteps([]);
                }
            } catch (error) {
                setRoadmapError("Unable to load roadmap right now.");
            } finally {
                setLoading(false);
            }
        };

        loadRoadmap();
    }, [token, navigate]);

    const userSkills = useMemo(() => {
        return [
            ...new Set([
                ...(profileData?.technicalSkills || []),
                ...(profileData?.softSkills || []),
            ]),
        ];
    }, [profileData]);

    const skillMatchPercentage = useMemo(() => {
        const required = goalCareer?.requiredSkills || [];
        if (!required.length) return 0;

        const userSkillSet = new Set(userSkills.map((item) => String(item).toLowerCase()));
        const matched = required.filter((skill) =>
            userSkillSet.has(String(skill).toLowerCase())
        ).length;

        return Math.round((matched / required.length) * 100);
    }, [goalCareer, userSkills]);

    const roadmapSteps = useMemo(() => {
        const careerTitle = goalCareer?.title || "your target career";

        return [
            {
                key: "step-1",
                phase: "Step 1",
                title: "Understand the career foundation",
                description: `Learn what ${careerTitle} professionals do, what tools they use, and what skills are required.`,
            },
            {
                key: "step-2",
                phase: "Step 2",
                title: "Strengthen missing core skills",
                description:
                    missingSkills.length > 0
                        ? `Focus first on: ${missingSkills.slice(0, 4).join(", ")}.`
                        : "You already match most of the core required skills for this career.",
            },
            {
                key: "step-3",
                phase: "Step 3",
                title: "Complete guided learning resources",
                description:
                    courses.length > 0
                        ? "Start with the recommended courses and finish them one by one to build structured knowledge."
                        : "Course recommendations will appear once courses are available for this career.",
            },
            {
                key: "step-4",
                phase: "Step 4",
                title: "Build practical portfolio projects",
                description: `Create 2 to 3 practical projects related to ${goalCareer?.title || "your target career"} and publish them in your portfolio or GitHub.`,
            },
            {
                key: "step-5",
                phase: "Step 5",
                title: "Prepare for career opportunities",
                description:
                    "Update your CV, LinkedIn, portfolio, and begin interview preparation for internships or jobs.",
            },
        ];
    }, [goalCareer, missingSkills, courses]);

    const roadmapCompletionPercentage = useMemo(() => {
        if (!roadmapSteps.length) return 0;
        return Math.round((completedSteps.length / roadmapSteps.length) * 100);
    }, [completedSteps, roadmapSteps]);

    const suggestedProjects = useMemo(() => {
        const title = String(goalCareer?.title || "").toLowerCase();

        if (title.includes("data")) {
            return [
                "Build a sales forecasting project using real CSV data",
                "Create a dashboard for data visualization and business insights",
                "Develop a customer churn prediction model",
            ];
        }

        if (title.includes("ai")) {
            return [
                "Build an image or text classification model",
                "Create an AI assistant or recommendation prototype",
                "Deploy a simple ML model with a web interface",
            ];
        }

        if (title.includes("cyber")) {
            return [
                "Create a network monitoring and alert simulation",
                "Build a vulnerability reporting dashboard",
                "Document a mini security audit project",
            ];
        }

        if (title.includes("software")) {
            return [
                "Build a full-stack CRUD web application",
                "Create an authentication-based dashboard project",
                "Develop and deploy a REST API with frontend integration",
            ];
        }

        return [
            "Build a practical project related to your chosen career path",
            "Create one portfolio-ready case study",
            "Document your work and publish it online",
        ];
    }, [goalCareer]);

    const milestoneData = useMemo(() => {
        return [
            {
                title: "Foundation Stage",
                description: "Understand the role, tools, workflow, and required fundamentals.",
                done: roadmapCompletionPercentage >= 20,
            },
            {
                title: "Core Skills Stage",
                description: "Work on required skills and complete guided learning resources.",
                done: roadmapCompletionPercentage >= 40,
            },
            {
                title: "Project Stage",
                description: "Build real-world projects and strengthen your portfolio quality.",
                done: roadmapCompletionPercentage >= 60,
            },
            {
                title: "Job Ready Stage",
                description: "Prepare for interviews, resume building, and role-specific applications.",
                done: roadmapCompletionPercentage >= 80,
            },
        ];
    }, [roadmapCompletionPercentage]);

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
            setInfoMessage(data.message || "Roadmap step updated.");
        } catch (error) {
            setInfoMessage("Unable to update roadmap step right now.");
        } finally {
            setUpdatingStepKey("");
        }
    };

    return (
        <LoggedInShell
            activeKey="roadmap"
            title="Career Roadmap"
            subtitle="A guided path built from your selected career goal and current profile."
        >
            {infoMessage && <div className="roadmap-info-banner">{infoMessage}</div>}

            {loading ? (
                <div className="roadmap-state-card">Generating your roadmap...</div>
            ) : roadmapError ? (
                <div className="roadmap-state-card error">
                    <h2>Roadmap unavailable</h2>
                    <p>{roadmapError}</p>

                    <div className="roadmap-state-actions">
                        <button
                            type="button"
                            className="roadmap-primary-btn"
                            onClick={() => navigate("/career-prediction")}
                        >
                            Go to Career Prediction
                        </button>

                        <button
                            type="button"
                            className="roadmap-secondary-btn"
                            onClick={() => navigate("/profile-setup")}
                        >
                            Update Profile
                        </button>
                    </div>
                </div>
            ) : (
                <div className="roadmap-page-grid">
                    <section className="roadmap-hero-card">
                        <div className="roadmap-hero-copy">
                            <span className="roadmap-chip">
                                {isFallbackRoadmap ? "Suggested Roadmap" : "Selected Career Goal"}
                            </span>

                            <h2>{goalCareer?.title || "Career Goal"}</h2>

                            <p>
                                This roadmap is generated from your career goal, current skills, missing skills,
                                and available learning resources so you can follow a clearer path step by step.
                            </p>

                            <div className="roadmap-meta-row">
                                <span>{goalCareer?.industry || "Career Path"}</span>
                                <span>{formatSalary(goalCareer?.salaryMin, goalCareer?.salaryMax)}</span>
                                <span>{skillMatchPercentage}% skill match</span>
                            </div>

                            <div className="roadmap-hero-actions">
                                <button
                                    type="button"
                                    className="roadmap-primary-btn"
                                    onClick={() => navigate("/career-prediction")}
                                >
                                    Change Goal
                                </button>

                                <button
                                    type="button"
                                    className="roadmap-secondary-btn"
                                    onClick={() => navigate("/app/explore-careers")}
                                >
                                    Explore Careers
                                </button>
                            </div>
                        </div>

                        <div
                            className="roadmap-progress-ring"
                            style={{
                                background: `conic-gradient(#4f86e8 0deg, #4f86e8 ${roadmapCompletionPercentage * 3.6
                                    }deg, #e9effa ${roadmapCompletionPercentage * 3.6}deg 360deg)`,
                            }}
                        >
                            <div className="roadmap-progress-inner">
                                <span>{roadmapCompletionPercentage}%</span>
                                <small>Roadmap Progress</small>
                            </div>
                        </div>
                    </section>

                    <section className="roadmap-main-grid">
                        <article className="roadmap-panel">
                            <div className="roadmap-panel-head">
                                <h3>Step-by-Step Roadmap</h3>
                            </div>

                            <div className="roadmap-step-list">
                                {roadmapSteps.map((step, index) => {
                                    const isDone = completedSteps.includes(step.key);

                                    return (
                                        <div key={step.key} className="roadmap-step-card">
                                            <div className={`roadmap-step-index ${isDone ? "done" : "in-progress"}`}>
                                                {index + 1}
                                            </div>

                                            <div className="roadmap-step-body">
                                                <h4>{step.title}</h4>
                                                <p>{step.description}</p>
                                            </div>

                                            <label className="roadmap-step-check">
                                                <input
                                                    type="checkbox"
                                                    checked={isDone}
                                                    onChange={() => handleToggleStep(step.key)}
                                                    disabled={updatingStepKey === step.key}
                                                />
                                                <span className="roadmap-checkmark"></span>
                                                <span className="roadmap-check-label">
                                                    {updatingStepKey === step.key
                                                        ? "Saving..."
                                                        : isDone
                                                            ? "Completed"
                                                            : "Mark as complete"}
                                                </span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </article>

                        <article className="roadmap-panel">
                            <div className="roadmap-panel-head">
                                <h3>Skill Gap Summary</h3>
                            </div>

                            {missingSkills.length > 0 ? (
                                <div className="roadmap-tag-wrap">
                                    {missingSkills.map((skill) => (
                                        <span key={skill} className="roadmap-missing-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="roadmap-empty-text">
                                    No major missing skills were detected for this career goal.
                                </p>
                            )}

                            <div className="roadmap-divider" />

                            <h4 className="roadmap-subtitle">Your current strengths</h4>

                            {userSkills.length > 0 ? (
                                <div className="roadmap-tag-wrap strengths">
                                    {userSkills.map((skill) => (
                                        <span key={skill} className="roadmap-strength-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="roadmap-empty-text">
                                    Add more profile details to improve roadmap personalization.
                                </p>
                            )}
                        </article>

                        <article className="roadmap-panel">
                            <div className="roadmap-panel-head">
                                <h3>Recommended Courses</h3>
                            </div>

                            {courses.length > 0 ? (
                                <div className="roadmap-course-list">
                                    {courses.slice(0, 4).map((course) => (
                                        <div key={course._id} className="roadmap-course-card">
                                            <div>
                                                <h4>{course.title}</h4>
                                                <p>{course.provider}</p>
                                            </div>

                                            <div className="roadmap-course-right">
                                                <span className="roadmap-course-progress">
                                                    {course.progress || 0}%
                                                </span>

                                                <button
                                                    type="button"
                                                    className="roadmap-inline-btn"
                                                    onClick={() =>
                                                        course.url &&
                                                        window.open(course.url, "_blank", "noopener,noreferrer")
                                                    }
                                                >
                                                    Open
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="roadmap-empty-text">
                                    No courses are connected to this career yet.
                                </p>
                            )}
                        </article>

                        <article className="roadmap-panel">
                            <div className="roadmap-panel-head">
                                <h3>Suggested Projects</h3>
                            </div>

                            <div className="roadmap-project-list">
                                {suggestedProjects.map((project, index) => (
                                    <div key={project} className="roadmap-project-card">
                                        <div className="roadmap-project-number">{index + 1}</div>
                                        <div>
                                            <h4>Project {index + 1}</h4>
                                            <p>{project}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>

                        <article className="roadmap-panel full-width-panel">
                            <div className="roadmap-panel-head">
                                <h3>Milestone Tracker</h3>
                            </div>

                            <div className="roadmap-milestone-list">
                                {milestoneData.map((item) => (
                                    <div key={item.title} className="roadmap-milestone-card">
                                        <span className={`roadmap-milestone-dot ${item.done ? "done" : ""}`} />
                                        <div>
                                            <h4>{item.title}</h4>
                                            <p>{item.description}</p>
                                        </div>
                                    </div>
                                ))}
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

export default RoadmapPage;