import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/WelcomePage.css";

const welcomeNavLinks = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "About", to: "/about" },
];

function WelcomePage() {
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userName = storedUser?.name || "User";

    return (
        <div className="welcome-page">
            <Header
                navLinks={welcomeNavLinks}
                homePath="/dashboard"
                showProfileButton={true}
                profilePath="/dashboard"
            />

            <main className="welcome-main">
                <section className="welcome-hero-card">
                    <div className="welcome-badge">Account Created Successfully</div>

                    <h1 className="welcome-title">
                        Welcome, <span>{userName}</span>
                    </h1>

                    <p className="welcome-description">
                        Your Career Guidance account is ready. Complete your profile to unlock
                        personalized career recommendations, skill gap analysis, roadmap planning,
                        and progress tracking.
                    </p>

                    <div className="welcome-actions">
                        <Link to="/profile-setup" className="welcome-primary-btn">
                            Complete Profile
                        </Link>

                        <Link to="/dashboard" className="welcome-secondary-btn">
                            Skip for Now
                        </Link>
                    </div>
                </section>

                <section className="welcome-next-section">
                    <h2 className="welcome-section-heading">What You Can Do Next</h2>

                    <div className="welcome-steps-grid">
                        <article className="welcome-step-card">
                            <div className="welcome-step-number">1</div>
                            <div className="welcome-step-icon">
                                <ProfileSetupIcon />
                            </div>
                            <h3>Complete Your Profile</h3>
                            <p>
                                Add your education, skills, career interests, and experience to help
                                the system understand your background.
                            </p>
                        </article>

                        <article className="welcome-step-card">
                            <div className="welcome-step-number">2</div>
                            <div className="welcome-step-icon">
                                <PredictionIcon />
                            </div>
                            <h3>Get Career Prediction</h3>
                            <p>
                                Receive AI-powered career recommendations based on your profile,
                                interests, and readiness level.
                            </p>
                        </article>

                        <article className="welcome-step-card">
                            <div className="welcome-step-number">3</div>
                            <div className="welcome-step-icon">
                                <RoadmapIcon />
                            </div>
                            <h3>Follow a Learning Roadmap</h3>
                            <p>
                                Explore step-by-step guidance, courses, and skills needed to reach
                                your target career path.
                            </p>
                        </article>
                    </div>
                </section>

                <section className="welcome-feature-strip">
                    <div className="welcome-feature-box">
                        <div className="welcome-feature-icon">
                            <CareerIcon />
                        </div>
                        <div>
                            <h4>Personalized Careers</h4>
                            <p>Discover career paths that fit your profile and goals.</p>
                        </div>
                    </div>

                    <div className="welcome-feature-box">
                        <div className="welcome-feature-icon">
                            <SkillGapIcon />
                        </div>
                        <div>
                            <h4>Skill Gap Analysis</h4>
                            <p>See which important skills you still need to improve.</p>
                        </div>
                    </div>

                    <div className="welcome-feature-box">
                        <div className="welcome-feature-icon">
                            <ProgressIcon />
                        </div>
                        <div>
                            <h4>Progress Tracking</h4>
                            <p>Monitor your learning progress and career readiness score.</p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer homePath="/dashboard" />
        </div>
    );
}

function ProfileSetupIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect x="10" y="12" width="44" height="40" rx="10" fill="#EEF4FF" />
            <path
                d="M22 24H42"
                stroke="#6F9FEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M22 34H38"
                stroke="#6F9FEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <circle cx="20" cy="24" r="3" fill="#4F86E8" />
            <circle cx="20" cy="34" r="3" fill="#4F86E8" />
        </svg>
    );
}

function PredictionIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle
                cx="30"
                cy="30"
                r="16"
                fill="#EEF4FF"
                stroke="#8BB2F3"
                strokeWidth="4"
            />
            <path
                d="M18 30H42"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M30 18V42"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M42 42L52 52"
                stroke="#4F86E8"
                strokeWidth="5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function RoadmapIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
                d="M20 52L15 30C13 23 18 16 25 16H39C46 16 51 23 49 30L44 52H20Z"
                fill="#EEF4FF"
                stroke="#BCD2F8"
                strokeWidth="3"
            />
            <path
                d="M32 22V38"
                stroke="#6D9CE8"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M24 30H40"
                stroke="#6D9CE8"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M42 14L50 22"
                stroke="#F1C467"
                strokeWidth="4"
                strokeLinecap="round"
            />
        </svg>
    );
}

function CareerIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <circle cx="32" cy="32" r="18" fill="#EEF4FF" stroke="#BCD2F8" strokeWidth="4" />
            <path
                d="M18 32H46"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M32 18V46"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <circle cx="32" cy="32" r="6" fill="#4F86E8" />
        </svg>
    );
}

function SkillGapIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <rect
                x="18"
                y="12"
                width="28"
                height="40"
                rx="8"
                fill="#EEF4FF"
                stroke="#BCD2F8"
                strokeWidth="3"
            />
            <path
                d="M24 24H40"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M24 34H40"
                stroke="#6E9EEA"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M12 46L22 36"
                stroke="#4F86E8"
                strokeWidth="5"
                strokeLinecap="round"
            />
        </svg>
    );
}

function ProgressIcon() {
    return (
        <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path d="M14 50H50" stroke="#BCD2F8" strokeWidth="4" strokeLinecap="round" />
            <rect x="18" y="34" width="7" height="16" rx="3" fill="#8EB6F7" />
            <rect x="29" y="26" width="7" height="24" rx="3" fill="#F1C468" />
            <rect x="40" y="18" width="7" height="32" rx="3" fill="#6D9CE8" />
            <path
                d="M16 22L25 18L34 24L46 12"
                stroke="#F2A564"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default WelcomePage;