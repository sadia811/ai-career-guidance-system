import { useMemo, useState } from "react";
import "../styles/ExploreCareersPage.css";

const sidebarItems = [
    { key: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
    { key: "profile", label: "Profile", icon: <ProfileIcon /> },
    { key: "prediction", label: "Career Prediction", icon: <PredictionIcon /> },
    { key: "explore", label: "Explore Careers", icon: <BagIcon /> },
    { key: "roadmap", label: "Roadmap", icon: <RoadmapIcon /> },
    { key: "progress", label: "Progress Tracker", icon: <ProgressIcon /> },
    { key: "courses", label: "Courses", icon: <CoursesIcon /> },
    { key: "resources", label: "Resources", icon: <ResourcesIcon /> },
    { key: "logout", label: "Logout", icon: <LogoutIcon /> },
];

const careersData = [
    {
        id: 1,
        title: "Data Scientist",
        salary: "$90k - $140k / year",
        skills: ["Python", "ML", "SQL"],
        overview: [
            "Collect and analyze data",
            "Build predictive models",
            "Visualize insights for business decisions",
        ],
        salaryTrend: "+12%",
        salaryRangeMini: "$80k",
        salaryRangeMaxi: "$140k",
        courses: [
            { id: 1, title: "Python for Data Science", provider: "Coursera", progress: 60 },
            { id: 2, title: "Machine Learning Basics", provider: "edX", progress: 45 },
            { id: 3, title: "Data Visualization with Power BI", provider: "Udemy", progress: 0 },
        ],
        icon: <DataScienceCareerIcon />,
        bookmarkColor: "blue",
    },
    {
        id: 2,
        title: "AI Engineer",
        salary: "$95k - $150k / year",
        skills: ["Python", "Deep Learning"],
        overview: [
            "Design intelligent systems",
            "Train and optimize AI models",
            "Deploy models into real-world applications",
        ],
        salaryTrend: "+15%",
        salaryRangeMini: "$90k",
        salaryRangeMaxi: "$150k",
        courses: [
            { id: 4, title: "Deep Learning Fundamentals", provider: "Coursera", progress: 35 },
            { id: 5, title: "Neural Networks Essentials", provider: "Udacity", progress: 20 },
            { id: 6, title: "AI Model Deployment", provider: "edX", progress: 0 },
        ],
        icon: <AICareerIcon />,
        bookmarkColor: "yellow",
    },
    {
        id: 3,
        title: "Cyber Security Analyst",
        salary: "$80k - $120k / year",
        skills: ["Networking", "Security", "Ethical Hacking"],
        overview: [
            "Protect systems and data",
            "Monitor security threats",
            "Assess vulnerabilities and risks",
        ],
        salaryTrend: "+10%",
        salaryRangeMini: "$75k",
        salaryRangeMaxi: "$120k",
        courses: [
            { id: 7, title: "Network Security Basics", provider: "Coursera", progress: 30 },
            { id: 8, title: "Ethical Hacking Foundations", provider: "Udemy", progress: 10 },
            { id: 9, title: "Cyber Defense Essentials", provider: "edX", progress: 0 },
        ],
        icon: <CyberCareerIcon />,
        bookmarkColor: "green",
    },
    {
        id: 4,
        title: "Software Engineer",
        salary: "$85k - $130k / year",
        skills: ["JavaScript", "React", "SQL"],
        overview: [
            "Build scalable software systems",
            "Develop front-end and back-end features",
            "Maintain product quality and performance",
        ],
        salaryTrend: "+11%",
        salaryRangeMini: "$85k",
        salaryRangeMaxi: "$130k",
        courses: [
            { id: 10, title: "React Development Track", provider: "Udemy", progress: 50 },
            { id: 11, title: "JavaScript Mastery", provider: "Coursera", progress: 40 },
            { id: 12, title: "SQL for Developers", provider: "edX", progress: 15 },
        ],
        icon: <SoftwareCareerIcon />,
        bookmarkColor: "red",
    },
];

function ExploreCareersPage() {
    const [selectedCareerId, setSelectedCareerId] = useState(1);
    const [activeTab, setActiveTab] = useState("Overview");

    const selectedCareer = useMemo(
        () => careersData.find((career) => career.id === selectedCareerId) ?? careersData[0],
        [selectedCareerId]
    );

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
                        <input type="text" placeholder="Search careers, skills..." />
                    </div>

                    <button type="button" className="saved-btn">
                        <HeartIcon />
                        <span>Saved</span>
                    </button>

                    <button type="button" className="icon-btn notification-btn">
                        <BellIcon />
                        <span className="notif-badge">3</span>
                    </button>

                    <button type="button" className="profile-chip">
                        <AvatarIcon />
                        <span>Sadia</span>
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
                            <input type="text" placeholder="Search careers..." />
                            <SearchSmallIcon />
                        </div>

                        <button type="button" className="filter-select">
                            <span>Industry</span>
                            <ChevronDownIcon />
                        </button>

                        <button type="button" className="filter-select">
                            <span>Experience</span>
                            <ChevronDownIcon />
                        </button>

                        <button type="button" className="filter-select">
                            <span>Salary Range</span>
                            <ChevronDownIcon />
                        </button>

                        <button type="button" className="apply-filter-btn">
                            <FilterTuneIcon />
                            <span>Apply Filters</span>
                        </button>
                    </section>

                    <section className="popular-careers-block">
                        <div className="section-title-row">
                            <h2>Popular Career Paths</h2>
                            <button type="button" className="view-all-link">
                                <span>View All</span>
                                <ArrowRightIcon />
                            </button>
                        </div>

                        <div className="career-grid">
                            {careersData.map((career) => (
                                <button
                                    key={career.id}
                                    type="button"
                                    className={`career-tile ${selectedCareerId === career.id ? "selected" : ""}`}
                                    onClick={() => setSelectedCareerId(career.id)}
                                >
                                    <div className="career-tile-top">
                                        <div className="career-tile-icon">{career.icon}</div>
                                        <span className={`bookmark-chip ${career.bookmarkColor}`}>
                                            <BookmarkIcon />
                                        </span>
                                    </div>

                                    <h3>{career.title}</h3>

                                    <p className="career-money">
                                        <span className="money-symbol">$</span> {career.salary}
                                    </p>

                                    <div className="skill-pill-wrap">
                                        {career.skills.map((skill) => (
                                            <span key={skill} className="skill-pill">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <span className="view-details-btn">
                                        <span>View Details</span>
                                        <ArrowRightIcon />
                                    </span>
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="details-courses-grid">
                        <article className="career-details-card">
                            <div className="details-header">
                                <div className="details-left">
                                    <button type="button" className="back-inline-btn">
                                        <ChevronLeftIcon />
                                    </button>
                                    <span className="details-title">Career Details</span>
                                    <span className="details-career-icon">{selectedCareer.icon}</span>
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

                            <div className="details-content">
                                <div className="job-description-block">
                                    <h4>Job Description</h4>

                                    <ul className="job-list">
                                        {selectedCareer.overview.map((item) => (
                                            <li key={item}>
                                                <span className="job-list-icon">
                                                    <DocMiniIcon />
                                                </span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="salary-trend-card">
                                    <div className="salary-trend-top">
                                        <h4>Salary Trend</h4>
                                        <span className="trend-badge">{selectedCareer.salaryTrend}</span>
                                    </div>

                                    <div className="trend-chart">
                                        <div className="chart-line" />
                                        <div className="chart-dot" />
                                    </div>

                                    <div className="trend-range">
                                        <span>{selectedCareer.salaryRangeMini}</span>
                                        <span>{selectedCareer.salaryRangeMaxi}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="details-actions">
                                <button type="button" className="primary-goal-btn">
                                    <HeartOutlineIcon />
                                    <span>Set as Career Goal</span>
                                </button>

                                <button type="button" className="secondary-roadmap-btn">
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

                            <div className="course-list">
                                {selectedCareer.courses.map((course) => (
                                    <div key={course.id} className="course-row">
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
                                                        style={{ width: `${course.progress}%` }}
                                                    />
                                                </div>
                                                <span className="course-progress-text">{course.progress}%</span>
                                            </div>

                                            <button type="button" className="start-btn">
                                                <span>Start</span>
                                                <ArrowRightIcon />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </article>
                    </section>
                </main>
            </div>
        </div>
    );
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

function AvatarIcon() {
    return (
        <span className="avatar-circle" aria-hidden="true">
            <span className="avatar-hair" />
            <span className="avatar-face" />
            <span className="avatar-body" />
        </span>
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