import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/HomePage.css";
import homeImage from "../assets/home.png";

const visitorNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/explore-careers" },
    { label: "About", to: "/about" },
];

const features = [
    {
        title: "Career Prediction",
        description: "AI-powered career recommendations",
        icon: <PredictionIcon />,
    },
    {
        title: "Skill Gap Analysis",
        description: "Identify missing skills for your desired job",
        icon: <SkillGapIcon />,
    },
    {
        title: "Personalized Learning Roadmap",
        description: "Step-by-step guide for your career path",
        icon: <RoadmapIcon />,
    },
    {
        title: "Progress Tracking",
        description: "Monitor and achieve your career goals",
        icon: <ProgressIcon />,
    },
];

const careers = [
    {
        title: "Data Scientist",
        salary: "$90k - $140k / year",
        skills: "Python, Machine Learning, Statistics",
        icon: <DataScientistIcon />,
    },
    {
        title: "Cyber Security",
        salary: "$80k - $120k / year",
        skills: "Networking, Security, Cyber Defense",
        icon: <CyberSecurityIcon />,
    },
    {
        title: "Software Engineer",
        salary: "$85k - $130k / year",
        skills: "JavaScript, React, SQL",
        icon: <SoftwareEngineerIcon />,
    },
];

function HomePage() {
    return (
        <div className="visitor-home">
            <Header
                navLinks={visitorNavLinks}
                homePath="/"
                showProfileButton={false}
                rightAction={{
                    type: "button",
                    label: "Login / Register",
                    to: "/auth",
                }}
            />

            <main className="home-main">
                <section className="hero-section">
                    <div className="hero-copy">
                        <h1 className="hero-title">
                            Find Your Ideal
                            <br />
                            <span>Career Path</span>
                        </h1>

                        <p className="hero-description">
                            AI-powered career guidance and skill development platform.
                        </p>

                        <div className="hero-actions">
                            <Link to="/auth" className="hero-primary-btn">
                                Get Started
                            </Link>

                            <Link to="/explore-careers" className="hero-secondary-btn">
                                Explore Careers
                            </Link>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <img src={homeImage} alt="Career guidance illustration" className="hero-image" />
                    </div>
                </section>

                <section className="features-section">
                    <div className="features-grid">
                        {features.map((feature) => (
                            <article key={feature.title} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="popular-careers-section">
                    <h2 className="section-heading">Popular Career Paths</h2>

                    <div className="career-cards">
                        {careers.map((career) => (
                            <article key={career.title} className="career-card">
                                <div className="career-card-top">
                                    <div className="career-icon">{career.icon}</div>
                                    <div>
                                        <h3>{career.title}</h3>
                                        <p className="career-salary">{career.salary}</p>
                                    </div>
                                </div>

                                <p className="career-skills">
                                    <strong>Requires:</strong> {career.skills}
                                </p>

                                <Link to="/explore-careers" className="career-btn">
                                    Learn More
                                </Link>
                            </article>
                        ))}
                    </div>
                </section>
            </main>

            <Footer homePath="/" />
        </div>
    );
}

function PredictionIcon() {
    return (
        <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <circle cx="36" cy="36" r="25" fill="#EFF5FF" stroke="#BCD2F8" strokeWidth="3" />
            <path d="M19 37H53" stroke="#7CAAF1" strokeWidth="3" strokeLinecap="round" />
            <path d="M36 19V53" stroke="#7CAAF1" strokeWidth="3" strokeLinecap="round" />
            <circle cx="36" cy="36" r="8" fill="#76A6EF" />
            <path d="M48 24L55 17" stroke="#A5C3F6" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function SkillGapIcon() {
    return (
        <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <rect x="20" y="12" width="32" height="44" rx="6" fill="#EEF4FF" stroke="#BFD4F8" strokeWidth="3" />
            <path d="M28 25H44" stroke="#6E9EEA" strokeWidth="4" strokeLinecap="round" />
            <path d="M28 34H44" stroke="#6E9EEA" strokeWidth="4" strokeLinecap="round" />
            <path d="M28 43H39" stroke="#AFC7F5" strokeWidth="4" strokeLinecap="round" />
            <path d="M14 50L23 41" stroke="#7BA9F1" strokeWidth="5" strokeLinecap="round" />
            <path d="M23 41L27 45" stroke="#7BA9F1" strokeWidth="5" strokeLinecap="round" />
        </svg>
    );
}

function RoadmapIcon() {
    return (
        <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <path
                d="M21 51L16 31C14 24 19 17 26 17H46C53 17 58 24 55 31L50 51H21Z"
                fill="#EEF4FF"
                stroke="#BCD2F8"
                strokeWidth="3"
            />
            <path d="M35 22V37" stroke="#6D9CE8" strokeWidth="4" strokeLinecap="round" />
            <path d="M28 30H42" stroke="#6D9CE8" strokeWidth="4" strokeLinecap="round" />
            <path d="M45 13L53 21" stroke="#F1C467" strokeWidth="4" strokeLinecap="round" />
            <path d="M53 21L58 14" stroke="#F1C467" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}

function ProgressIcon() {
    return (
        <svg viewBox="0 0 72 72" fill="none" aria-hidden="true">
            <path d="M16 54H56" stroke="#B8CFF8" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="37" width="8" height="17" rx="3" fill="#8EB6F7" />
            <rect x="32" y="29" width="8" height="25" rx="3" fill="#F1C468" />
            <rect x="44" y="20" width="8" height="34" rx="3" fill="#6D9CE8" />
            <path d="M18 23L28 17L37 24L52 11" stroke="#F2A564" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M48 11H52V15" stroke="#F2A564" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DataScientistIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="10" y="18" width="20" height="28" rx="8" fill="#DCEBFF" />
            <circle cx="24" cy="30" r="10" fill="#A5C5F8" />
            <path d="M30 36L39 45" stroke="#F09D5E" strokeWidth="5" strokeLinecap="round" />
            <circle cx="42" cy="48" r="6" fill="#F6C27F" />
            <rect x="33" y="16" width="17" height="12" rx="3" fill="#7AA9F1" />
            <path d="M37 22H46" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}

function CyberSecurityIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
                d="M32 10L49 16V28C49 39 42 48 32 53C22 48 15 39 15 28V16L32 10Z"
                fill="#E8F1FF"
                stroke="#76A5EF"
                strokeWidth="4"
            />
            <path d="M32 22C29 22 27 24 27 27V32H37V27C37 24 35 22 32 22Z" fill="#76A5EF" />
            <rect x="24" y="31" width="16" height="12" rx="4" fill="#4E86E8" />
            <circle cx="32" cy="37" r="2.5" fill="white" />
        </svg>
    );
}

function SoftwareEngineerIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="10" y="14" width="44" height="28" rx="5" fill="#EEF4FF" stroke="#8AB3F4" strokeWidth="3" />
            <path d="M24 28L19 32L24 36" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 28L45 32L40 36" stroke="#4F86E8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M34 24L30 40" stroke="#7BAAF1" strokeWidth="4" strokeLinecap="round" />
            <rect x="20" y="46" width="24" height="4" rx="2" fill="#BBD2F8" />
        </svg>
    );
}

export default HomePage;