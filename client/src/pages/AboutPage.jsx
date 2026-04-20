import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/StaticInfoPage.css";

const visitorNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function AboutPage() {
    return (
        <div className="static-page">
            <Header
                navLinks={visitorNavLinks}
                homePath="/"
                rightAction={{ label: "Login / Register", to: "/auth" }}
                mode="auto"
            />

            <main className="static-page-main">
                <section className="static-page-card">
                    <span className="static-page-chip">About Us</span>
                    <h1>About Career Guidance</h1>
                    <p>
                        Career Guidance is an AI-powered platform designed to help users discover
                        suitable career paths, understand required skills, follow personalized
                        roadmaps, track progress, and continue learning through structured courses.
                    </p>

                    <div className="static-page-grid">
                        <article>
                            <h3>What we provide</h3>
                            <p>
                                Career prediction, roadmap planning, progress tracking, curated courses,
                                and career exploration features in one connected system.
                            </p>
                        </article>

                        <article>
                            <h3>Who it is for</h3>
                            <p>
                                Students, fresh graduates, and learners who want a clear path toward
                                a suitable career in technology and related fields.
                            </p>
                        </article>

                        <article>
                            <h3>Our goal</h3>
                            <p>
                                To make career planning more personalized, practical, and easier to follow.
                            </p>
                        </article>

                        <article>
                            <h3>How it works</h3>
                            <p>
                                Users complete their profile, receive AI-supported recommendations,
                                choose a target goal, and then grow through roadmap and course tracking.
                            </p>
                        </article>
                    </div>
                </section>
            </main>

            <Footer homePath="/" />
        </div>
    );
}

export default AboutPage;