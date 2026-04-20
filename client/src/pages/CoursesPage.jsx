import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInShell from "../components/LoggedInShell";
import "../styles/CoursesPage.css";

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const providerOptions = ["All Providers", "Coursera", "Udemy", "edX", "Udacity"];
const levelOptions = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const statusOptions = ["All Status", "Not Started", "In Progress", "Completed"];

function CoursesPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";

    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [infoMessage, setInfoMessage] = useState("");

    const [goalCareer, setGoalCareer] = useState(null);
    const [courses, setCourses] = useState([]);
    const [isFallbackGoal, setIsFallbackGoal] = useState(false);
    const [updatingCourseId, setUpdatingCourseId] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [providerFilter, setProviderFilter] = useState("All Providers");
    const [levelFilter, setLevelFilter] = useState("All Levels");
    const [statusFilter, setStatusFilter] = useState("All Status");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const loadCoursesPage = async () => {
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
                    setPageError(profileJson.message || "Unable to load your profile.");
                    setLoading(false);
                    return;
                }

                let selectedCareerId = "";

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
                            predictionJson.message || "No career goal found. Please set a career goal first."
                        );
                        setLoading(false);
                        return;
                    }

                    selectedCareerId = predictionJson.topCareerDetails?._id || "";
                    setIsFallbackGoal(true);
                    setInfoMessage(
                        "These courses are based on your top predicted career because no final career goal is saved yet."
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
                    setPageError(careerJson.message || "Unable to load your target career.");
                    setLoading(false);
                    return;
                }

                setGoalCareer(careerJson);

                const coursesResponse = await fetch(`${API_URL}/api/careers/${selectedCareerId}/courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const coursesJson = await coursesResponse.json();

                if (!coursesResponse.ok) {
                    setPageError(coursesJson.message || "Unable to load courses.");
                    setCourses([]);
                    setLoading(false);
                    return;
                }

                setCourses(Array.isArray(coursesJson) ? coursesJson : []);
            } catch (error) {
                setPageError("Unable to load courses right now.");
            } finally {
                setLoading(false);
            }
        };

        loadCoursesPage();
    }, [token, navigate]);

    const normalizedCourses = useMemo(() => {
        return courses.map((course) => {
            const progress = Number(course.progress) || 0;
            const completedSessions = Number(course.completedSessions) || 0;
            const totalSessions = Number(course.totalSessions) || 5;

            let status = "Not Started";
            if (progress >= 100) {
                status = "Completed";
            } else if (progress > 0) {
                status = "In Progress";
            }

            return {
                ...course,
                progress,
                completedSessions,
                totalSessions,
                status,
            };
        });
    }, [courses]);

    const filteredCourses = useMemo(() => {
        return normalizedCourses.filter((course) => {
            const matchesSearch =
                !searchTerm.trim() ||
                course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.skillsCovered || []).some((skill) =>
                    String(skill).toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesProvider =
                providerFilter === "All Providers" || course.provider === providerFilter;

            const matchesLevel =
                levelFilter === "All Levels" || course.difficulty === levelFilter;

            const matchesStatus =
                statusFilter === "All Status" || course.status === statusFilter;

            return matchesSearch && matchesProvider && matchesLevel && matchesStatus;
        });
    }, [normalizedCourses, searchTerm, providerFilter, levelFilter, statusFilter]);

    const recommendedCourses = useMemo(() => {
        return filteredCourses.filter((course) => course.progress < 100).slice(0, 6);
    }, [filteredCourses]);

    const inProgressCourses = useMemo(() => {
        return filteredCourses.filter(
            (course) => course.progress > 0 && course.progress < 100
        );
    }, [filteredCourses]);

    const completedCourses = useMemo(() => {
        return filteredCourses.filter((course) => course.progress >= 100);
    }, [filteredCourses]);

    const notStartedCourses = useMemo(() => {
        return filteredCourses.filter((course) => course.progress === 0);
    }, [filteredCourses]);

    const courseStats = useMemo(() => {
        const total = normalizedCourses.length;
        const completed = normalizedCourses.filter((course) => course.progress >= 100).length;
        const inProgress = normalizedCourses.filter(
            (course) => course.progress > 0 && course.progress < 100
        ).length;
        const average =
            total > 0
                ? Math.round(
                    normalizedCourses.reduce((sum, course) => sum + course.progress, 0) / total
                )
                : 0;

        return { total, completed, inProgress, average };
    }, [normalizedCourses]);

    const handleOpenCourse = (course) => {
        if (course.url) {
            window.open(course.url, "_blank", "noopener,noreferrer");
        }
    };

    const handleCompleteSession = async (course) => {
        if (!token) return;

        try {
            setUpdatingCourseId(course._id);

            const response = await fetch(`${API_URL}/api/courses/${course._id}/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action: "complete-session" }),
            });

            const data = await response.json();

            if (!response.ok) {
                setInfoMessage(data.message || "Unable to update course progress.");
                return;
            }

            setCourses((prev) =>
                prev.map((item) =>
                    item._id === course._id
                        ? {
                            ...item,
                            completedSessions: data.progress?.completedSessions ?? item.completedSessions,
                            totalSessions: data.progress?.totalSessions ?? item.totalSessions,
                            progress: data.progress?.progress ?? item.progress,
                            status: data.progress?.status ?? item.status,
                        }
                        : item
                )
            );

            setInfoMessage("Learning session completed.");
        } catch (error) {
            setInfoMessage("Unable to update course right now.");
        } finally {
            setUpdatingCourseId("");
        }
    };

    const handleMarkComplete = async (course) => {
        if (!token) return;

        try {
            setUpdatingCourseId(course._id);

            const response = await fetch(`${API_URL}/api/courses/${course._id}/progress`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ action: "mark-completed" }),
            });

            const data = await response.json();

            if (!response.ok) {
                setInfoMessage(data.message || "Unable to mark course complete.");
                return;
            }

            setCourses((prev) =>
                prev.map((item) =>
                    item._id === course._id
                        ? {
                            ...item,
                            completedSessions: data.progress?.completedSessions ?? item.completedSessions,
                            totalSessions: data.progress?.totalSessions ?? item.totalSessions,
                            progress: data.progress?.progress ?? item.progress,
                            status: data.progress?.status ?? item.status,
                        }
                        : item
                )
            );

            setInfoMessage("Course marked as completed.");
        } catch (error) {
            setInfoMessage("Unable to update course right now.");
        } finally {
            setUpdatingCourseId("");
        }
    };

    return (
        <LoggedInShell
            activeKey="courses"
            title="Courses"
            subtitle="Curated learning resources for your selected career goal."
        >
            {infoMessage && <div className="courses-info-banner">{infoMessage}</div>}

            {loading ? (
                <div className="courses-state-card">Loading your courses...</div>
            ) : pageError ? (
                <div className="courses-state-card error">
                    <h2>Courses unavailable</h2>
                    <p>{pageError}</p>

                    <div className="courses-state-actions">
                        <button
                            type="button"
                            className="courses-primary-btn"
                            onClick={() => navigate("/career-prediction")}
                        >
                            Go to Career Prediction
                        </button>

                        <button
                            type="button"
                            className="courses-secondary-btn"
                            onClick={() => navigate("/app/explore-careers")}
                        >
                            Explore Careers
                        </button>
                    </div>
                </div>
            ) : (
                <div className="courses-page-grid">
                    <section className="courses-hero-card">
                        <div className="courses-hero-copy">
                            <span className="courses-chip">
                                {isFallbackGoal ? "Predicted Goal Courses" : "Selected Career Goal"}
                            </span>

                            <h2>{goalCareer?.title || "Courses"}</h2>

                            <p>
                                Browse structured course recommendations from platforms like Coursera, Udemy, and
                                edX. Clicking a course opens the exact tutorial page, not the provider homepage.
                            </p>

                            <div className="courses-meta-row">
                                <span>{goalCareer?.industry || "Career Path"}</span>
                                <span>{courseStats.total} total courses</span>
                                <span>{courseStats.average}% average progress</span>
                            </div>

                            <div className="courses-hero-actions">
                                <button
                                    type="button"
                                    className="courses-primary-btn"
                                    onClick={() => navigate("/roadmap")}
                                >
                                    View Roadmap
                                </button>

                                <button
                                    type="button"
                                    className="courses-secondary-btn"
                                    onClick={() => navigate("/progress-tracker")}
                                >
                                    View Progress Tracker
                                </button>
                            </div>
                        </div>

                        <div className="courses-stats-quick">
                            <div className="courses-mini-stat">
                                <strong>{courseStats.inProgress}</strong>
                                <span>In Progress</span>
                            </div>
                            <div className="courses-mini-stat">
                                <strong>{courseStats.completed}</strong>
                                <span>Completed</span>
                            </div>
                            <div className="courses-mini-stat">
                                <strong>{notStartedCourses.length}</strong>
                                <span>Not Started</span>
                            </div>
                        </div>
                    </section>

                    <section className="courses-filter-bar">
                        <div className="courses-search-box">
                            <input
                                type="text"
                                placeholder="Search courses, providers, or skills"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <select
                            className="courses-filter-select"
                            value={providerFilter}
                            onChange={(e) => setProviderFilter(e.target.value)}
                        >
                            {providerOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            className="courses-filter-select"
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                        >
                            {levelOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            className="courses-filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            {statusOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </section>

                    <section className="courses-main-grid">
                        <article className="courses-panel full-span">
                            <div className="courses-panel-head">
                                <h3>Recommended for Your Goal</h3>
                            </div>

                            {recommendedCourses.length > 0 ? (
                                <div className="courses-card-grid">
                                    {recommendedCourses.map((course) => (
                                        <CourseCard
                                            key={course._id}
                                            course={course}
                                            updatingCourseId={updatingCourseId}
                                            onOpen={handleOpenCourse}
                                            onCompleteSession={handleCompleteSession}
                                            onComplete={handleMarkComplete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="courses-empty-text">No courses match your current filters.</p>
                            )}
                        </article>

                        <article className="courses-panel">
                            <div className="courses-panel-head">
                                <h3>In Progress</h3>
                            </div>

                            {inProgressCourses.length > 0 ? (
                                <div className="courses-compact-list">
                                    {inProgressCourses.map((course) => (
                                        <CompactCourseRow
                                            key={course._id}
                                            course={course}
                                            updatingCourseId={updatingCourseId}
                                            onOpen={handleOpenCourse}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="courses-empty-text">No courses are currently in progress.</p>
                            )}
                        </article>

                        <article className="courses-panel">
                            <div className="courses-panel-head">
                                <h3>Completed</h3>
                            </div>

                            {completedCourses.length > 0 ? (
                                <div className="courses-compact-list">
                                    {completedCourses.map((course) => (
                                        <CompactCourseRow
                                            key={course._id}
                                            course={course}
                                            updatingCourseId={updatingCourseId}
                                            onOpen={handleOpenCourse}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="courses-empty-text">No completed courses yet.</p>
                            )}
                        </article>
                    </section>
                </div>
            )}
        </LoggedInShell>
    );
}

function CourseCard({ course, updatingCourseId, onOpen, onCompleteSession, onComplete }) {
    const isUpdating = updatingCourseId === course._id;

    return (
        <div className="course-card">
            <div className="course-card-top">
                <span className={`course-provider-badge ${providerClassName(course.provider)}`}>
                    {course.provider || "Provider"}
                </span>
                <span className={`course-status-badge ${statusClassName(course.status)}`}>
                    {course.status}
                </span>
            </div>

            <h4>{course.title}</h4>
            <p className="course-card-description">
                {course.description || "Structured learning resource for your selected career goal."}
            </p>

            <div className="course-card-meta">
                <span>{course.difficulty || "Beginner"}</span>
                <span>{formatDuration(course.durationHours)}</span>
            </div>

            <div className="course-tag-wrap">
                {(course.skillsCovered || []).slice(0, 4).map((skill) => (
                    <span key={skill} className="course-skill-tag">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="course-session-row">
                <span className="course-session-label">Sessions</span>
                <strong>
                    {course.completedSessions || 0}/{course.totalSessions || 5}
                </strong>
            </div>

            <div className="course-progress-wrap">
                <div className="course-progress-bar">
                    <div
                        className="course-progress-fill"
                        style={{ width: `${course.progress || 0}%` }}
                    />
                </div>
                <span className="course-progress-text">{course.progress || 0}%</span>
            </div>

            <div className="course-card-actions">
                <button
                    type="button"
                    className="course-open-btn"
                    onClick={() => onOpen(course)}
                    disabled={isUpdating}
                >
                    Open Course
                </button>

                <button
                    type="button"
                    className="course-session-btn"
                    onClick={() => onCompleteSession(course)}
                    disabled={isUpdating || course.progress >= 100}
                >
                    {course.progress >= 100 ? "All Sessions Done" : "Complete Session"}
                </button>

                <button
                    type="button"
                    className="course-complete-btn"
                    onClick={() => onComplete(course)}
                    disabled={isUpdating || course.progress >= 100}
                >
                    {course.progress >= 100 ? "Completed" : "Mark Completed"}
                </button>
            </div>
        </div>
    );
}

function CompactCourseRow({ course, updatingCourseId, onOpen }) {
    return (
        <div className="compact-course-row">
            <div className="compact-course-left">
                <h4>{course.title}</h4>
                <p>
                    {course.provider} · {course.difficulty || "Beginner"} · Sessions{" "}
                    {course.completedSessions || 0}/{course.totalSessions || 5}
                </p>
            </div>

            <div className="compact-course-right">
                <span className="compact-course-progress">{course.progress || 0}%</span>
                <button
                    type="button"
                    className="compact-course-btn"
                    onClick={() => onOpen(course)}
                    disabled={updatingCourseId === course._id}
                >
                    Open
                </button>
            </div>
        </div>
    );
}

function providerClassName(provider = "") {
    const value = provider.toLowerCase();
    if (value.includes("coursera")) return "coursera";
    if (value.includes("udemy")) return "udemy";
    if (value.includes("edx")) return "edx";
    if (value.includes("udacity")) return "udacity";
    return "default";
}

function statusClassName(status = "") {
    const value = status.toLowerCase();
    if (value.includes("completed")) return "completed";
    if (value.includes("progress")) return "progress";
    return "not-started";
}

function formatDuration(hours) {
    const value = Number(hours) || 0;
    if (!value) return "Self-paced";
    if (value < 10) return `${value} hrs`;
    return `${value} hours`;
}

export default CoursesPage;