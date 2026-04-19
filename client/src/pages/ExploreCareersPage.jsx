import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreCareersPage.css";

const [draftSearch, setDraftSearch] = useState("");
const [searchTerm, setSearchTerm] = useState("");

const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon />, to: "/dashboard" },
    { key: "profile", label: "Profile", icon: <ProfileIcon />, to: "/profile-setup" },
    { key: "prediction", label: "Career Prediction", icon: <PredictionIcon />, comingSoon: true },
    { key: "explore", label: "Explore Careers", icon: <BagIcon />, to: "/app/explore-careers" },
    { key: "roadmap", label: "Roadmap", icon: <RoadmapIcon />, comingSoon: true },
    { key: "progress", label: "Progress Tracker", icon: <ProgressIcon />, comingSoon: true },
    { key: "courses", label: "Courses", icon: <CoursesIcon />, comingSoon: true },
    { key: "resources", label: "Resources", icon: <ResourcesIcon />, comingSoon: true },
    { key: "logout", label: "Logout", icon: <LogoutIcon />, action: "logout" },
];

const industryOptions = ["All Industries", "Data", "AI", "Security", "Software"];
const experienceOptions = ["All Levels", "Beginner", "Intermediate", "Advanced"];
const salaryOptions = ["All Ranges", "Under $90k", "$90k - $120k", "$120k+"];

function ExploreCareersPage() {
    const navigate = useNavigate();
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const token = storedUser?.token || "";
    const userName = storedUser?.name || "User";

    const [pageMessage, setPageMessage] = useState("");
    const [savedOnly, setSavedOnly] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [draftIndustry, setDraftIndustry] = useState("All Industries");
    const [draftExperience, setDraftExperience] = useState("All Levels");
    const [draftSalary, setDraftSalary] = useState("All Ranges");

    const [industryFilter, setIndustryFilter] = useState("All Industries");
    const [experienceFilter, setExperienceFilter] = useState("All Levels");
    const [salaryFilter, setSalaryFilter] = useState("All Ranges");

    const [careers, setCareers] = useState([]);
    const [loadingCareers, setLoadingCareers] = useState(true);
    const [careerError, setCareerError] = useState("");

    const [savedCareerIds, setSavedCareerIds] = useState([]);
    const [loadingSavedCareers, setLoadingSavedCareers] = useState(true);

    const [selectedCareerId, setSelectedCareerId] = useState("");
    const [selectedCareerDetails, setSelectedCareerDetails] = useState(null);
    const [loadingCareerDetails, setLoadingCareerDetails] = useState(false);

    const [courses, setCourses] = useState([]);
    const [loadingCourses, setLoadingCourses] = useState(false);
    const [coursesError, setCoursesError] = useState("");

    const [activeTab, setActiveTab] = useState("Overview");

    useEffect(() => {
        if (!token) {
            navigate("/auth");
        }
    }, [token, navigate]);

    useEffect(() => {
        const fetchSavedCareers = async () => {
            if (!token) return;

            try {
                setLoadingSavedCareers(true);

                const response = await fetch(`${API_URL}/api/careers/saved/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setSavedCareerIds([]);
                    return;
                }

                setSavedCareerIds((data || []).map((career) => career._id));
            } catch (error) {
                setSavedCareerIds([]);
            } finally {
                setLoadingSavedCareers(false);
            }
        };

        fetchSavedCareers();
    }, [token]);

    useEffect(() => {
        const fetchCareers = async () => {
            try {
                setLoadingCareers(true);
                setCareerError("");

                const params = new URLSearchParams();

                if (searchTerm.trim()) params.set("search", searchTerm.trim());
                if (industryFilter !== "All Industries") params.set("industry", industryFilter);
                if (experienceFilter !== "All Levels") params.set("experience", experienceFilter);
                if (salaryFilter !== "All Ranges") params.set("salaryRange", salaryFilter);

                const response = await fetch(`${API_URL}/api/careers?${params.toString()}`);
                const data = await response.json();

                if (!response.ok) {
                    setCareerError(data.message || "Failed to load careers.");
                    setCareers([]);
                    return;
                }

                setCareers(Array.isArray(data) ? data : []);
            } catch (error) {
                setCareerError("Unable to load careers right now.");
                setCareers([]);
            } finally {
                setLoadingCareers(false);
            }
        };

        const timeoutId = setTimeout(fetchCareers, 250);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, industryFilter, experienceFilter, salaryFilter]);

    const displayedCareers = useMemo(() => {
        if (!savedOnly) return careers;
        return careers.filter((career) => savedCareerIds.includes(String(career._id)));
    }, [careers, savedOnly, savedCareerIds]);

    useEffect(() => {
        if (!displayedCareers.length) {
            setSelectedCareerId("");
            setSelectedCareerDetails(null);
            setCourses([]);
            return;
        }

        const stillVisible = displayedCareers.some((career) => career._id === selectedCareerId);

        if (!stillVisible) {
            setSelectedCareerId(displayedCareers[0]._id);
            setActiveTab("Overview");
        }
    }, [displayedCareers, selectedCareerId]);

    useEffect(() => {
        const fetchSelectedCareerDetails = async () => {
            if (!selectedCareerId) return;

            try {
                setLoadingCareerDetails(true);

                const response = await fetch(`${API_URL}/api/careers/${selectedCareerId}`);
                const data = await response.json();

                if (!response.ok) {
                    setSelectedCareerDetails(null);
                    return;
                }

                setSelectedCareerDetails(data);
            } catch (error) {
                setSelectedCareerDetails(null);
            } finally {
                setLoadingCareerDetails(false);
            }
        };

        fetchSelectedCareerDetails();
    }, [selectedCareerId]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedCareerId || !token) return;

            try {
                setLoadingCourses(true);
                setCoursesError("");

                const response = await fetch(`${API_URL}/api/careers/${selectedCareerId}/courses`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();

                if (!response.ok) {
                    setCoursesError(data.message || "Failed to load courses.");
                    setCourses([]);
                    return;
                }

                setCourses(Array.isArray(data) ? data : []);
            } catch (error) {
                setCoursesError("Unable to load courses right now.");
                setCourses([]);
            } finally {
                setLoadingCourses(false);
            }
        };

        fetchCourses();
    }, [selectedCareerId, token]);

    const selectedCareer =
        selectedCareerDetails ||
        displayedCareers.find((career) => career._id === selectedCareerId) ||
        null;

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

    const handleApplyFilters = () => {
        setSearchTerm(draftSearch);
        setIndustryFilter(draftIndustry);
        setExperienceFilter(draftExperience);
        setSalaryFilter(draftSalary);
        setPageMessage("Filters applied.");
    };

    const handleRemoveFilters = () => {
        setDraftSearch("");
        setSearchTerm("");
        setDraftIndustry("All Industries");
        setDraftExperience("All Levels");
        setDraftSalary("All Ranges");
        setIndustryFilter("All Industries");
        setExperienceFilter("All Levels");
        setSalaryFilter("All Ranges");
        setSavedOnly(false);
        setPageMessage("Filters removed.");
    };

    const handleToggleSavedView = () => {
        setSavedOnly((prev) => !prev);
    };

    const handleToggleSaveCareer = async (careerId) => {
        if (!token) {
            navigate("/auth");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/careers/${careerId}/save`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                setPageMessage(data.message || "Failed to update saved career.");
                return;
            }

            setSavedCareerIds((data.savedCareerIds || []).map((id) => String(id)));
            setPageMessage(data.message || "Saved career updated.");
        } catch (error) {
            setPageMessage("Unable to save career right now.");
        }
    };

    const handleSetCareerGoal = async () => {
        if (!selectedCareer?._id || !token) return;

        try {
            const response = await fetch(`${API_URL}/api/careers/${selectedCareer._id}/set-goal`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            setPageMessage(
                response.ok
                    ? data.message || "Career goal updated."
                    : data.message || "Failed to set career goal."
            );
        } catch (error) {
            setPageMessage("Unable to set career goal right now.");
        }
    };

    const handleStartCourse = async (course) => {
        if (!token) {
            navigate("/auth");
            return;
        }

        const nextProgress = course.progress === 0 ? 5 : course.progress;

        try {
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
                                progress: data.progress.progress,
                                status: data.progress.status,
                            }
                            : item
                    )
                );
            }

            if (course.url) {
                window.open(course.url, "_blank", "noopener,noreferrer");
            }

            setPageMessage(response.ok ? `${course.title} opened.` : data.message || "Could not start course.");
        } catch (error) {
            setPageMessage("Unable to update course progress right now.");
        }
    };

    const handleViewAll = () => {
        setSavedOnly(false);
        handleRemoveFilters();
    };

    const selectedCareerTabItems = getActiveTabItems(selectedCareer, activeTab);

    return (
        <div className="explore-page">
            <aside className="explore-sidebar">
                <div className="explore-brand">
                    <BrandLogo />
                    <span>Career Guidance</span>
                </div>

                <nav className="explore-sidebar-nav">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            className={`sidebar-item ${item.key === "explore" ? "active" : ""}`}
                            onClick={() => handleSidebarClick(item)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="explore-content-wrap">
                <header className="explore-topbar">
                    <div className="topbar-search">
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search careers, skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        type="button"
                        className={`saved-btn ${savedOnly ? "active" : ""}`}
                        onClick={handleToggleSavedView}
                    >
                        <HeartIcon />
                        <span>Saved</span>
                        {!loadingSavedCareers && savedCareerIds.length > 0 && (
                            <span className="saved-count-badge">{savedCareerIds.length}</span>
                        )}
                    </button>

                    <button type="button" className="icon-btn notification-btn">
                        <BellIcon />
                        <span className="notif-badge">3</span>
                    </button>

                    <button type="button" className="profile-chip" onClick={() => navigate("/dashboard")}>
                        <AvatarLetter name={userName} />
                        <span>{userName}</span>
                        <ChevronDownIcon />
                    </button>
                </header>

                <main className="explore-main">
                    <section className="page-heading-block">
                        <h1>Career Exploration</h1>
                        <p>Discover career paths, skills, salary insights and job trends.</p>
                    </section>

                    <section className="filter-bar">
                        <div className="filter-search">
                            <SearchIcon />
                            <input
                                type="text"
                                placeholder="Search careers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <SearchSmallIcon />
                        </div>

                        <select
                            className="filter-select"
                            value={draftIndustry}
                            onChange={(e) => setDraftIndustry(e.target.value)}
                        >
                            {industryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={draftExperience}
                            onChange={(e) => setDraftExperience(e.target.value)}
                        >
                            {experienceOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <select
                            className="filter-select"
                            value={draftSalary}
                            onChange={(e) => setDraftSalary(e.target.value)}
                        >
                            {salaryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        <button type="button" className="apply-filter-btn" onClick={handleApplyFilters}>
                            <FilterTuneIcon />
                            <span>Apply Filters</span>
                        </button>

                        <button type="button" className="remove-filter-btn" onClick={handleRemoveFilters}>
                            Remove Filters
                        </button>
                    </section>

                    {pageMessage && <div className="page-message-banner">{pageMessage}</div>}

                    <section className="popular-careers-block">
                        <div className="section-title-row">
                            <h2>{savedOnly ? "Saved Careers" : "Popular Career Paths"}</h2>

                            <button type="button" className="view-all-link" onClick={handleViewAll}>
                                <span>View All</span>
                                <ArrowRightIcon />
                            </button>
                        </div>

                        {loadingCareers ? (
                            <div className="explore-empty-state">Loading careers...</div>
                        ) : careerError ? (
                            <div className="explore-empty-state error-state">{careerError}</div>
                        ) : displayedCareers.length === 0 ? (
                            <div className="explore-empty-state">
                                No careers match your current search or filter options.
                            </div>
                        ) : (
                            <div className="career-grid">
                                {displayedCareers.map((career) => {
                                    const isSaved = savedCareerIds.includes(String(career._id));

                                    return (
                                        <article
                                            key={career._id}
                                            className={`career-tile ${selectedCareer?._id === career._id ? "selected" : ""}`}
                                            onClick={() => {
                                                setSelectedCareerId(career._id);
                                                setActiveTab("Overview");
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" || e.key === " ") {
                                                    setSelectedCareerId(career._id);
                                                    setActiveTab("Overview");
                                                }
                                            }}
                                        >
                                            <div className="career-tile-top">
                                                <div className="career-tile-icon">{getCareerIcon(career.title)}</div>

                                                <button
                                                    type="button"
                                                    className={`bookmark-chip ${getBookmarkColor(career.title)} ${isSaved ? "saved" : ""}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSaveCareer(career._id);
                                                    }}
                                                >
                                                    <BookmarkIcon />
                                                </button>
                                            </div>

                                            <h3>{career.title}</h3>

                                            <p className="career-money">
                                                <span className="money-symbol">$</span>{" "}
                                                {formatSalary(career.salaryMin, career.salaryMax)}
                                            </p>

                                            <div className="skill-pill-wrap">
                                                {(career.requiredSkills || []).slice(0, 3).map((skill) => (
                                                    <span key={skill} className="skill-pill">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>

                                            <span className="view-details-btn">
                                                <span>View Details</span>
                                                <ArrowRightIcon />
                                            </span>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {selectedCareer && (
                        <section className="details-courses-grid">
                            <article className="career-details-card">
                                <div className="details-header">
                                    <div className="details-left">
                                        <button type="button" className="back-inline-btn">
                                            <ChevronLeftIcon />
                                        </button>
                                        <span className="details-title">Career Details</span>
                                        <span className="details-career-icon">{getCareerIcon(selectedCareer.title)}</span>
                                        <span className="details-career-name">{selectedCareer.title}</span>
                                    </div>
                                </div>

                                <div className="details-tabs">
                                    {["Overview", "Skills", "Job Roles", "Companies"].map((tab) => (
                                        <button
                                            key={tab}
                                            type="button"
                                            className={`tab-link ${activeTab === tab ? "active" : ""}`}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {loadingCareerDetails ? (
                                    <div className="explore-empty-state">Loading career details...</div>
                                ) : (
                                    <div className="details-content">
                                        <div className="job-description-block">
                                            <h4>
                                                {activeTab === "Overview"
                                                    ? "Job Description"
                                                    : activeTab === "Skills"
                                                        ? "Required Skills"
                                                        : activeTab === "Job Roles"
                                                            ? "Common Job Roles"
                                                            : "Top Companies"}
                                            </h4>

                                            <ul className="job-list">
                                                {selectedCareerTabItems.length > 0 ? (
                                                    selectedCareerTabItems.map((item) => (
                                                        <li key={item}>
                                                            <span className="job-list-icon">
                                                                <DocMiniIcon />
                                                            </span>
                                                            <span>{item}</span>
                                                        </li>
                                                    ))
                                                ) : (
                                                    <li>
                                                        <span className="job-list-icon">
                                                            <DocMiniIcon />
                                                        </span>
                                                        <span>No data available yet.</span>
                                                    </li>
                                                )}
                                            </ul>
                                        </div>

                                        <div className="salary-trend-card">
                                            <div className="salary-trend-top">
                                                <h4>Salary Trend</h4>
                                                <span className="trend-badge">
                                                    {selectedCareer.salaryTrendLabel || "+0%"}
                                                </span>
                                            </div>

                                            <SalaryTrendChart points={selectedCareer.salaryTrendPoints || []} />

                                            <div className="trend-range">
                                                <span>{salaryMini(selectedCareer.salaryMin)}</span>
                                                <span>{salaryMini(selectedCareer.salaryMax)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="details-actions">
                                    <button type="button" className="primary-goal-btn" onClick={handleSetCareerGoal}>
                                        <HeartOutlineIcon />
                                        <span>Set as Career Goal</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="secondary-roadmap-btn"
                                        onClick={() => setPageMessage("Roadmap page will be connected next.")}
                                    >
                                        <span>View Roadmap</span>
                                        <ArrowRightIcon />
                                    </button>
                                </div>
                            </article>

                            <article className="courses-card">
                                <div className="section-title-row course-title-row">
                                    <h2>Recommended Courses</h2>
                                    <button type="button" className="view-all-link">
                                        <span>View All</span>
                                        <ArrowRightIcon />
                                    </button>
                                </div>

                                {loadingCourses ? (
                                    <div className="explore-empty-state">Loading courses...</div>
                                ) : coursesError ? (
                                    <div className="explore-empty-state error-state">{coursesError}</div>
                                ) : courses.length === 0 ? (
                                    <div className="explore-empty-state">
                                        No courses are available for this career yet.
                                    </div>
                                ) : (
                                    <div className="course-list">
                                        {courses.map((course) => (
                                            <div key={course._id} className="course-row">
                                                <div className="course-left">
                                                    <span className="course-logo">
                                                        <CourseLogoIcon />
                                                    </span>

                                                    <div className="course-meta">
                                                        <h4>{course.title}</h4>
                                                        <p>{course.provider}</p>
                                                    </div>
                                                </div>

                                                <div className="course-right">
                                                    <div className="course-progress-wrap">
                                                        <div className="course-progress-bar">
                                                            <div
                                                                className="course-progress-fill"
                                                                style={{ width: `${course.progress || 0}%` }}
                                                            />
                                                        </div>
                                                        <span className="course-progress-text">{course.progress || 0}%</span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="start-btn"
                                                        onClick={() => handleStartCourse(course)}
                                                    >
                                                        <span>{course.progress > 0 ? "Continue" : "Start"}</span>
                                                        <ArrowRightIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

function SalaryTrendChart({ points }) {
    if (!points || points.length < 2) {
        return <div className="chart-empty">Trend data not available</div>;
    }

    const width = 320;
    const height = 120;
    const padding = 14;

    const values = points.map((point) => point.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(max - min, 1);

    const polylinePoints = points
        .map((point, index) => {
            const x = padding + (index * (width - padding * 2)) / (points.length - 1);
            const y =
                height -
                padding -
                ((point.value - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        })
        .join(" ");

    const lastPoint = polylinePoints.split(" ").pop()?.split(",") || [width - padding, padding];
    const lastX = Number(lastPoint[0]);
    const lastY = Number(lastPoint[1]);

    return (
        <div className="trend-chart-real">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="trend-chart-svg"
                aria-hidden="true"
            >
                <polyline
                    points={polylinePoints}
                    fill="none"
                    stroke="#4F86E8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx={lastX} cy={lastY} r="5" fill="#4F86E8" />
            </svg>

            <div className="trend-label-row">
                <span>{points[0].label}</span>
                <span>{points[points.length - 1].label}</span>
            </div>
        </div>
    );
}

function getActiveTabItems(career, activeTab) {
    if (!career) return [];
    if (activeTab === "Skills") return career.requiredSkills || [];
    if (activeTab === "Job Roles") return career.jobRoles || [];
    if (activeTab === "Companies") return career.companies || [];
    return career.overview || [career.description || "No description available yet."];
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

function getBookmarkColor(title = "") {
    const normalized = title.toLowerCase();
    if (normalized.includes("data")) return "blue";
    if (normalized.includes("ai")) return "yellow";
    if (normalized.includes("cyber")) return "green";
    return "red";
}

function getCareerIcon(title = "") {
    const normalized = title.toLowerCase();
    if (normalized.includes("data")) return <DataScienceCareerIcon />;
    if (normalized.includes("ai")) return <AICareerIcon />;
    if (normalized.includes("cyber")) return <CyberCareerIcon />;
    return <SoftwareCareerIcon />;
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

function SearchIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function SearchSmallIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="11" cy="11" r="5.5" stroke="currentColor" strokeWidth="2" />
            <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path
                d="M12 20C11.7 20 11.4 19.9 11.2 19.7L5.3 14.4C3.2 12.5 3.1 9.2 5 7.2C6.9 5.1 10.1 5 12.1 6.9C14.1 5 17.3 5.1 19.2 7.2C21.1 9.2 21 12.5 18.9 14.4L13 19.7C12.8 19.9 12.4 20 12 20Z"
                fill="currentColor"
            />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M6 17H18L17 15V10C17 7.239 14.761 5 12 5C9.239 5 7 7.239 7 10V15L6 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M10 19C10.4 20 11.1 20.5 12 20.5C12.9 20.5 13.6 20 14 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function ChevronDownIcon() {
    return <SimpleIcon d="M6 9L12 15L18 9" strokeOnly />;
}

function ChevronLeftIcon() {
    return <SimpleIcon d="M15 6L9 12L15 18" strokeOnly />;
}

function ArrowRightIcon() {
    return <SimpleIcon d="M5 12H19M13 6L19 12L13 18" strokeOnly />;
}

function FilterTuneIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M4 7H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M18 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M14 17V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="14" r="2" stroke="currentColor" strokeWidth="2" />
            <circle cx="14" cy="10" r="2" stroke="currentColor" strokeWidth="2" />
        </svg>
    );
}

function BookmarkIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path d="M8 5H16C17.105 5 18 5.895 18 7V19L12 15.5L6 19V7C6 5.895 6.895 5 8 5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        </svg>
    );
}

function DocMiniIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
            <path d="M8 9H16M8 13H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function HeartOutlineIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <path
                d="M12 20C11.7 20 11.4 19.9 11.2 19.7L5.3 14.4C3.2 12.5 3.1 9.2 5 7.2C6.9 5.1 10.1 5 12.1 6.9C14.1 5 17.3 5.1 19.2 7.2C21.1 9.2 21 12.5 18.9 14.4L13 19.7C12.8 19.9 12.4 20 12 20Z"
                stroke="currentColor"
                strokeWidth="2"
            />
        </svg>
    );
}

function CourseLogoIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" width="24" height="24">
            <circle cx="12" cy="12" r="10" fill="#EAF2FF" />
            <path d="M8 12A4 4 0 0 1 12 8H15" stroke="#4F86E8" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M16 12A4 4 0 0 1 12 16H9" stroke="#4F86E8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
    );
}

function DataScienceCareerIcon() {
    return (
        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" width="56" height="56">
            <rect x="7" y="11" width="18" height="24" rx="6" fill="#DDEBFF" />
            <circle cx="20" cy="22" r="9" fill="#A5C5F8" />
            <path d="M25 28L33 36" stroke="#F0A15E" strokeWidth="4" strokeLinecap="round" />
            <circle cx="36" cy="39" r="5" fill="#F6C27F" />
            <rect x="29" y="10" width="14" height="10" rx="3" fill="#78A8F0" />
        </svg>
    );
}

function AICareerIcon() {
    return (
        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" width="56" height="56">
            <path d="M18 15C12 15 8 19 8 25C8 31 12 35 18 35C21 35 23.5 33.7 25.2 31.8C26.9 33.7 29.4 35 32.5 35C38.5 35 43 30.7 43 24.8C43 18.8 38.5 14 32.5 14C29.3 14 26.8 15.5 25.2 17.7C23.6 16.1 21.1 15 18 15Z" fill="#F6D370" />
            <path d="M18 15C24 15 28 19 28 25C28 31 24 35 18 35C12 35 8 31 8 25C8 19 12 15 18 15Z" fill="#7FAEF2" />
            <circle cx="19" cy="24" r="2" fill="white" />
            <circle cx="31" cy="24" r="2" fill="white" />
        </svg>
    );
}

function CyberCareerIcon() {
    return (
        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" width="56" height="56">
            <path
                d="M28 8L43 13V23.5C43 33 37 41 28 45.5C19 41 13 33 13 23.5V13L28 8Z"
                fill="#E8F1FF"
                stroke="#4F86E8"
                strokeWidth="3"
            />
            <path d="M28 18C25.5 18 24 19.8 24 22V25H32V22C32 19.8 30.5 18 28 18Z" fill="#7AAAF1" />
            <rect x="22" y="24" width="12" height="10" rx="3" fill="#4F86E8" />
        </svg>
    );
}

function SoftwareCareerIcon() {
    return (
        <svg viewBox="0 0 56 56" fill="none" aria-hidden="true" width="56" height="56">
            <rect x="7" y="11" width="42" height="24" rx="4" fill="#EEF4FF" stroke="#7CAAF1" strokeWidth="3" />
            <path d="M20 22L16 25.5L20 29" stroke="#4F86E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36 22L40 25.5L36 29" stroke="#4F86E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M30 18L26 33" stroke="#7CAAF1" strokeWidth="3" strokeLinecap="round" />
            <rect x="18" y="38" width="20" height="3.5" rx="1.75" fill="#C7DAFA" />
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

export default ExploreCareersPage;