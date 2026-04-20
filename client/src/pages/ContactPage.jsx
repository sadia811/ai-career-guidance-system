import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/StaticInfoPage.css";

const visitorNavLinks = [
    { label: "Home", to: "/" },
    { label: "Explore Careers", to: "/app/explore-careers" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function ContactPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

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
                    <span className="static-page-chip">Contact Us</span>
                    <h1>Get in touch</h1>
                    <p>
                        Questions, feedback, or support requests can be sent through this form.
                    </p>

                    <form className="static-contact-form" onSubmit={handleSubmit}>
                        <input type="text" placeholder="Your name" required />
                        <input type="email" placeholder="Your email" required />
                        <textarea rows="6" placeholder="Write your message here" required />

                        <button type="submit" className="static-submit-btn">
                            Send Message
                        </button>
                    </form>

                    {submitted && (
                        <p className="static-success-text">
                            Message submitted. The real backend contact endpoint can be connected next.
                        </p>
                    )}
                </section>
            </main>

            <Footer homePath="/" />
        </div>
    );
}

export default ContactPage;